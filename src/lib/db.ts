import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";
import { getSeedCopy } from "@/lib/mockData";
import type { AppActivity, DailyObservation, Plot, User, UserRole } from "@/types";

const globalForFlora = globalThis as unknown as {
  floraPool?: Pool;
  floraInitPromise?: Promise<void>;
};

export function dbPool(): Pool {
  if (!globalForFlora.floraPool) {
    globalForFlora.floraPool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "florastudio",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
      timezone: "Z",
    });
  }
  return globalForFlora.floraPool;
}

export async function ensureDatabase(): Promise<void> {
  if (!globalForFlora.floraInitPromise) {
    globalForFlora.floraInitPromise = initializeDatabase().catch((error) => {
      globalForFlora.floraInitPromise = undefined;
      throw error;
    });
  }
  return globalForFlora.floraInitPromise;
}

async function initializeDatabase(): Promise<void> {
  const pool = dbPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','user') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS plots (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(191) NOT NULL,
    payload LONGTEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS observations (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    plot_id VARCHAR(100) NOT NULL,
    date_time VARCHAR(40) NOT NULL,
    payload LONGTEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX observations_plot_date_idx (plot_id, date_time),
    CONSTRAINT observations_plot_fk FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    message VARCHAR(500) NOT NULL,
    date_time VARCHAR(40) NOT NULL,
    type ENUM('plot','observation','settings') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX activities_created_idx (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS app_meta (
    meta_key VARCHAR(100) NOT NULL PRIMARY KEY,
    meta_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  const [userCountRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM users");
  if (Number(userCountRows[0]?.total || 0) === 0) {
    if (process.env.NODE_ENV === "production" && (
      !process.env.ADMIN_PASSWORD || !process.env.USER_PASSWORD ||
      process.env.ADMIN_PASSWORD === "admin123" || process.env.USER_PASSWORD === "user123" ||
      !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32
    )) {
      throw new Error("Set unique ADMIN_PASSWORD, USER_PASSWORD, and a SESSION_SECRET of at least 32 characters before production initialization.");
    }
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@florastudio.id").trim().toLowerCase();
    const userEmail = (process.env.USER_EMAIL || "user@florastudio.id").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const userPassword = process.env.USER_PASSWORD || "user123";
    const adminHash = await bcrypt.hash(adminPassword, 12);
    const userHash = await bcrypt.hash(userPassword, 12);
    await pool.execute(
      "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)",
      ["usr-admin", "Admin FloraStudio", adminEmail, adminHash, "admin", "usr-user", "Petani / Operator Kebun", userEmail, userHash, "user"],
    );
  }

  const [seededRows] = await pool.execute<RowDataPacket[]>("SELECT meta_value FROM app_meta WHERE meta_key = ?", ["demo_data_seeded"]);
  if (seededRows.length === 0) {
    const seed = getSeedCopy();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const plot of seed.plots) {
        await connection.execute("INSERT IGNORE INTO plots (id, code, name, payload) VALUES (?, ?, ?, ?)", [plot.id, plot.code, plot.name, JSON.stringify(plot)]);
      }
      for (const observation of seed.observations) {
        await connection.execute("INSERT IGNORE INTO observations (id, plot_id, date_time, payload) VALUES (?, ?, ?, ?)", [observation.id, observation.plotId, observation.dateTime, JSON.stringify(observation)]);
      }
      const [activityCountRows] = await connection.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM activities");
      if (Number(activityCountRows[0]?.total || 0) === 0) {
        const initialActivity: AppActivity = { id: "activity-start-1", message: "Data awal FloraStudio berhasil disiapkan", dateTime: new Date().toISOString(), type: "settings" };
        await connection.execute("INSERT INTO activities (id, message, date_time, type) VALUES (?, ?, ?, ?)", [initialActivity.id, initialActivity.message, initialActivity.dateTime, initialActivity.type]);
      }
      await connection.execute("INSERT INTO app_meta (meta_key, meta_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)", ["demo_data_seeded", "1"]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export async function findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const pool = dbPool();
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT id, name, email, role, password_hash FROM users WHERE email = ? LIMIT 1", [email.trim().toLowerCase()]);
  const row = rows[0];
  if (!row) return null;
  return { id: String(row.id), name: String(row.name), email: String(row.email), role: row.role as UserRole, passwordHash: String(row.password_hash) };
}

export async function findUserById(id: string): Promise<User | null> {
  const pool = dbPool();
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1", [id]);
  const row = rows[0];
  if (!row) return null;
  return { id: String(row.id), name: String(row.name), email: String(row.email), role: row.role as UserRole };
}

export async function readAppState(): Promise<{ plots: Plot[]; observations: DailyObservation[]; activities: AppActivity[] }> {
  const pool = dbPool();
  const [plotRows] = await pool.query<RowDataPacket[]>("SELECT payload FROM plots ORDER BY code ASC");
  const [observationRows] = await pool.query<RowDataPacket[]>("SELECT payload FROM observations ORDER BY date_time DESC, id ASC");
  const [activityRows] = await pool.query<RowDataPacket[]>("SELECT id, message, date_time, type FROM activities ORDER BY created_at DESC, id DESC LIMIT 30");
  return {
    plots: plotRows.map((row) => JSON.parse(String(row.payload)) as Plot),
    observations: observationRows.map((row) => JSON.parse(String(row.payload)) as DailyObservation),
    activities: activityRows.map((row) => ({ id: String(row.id), message: String(row.message), dateTime: String(row.date_time), type: row.type as AppActivity["type"] })),
  };
}

export async function addActivity(message: string, type: AppActivity["type"]): Promise<void> {
  const pool = dbPool();
  await pool.execute("INSERT INTO activities (id, message, date_time, type) VALUES (?, ?, ?, ?)", [
    `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    message.slice(0, 500), new Date().toISOString(), type,
  ]);
}

export async function resetDemoState(): Promise<void> {
  const pool = dbPool();
  const seed = getSeedCopy();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM observations");
    await connection.query("DELETE FROM plots");
    await connection.query("DELETE FROM activities");
    for (const plot of seed.plots) {
      await connection.execute("INSERT INTO plots (id, code, name, payload) VALUES (?, ?, ?, ?)", [plot.id, plot.code, plot.name, JSON.stringify(plot)]);
    }
    for (const observation of seed.observations) {
      await connection.execute("INSERT INTO observations (id, plot_id, date_time, payload) VALUES (?, ?, ?, ?)", [observation.id, observation.plotId, observation.dateTime, JSON.stringify(observation)]);
    }
    await connection.execute("INSERT INTO activities (id, message, date_time, type) VALUES (?, ?, ?, ?)", [`activity-reset-${Date.now()}`, "Dataset FloraStudio dipulihkan oleh administrator", new Date().toISOString(), "settings"]);
    await connection.execute("INSERT INTO app_meta (meta_key, meta_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)", ["demo_data_seeded", "1"]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function assertPlotExists(plotId: string): Promise<boolean> {
  const [rows] = await dbPool().execute<RowDataPacket[]>("SELECT id FROM plots WHERE id = ? LIMIT 1", [plotId]);
  return rows.length > 0;
}

export async function updatePlotPayload(plot: Plot): Promise<void> {
  await dbPool().execute("UPDATE plots SET code = ?, name = ?, payload = ? WHERE id = ?", [plot.code, plot.name, JSON.stringify(plot), plot.id]);
}

export async function getPlot(plotId: string): Promise<Plot | null> {
  const [rows] = await dbPool().execute<RowDataPacket[]>("SELECT payload FROM plots WHERE id = ? LIMIT 1", [plotId]);
  return rows.length ? JSON.parse(String(rows[0].payload)) as Plot : null;
}

export async function getObservation(observationId: string): Promise<DailyObservation | null> {
  const [rows] = await dbPool().execute<RowDataPacket[]>("SELECT payload FROM observations WHERE id = ? LIMIT 1", [observationId]);
  return rows.length ? JSON.parse(String(rows[0].payload)) as DailyObservation : null;
}

export async function insertPlot(plot: Plot): Promise<void> {
  await dbPool().execute("INSERT INTO plots (id, code, name, payload) VALUES (?, ?, ?, ?)", [plot.id, plot.code, plot.name, JSON.stringify(plot)]);
}

export async function insertObservation(observation: DailyObservation): Promise<void> {
  await dbPool().execute("INSERT INTO observations (id, plot_id, date_time, payload) VALUES (?, ?, ?, ?)", [observation.id, observation.plotId, observation.dateTime, JSON.stringify(observation)]);
}

export async function updateObservationPayload(observation: DailyObservation): Promise<void> {
  await dbPool().execute("UPDATE observations SET plot_id = ?, date_time = ?, payload = ? WHERE id = ?", [observation.plotId, observation.dateTime, JSON.stringify(observation), observation.id]);
}

export async function deleteObservationById(observationId: string): Promise<void> {
  await dbPool().execute("DELETE FROM observations WHERE id = ?", [observationId]);
}

export async function deletePlotById(plotId: string): Promise<void> {
  await dbPool().execute("DELETE FROM plots WHERE id = ?", [plotId]);
}

export async function listObservationsForPlot(plotId: string): Promise<DailyObservation[]> {
  const [rows] = await dbPool().execute<RowDataPacket[]>("SELECT payload FROM observations WHERE plot_id = ? ORDER BY date_time ASC, id ASC", [plotId]);
  return rows.map((row) => JSON.parse(String(row.payload)) as DailyObservation);
}

