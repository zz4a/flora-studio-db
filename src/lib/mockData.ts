import type { DailyObservation, Plot } from "@/types";

const image = (id: string, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const SEED_PLOTS: Plot[] = [
  {
    id: "plot-cabai", code: "LHN-001", name: "Kebun Cabai", crop: "Cabai Merah", variety: "Lado F1", area: 840, areaUnit: "m²", plantedAt: "2026-08-22", population: 1260,
    location: { province: "Riau", regency: "Kampar", address: "Area contoh, Kampar, Riau", description: "Contoh lahan dataran rendah dengan bedengan dan sistem irigasi sederhana." },
    description: "Cabai merah untuk demonstrasi pemantauan fase vegetatif hingga pembentukan buah.", health: "Sehat", cultivationStatus: "Aktif", progress: 68,
    image: image("photo-1760627823649-3b353622c16e"), imageAlt: "Cabai merah pada tanaman dengan daun hijau — foto ilustratif dari Unsplash",
    images: [{src:image("photo-1760627823649-3b353622c16e",900),alt:"Cabai merah — ilustrasi tanaman cabai",caption:"Tanaman cabai"},{src:image("photo-1497250681960-ef046c08a56e",900),alt:"Daun tanaman hijau — ilustrasi kondisi kebun",caption:"Kondisi vegetasi sekitar"}],
    notes: "Pantau kutu daun dan pertahankan drainase setelah hujan.", environment: {temperature:29.1,humidity:71,soilMoisture:48,rainfall:2.4,weather:"Cerah"},
    growthHistory: [{date:"2026-09-05",heightCm:12,leaves:8,healthScore:82,progress:22},{date:"2026-09-12",heightCm:18,leaves:12,healthScore:85,progress:31},{date:"2026-09-19",heightCm:26,leaves:18,healthScore:87,progress:40},{date:"2026-09-26",heightCm:34,leaves:24,healthScore:89,progress:49},{date:"2026-10-03",heightCm:43,leaves:31,healthScore:91,progress:58},{date:"2026-10-10",heightCm:51,leaves:38,healthScore:92,progress:63},{date:"2026-10-17",heightCm:58,leaves:46,healthScore:94,progress:68}]
  },
  {
    id: "plot-tomat", code: "LHN-002", name: "Kebun Tomat", crop: "Tomat", variety: "Servo F1", area: 620, areaUnit: "m²", plantedAt: "2026-08-10", population: 930,
    location: { province: "Riau", regency: "Pekanbaru", address: "Area contoh, Pekanbaru, Riau", description: "Contoh kebun tomat dengan ajir dan barisan tanam teratur." },
    description: "Tomat dengan pencatatan pembungaan, pembesaran buah, dan kelembapan tajuk.", health: "Perlu Perhatian", cultivationStatus: "Aktif", progress: 73,
    image: image("photo-1692039743891-fc44365e09cb"), imageAlt: "Buah tomat merah segar — foto ilustratif dari Unsplash",
    images: [{src:image("photo-1692039743891-fc44365e09cb",900),alt:"Buah tomat merah",caption:"Tomat"},{src:image("photo-1784043436675-dbe53cbcec88",900),alt:"Daun hijau untuk ilustrasi vegetasi kebun",caption:"Vegetasi"}],
    notes: "Periksa bercak daun setelah beberapa hari lembap; tingkatkan sirkulasi udara.", environment: {temperature:30.2,humidity:79,soilMoisture:54,rainfall:8.2,weather:"Berawan"},
    growthHistory: [{date:"2026-08-24",heightCm:15,leaves:9,healthScore:88,progress:19},{date:"2026-08-31",heightCm:24,leaves:15,healthScore:90,progress:29},{date:"2026-09-07",heightCm:35,leaves:23,healthScore:88,progress:39},{date:"2026-09-14",heightCm:46,leaves:31,healthScore:82,progress:50},{date:"2026-09-21",heightCm:58,leaves:40,healthScore:78,progress:59},{date:"2026-09-28",heightCm:67,leaves:48,healthScore:76,progress:66},{date:"2026-10-17",heightCm:79,leaves:56,healthScore:74,progress:73}]
  },
  {
    id: "plot-terong", code: "LHN-003", name: "Kebun Terong", crop: "Terong Ungu", variety: "Mustang", area: 950, areaUnit: "m²", plantedAt: "2026-07-28", population: 760,
    location: { province: "Riau", regency: "Siak", address: "Area contoh, Siak, Riau", description: "Contoh petak terong dengan tanaman berjarak lebar dan akses inspeksi." },
    description: "Terong ungu dengan riwayat pertambahan tinggi, jumlah daun, dan kesiapan berbuah.", health: "Sehat", cultivationStatus: "Aktif", progress: 81,
    image: image("photo-1560951812-58e6bce53149"), imageAlt: "Terong ungu segar pada tanaman — ilustrasi dari Unsplash",
    images: [{src:image("photo-1560951812-58e6bce53149",900),alt:"Terong ungu",caption:"Terong"},{src:image("photo-1497250681960-ef046c08a56e",900),alt:"Daun hijau sebagai ilustrasi kebun",caption:"Kondisi kebun"}],
    notes: "Pertahankan pemangkasan tunas liar dan pantau kumbang daun.", environment: {temperature:28.4,humidity:68,soilMoisture:46,rainfall:0,weather:"Cerah"},
    growthHistory: [{date:"2026-08-11",heightCm:17,leaves:10,healthScore:83,progress:20},{date:"2026-08-18",heightCm:25,leaves:16,healthScore:86,progress:31},{date:"2026-08-25",heightCm:37,leaves:25,healthScore:89,progress:42},{date:"2026-09-01",heightCm:49,leaves:34,healthScore:91,progress:54},{date:"2026-09-08",heightCm:61,leaves:43,healthScore:90,progress:64},{date:"2026-09-15",heightCm:70,leaves:52,healthScore:93,progress:73},{date:"2026-10-17",heightCm:82,leaves:63,healthScore:94,progress:81}]
  },
  {
    id: "plot-kangkung", code: "LHN-004", name: "Kebun Kangkung", crop: "Kangkung", variety: "Bangkok LP-1", area: 380, areaUnit: "m²", plantedAt: "2026-09-20", population: 4200,
    location: { province: "Riau", regency: "Pelalawan", address: "Area contoh, Pelalawan, Riau", description: "Contoh bedeng sayuran daun dengan rotasi tanam cepat." },
    description: "Kangkung darat dengan pemantauan cepat pada tinggi batang, daun, dan kelembapan media.", health: "Perawatan", cultivationStatus: "Aktif", progress: 56,
    image: image("photo-1569185835836-a9683f3c72a4"), imageAlt: "Sayuran hijau segar sebagai ilustrasi kangkung dari Unsplash",
    images: [{src:image("photo-1569185835836-a9683f3c72a4",900),alt:"Sayuran hijau — ilustrasi kangkung",caption:"Sayuran daun"},{src:image("photo-1784043436675-dbe53cbcec88",900),alt:"Daun sayuran hijau",caption:"Daun tanaman"}],
    notes: "Beberapa bedeng tampak terlalu basah; cek saluran keluar air.", environment: {temperature:27.8,humidity:84,soilMoisture:72,rainfall:15.6,weather:"Hujan"},
    growthHistory: [{date:"2026-09-24",heightCm:5,leaves:2,healthScore:76,progress:12},{date:"2026-09-28",heightCm:8,leaves:4,healthScore:78,progress:20},{date:"2026-10-02",heightCm:12,leaves:6,healthScore:75,progress:31},{date:"2026-10-06",heightCm:16,leaves:8,healthScore:71,progress:39},{date:"2026-10-10",heightCm:20,leaves:10,healthScore:72,progress:47},{date:"2026-10-14",heightCm:24,leaves:13,healthScore:74,progress:52},{date:"2026-10-17",heightCm:27,leaves:15,healthScore:76,progress:56}]
  },
  {
    id: "plot-bayam", code: "LHN-005", name: "Kebun Bayam", crop: "Bayam Hijau", variety: "Amaranthus Green", area: 440, areaUnit: "m²", plantedAt: "2026-09-27", population: 5100,
    location: { province: "Riau", regency: "Bengkalis", address: "Area contoh, Bengkalis, Riau", description: "Contoh kebun sayur daun dengan pola sebar dan panen bertahap." },
    description: "Bayam hijau yang dipantau berdasarkan jumlah daun, pertumbuhan awal, dan kebutuhan air.", health: "Sehat", cultivationStatus: "Aktif", progress: 44,
    image: image("photo-1784043436675-dbe53cbcec88"), imageAlt: "Daun bayam hijau — foto ilustratif dari Unsplash",
    images: [{src:image("photo-1784043436675-dbe53cbcec88",900),alt:"Daun bayam hijau",caption:"Bayam hijau"},{src:image("photo-1569185835836-a9683f3c72a4",900),alt:"Sayuran hijau sebagai ilustrasi bedengan",caption:"Bedengan sayuran"}],
    notes: "Kondisi umum baik; lakukan penyiangan ringan sebelum tajuk rapat.", environment: {temperature:29.0,humidity:73,soilMoisture:51,rainfall:1.2,weather:"Cerah"},
    growthHistory: [{date:"2026-10-01",heightCm:3,leaves:2,healthScore:81,progress:10},{date:"2026-10-04",heightCm:5,leaves:3,healthScore:85,progress:16},{date:"2026-10-07",heightCm:7,leaves:4,healthScore:88,progress:23},{date:"2026-10-10",heightCm:10,leaves:6,healthScore:90,progress:30},{date:"2026-10-13",heightCm:13,leaves:8,healthScore:92,progress:36},{date:"2026-10-15",heightCm:15,leaves:9,healthScore:93,progress:40},{date:"2026-10-17",heightCm:17,leaves:11,healthScore:94,progress:44}]
  },
  {
    id: "plot-jagung", code: "LHN-006", name: "Kebun Jagung", crop: "Jagung Manis", variety: "Bonanza F1", area: 1600, areaUnit: "m²", plantedAt: "2026-07-12", population: 2400,
    location: { province: "Riau", regency: "Kuantan Singingi", address: "Area contoh, Kuantan Singingi, Riau", description: "Contoh petak jagung dengan barisan panjang dan jalur inspeksi." },
    description: "Jagung manis dengan pencatatan tinggi tanaman, jumlah daun, dan kelembapan udara.", health: "Sehat", cultivationStatus: "Aktif", progress: 88,
    image: image("photo-1744726008519-5f9698b729f9"), imageAlt: "Jagung manis berwarna kuning — foto ilustratif dari Unsplash",
    images: [{src:image("photo-1744726008519-5f9698b729f9",900),alt:"Tongkol jagung manis",caption:"Jagung manis"},{src:image("photo-1497250681960-ef046c08a56e",900),alt:"Daun tanaman hijau untuk ilustrasi lapangan",caption:"Vegetasi"}],
    notes: "Mendekati fase pembentukan tongkol; pantau kebutuhan air.", environment: {temperature:30.8,humidity:66,soilMoisture:43,rainfall:0,weather:"Cerah"},
    growthHistory: [{date:"2026-08-02",heightCm:24,leaves:5,healthScore:81,progress:18},{date:"2026-08-12",heightCm:48,leaves:8,healthScore:84,progress:31},{date:"2026-08-22",heightCm:76,leaves:11,healthScore:87,progress:44},{date:"2026-09-01",heightCm:103,leaves:14,healthScore:90,progress:57},{date:"2026-09-11",heightCm:132,leaves:16,healthScore:92,progress:69},{date:"2026-09-21",heightCm:159,leaves:18,healthScore:93,progress:79},{date:"2026-10-17",heightCm:181,leaves:19,healthScore:94,progress:88}]
  },
  {
    id: "plot-mentimun", code: "LHN-007", name: "Kebun Mentimun", crop: "Mentimun", variety: "Hercules", area: 710, areaUnit: "m²", plantedAt: "2026-08-31", population: 1120,
    location: { province: "Riau", regency: "Rokan Hulu", address: "Area contoh, Rokan Hulu, Riau", description: "Contoh kebun rambat dengan lanjaran dan jalur pemeliharaan." },
    description: "Mentimun dengan pemantauan tinggi rambatan, kelembapan tanah, dan kondisi bunga.", health: "Perlu Perhatian", cultivationStatus: "Aktif", progress: 62,
    image: image("photo-1725369865690-5a1a09f87e56"), imageAlt: "Mentimun segar berwarna hijau — ilustrasi dari Unsplash",
    images: [{src:image("photo-1725369865690-5a1a09f87e56",900),alt:"Mentimun hijau",caption:"Mentimun"},{src:image("photo-1569185835836-a9683f3c72a4",900),alt:"Sayuran hijau — ilustrasi tanaman rambat",caption:"Kondisi tajuk"}],
    notes: "Periksa daun bagian bawah dan konsistensi kelembapan saat cuaca panas.", environment: {temperature:30.0,humidity:81,soilMoisture:59,rainfall:7.0,weather:"Berawan"},
    growthHistory: [{date:"2026-09-07",heightCm:10,leaves:4,healthScore:84,progress:14},{date:"2026-09-14",heightCm:22,leaves:8,healthScore:88,progress:25},{date:"2026-09-21",heightCm:38,leaves:13,healthScore:90,progress:37},{date:"2026-09-28",heightCm:55,leaves:18,healthScore:82,progress:48},{date:"2026-10-05",heightCm:74,leaves:24,healthScore:79,progress:55},{date:"2026-10-12",heightCm:91,leaves:30,healthScore:77,progress:59},{date:"2026-10-17",heightCm:104,leaves:35,healthScore:75,progress:62}]
  },
  {
    id: "plot-pakcoy", code: "LHN-008", name: "Kebun Pakcoy", crop: "Pakcoy", variety: "Nauli F1", area: 320, areaUnit: "m²", plantedAt: "2026-10-04", population: 2880,
    location: { province: "Riau", regency: "Indragiri Hulu", address: "Area contoh, Indragiri Hulu, Riau", description: "Contoh bedeng pakcoy dengan jarak tanam rapat dan pencatatan rutin." },
    description: "Pakcoy dengan siklus pendek dan fokus pada pertumbuhan daun serta kelembapan media.", health: "Belum Ada Data", cultivationStatus: "Aktif", progress: 28,
    image: image("photo-1725369865403-82ca4f17bb5b"), imageAlt: "Pakcoy hijau — foto ilustratif dari Unsplash",
    images: [{src:image("photo-1725369865403-82ca4f17bb5b",900),alt:"Pakcoy hijau",caption:"Pakcoy"},{src:image("photo-1784043436675-dbe53cbcec88",900),alt:"Sayuran daun hijau sebagai ilustrasi",caption:"Sayuran daun"}],
    notes: "Catatan observasi belum lengkap untuk petak ini; jadwalkan pengecekan media tanam.", environment: {temperature:28.2,humidity:75,soilMoisture:null,rainfall:null,weather:"Berawan"},
    growthHistory: [{date:"2026-10-06",heightCm:2,leaves:2,healthScore:72,progress:7},{date:"2026-10-08",heightCm:3,leaves:3,healthScore:76,progress:11},{date:"2026-10-10",heightCm:5,leaves:4,healthScore:78,progress:15},{date:"2026-10-12",heightCm:6,leaves:5,healthScore:79,progress:19},{date:"2026-10-14",heightCm:8,leaves:6,healthScore:80,progress:22},{date:"2026-10-16",heightCm:10,leaves:7,healthScore:81,progress:25},{date:"2026-10-17",heightCm:11,leaves:8,healthScore:82,progress:28}]
  }
];

const buildObservation = (id: string, plotId: string, dateTime: string, weather: DailyObservation["weather"], temperature: number, humidity: number, soilMoisture: number | null, rainfall: number | null, plantHealth: DailyObservation["plantHealth"], growthNotes: string, pestDisease: string, watering: string, fertilizer: string, notes: string): DailyObservation => ({id,plotId,dateTime,weather,temperature,humidity,soilMoisture,rainfall,plantHealth,growthNotes,pestDisease,watering,fertilizer,notes});

export const SEED_OBSERVATIONS: DailyObservation[] = [
  buildObservation("obs-001","plot-cabai","2026-10-10T07:30","Cerah",28.6,70,47,0,"Sehat","Tinggi tanaman bertambah dan bunga pertama terlihat.","Tidak tampak gejala hama.","Penyiraman pagi 15 menit.","Pupuk organik cair dosis ringan.","Kondisi bedeng baik."),
  buildObservation("obs-002","plot-cabai","2026-10-17T07:15","Cerah",29.1,71,48,2.4,"Sehat","Buah muda mulai terbentuk pada beberapa tanaman.","Pantau kutu daun pada pucuk.","Penyiraman sesuai kebutuhan.","Belum ada aplikasi pupuk.","Lakukan inspeksi ulang tiga hari lagi."),
  buildObservation("obs-003","plot-tomat","2026-10-09T08:00","Berawan",29.8,77,55,6.4,"Perlu Perhatian","Buah membesar, beberapa daun bawah menguning.","Ada bercak ringan pada dua tanaman.","Penyiraman pagi dikurangi.","Belum ada aplikasi pupuk.","Amati perkembangan bercak."),
  buildObservation("obs-004","plot-tomat","2026-10-17T08:10","Berawan",30.2,79,54,8.2,"Perlu Perhatian","Buah mulai matang pada barisan sisi timur.","Bercak daun masih perlu dipantau.","Tidak disiram karena media masih lembap.","Kompos tipis pada jalur tanam.","Tingkatkan sirkulasi udara."),
  buildObservation("obs-005","plot-terong","2026-10-08T07:20","Cerah",28.1,67,45,0,"Sehat","Tinggi bertambah dan buah baru terbentuk.","Tidak terlihat gejala penyakit.","Penyiraman pagi 12 menit.","Kompos matang.","Pertumbuhan stabil."),
  buildObservation("obs-006","plot-terong","2026-10-17T07:40","Cerah",28.4,68,46,0,"Sehat","Bunga dan buah muda terlihat pada mayoritas tanaman.","Tidak ada hama berarti.","Penyiraman ringan.","Belum ada aplikasi tambahan.","Pertahankan pengamatan mingguan."),
  buildObservation("obs-007","plot-kangkung","2026-10-10T08:15","Hujan",27.4,86,74,19.2,"Perawatan","Daun baru tumbuh tetapi sebagian batang condong.","Tidak ditemukan hama; beberapa daun pucat.","Penyiraman dihentikan sementara.","Belum ada aplikasi pupuk.","Perbaiki drainase bedeng."),
  buildObservation("obs-008","plot-kangkung","2026-10-17T08:20","Hujan",27.8,84,72,15.6,"Perawatan","Pertumbuhan berlanjut, media masih basah.","Pucat ringan pada area dekat saluran.","Tidak disiram.","Pupuk belum diberikan.","Bersihkan parit kecil."),
  buildObservation("obs-009","plot-bayam","2026-10-10T07:00","Cerah",28.7,71,50,0,"Sehat","Daun baru membuka merata.","Tidak tampak hama.","Penyiraman pagi singkat.","Kompos awal sudah diberikan.","Penyiangan berjalan baik."),
  buildObservation("obs-010","plot-bayam","2026-10-17T07:05","Cerah",29.0,73,51,1.2,"Sehat","Daun bertambah dan warna tetap hijau.","Tidak tampak gejala penyakit.","Penyiraman ringan.","Belum ada aplikasi tambahan.","Pantau jarak tanam."),
  buildObservation("obs-011","plot-jagung","2026-10-07T07:30","Cerah",30.5,65,44,0,"Sehat","Tanaman mendekati tinggi maksimum vegetatif.","Periksa ulat pada pucuk, belum ditemukan.","Irigasi alur 20 menit.","Pemupukan susulan sesuai jadwal contoh.","Perkembangan stabil."),
  buildObservation("obs-012","plot-jagung","2026-10-17T07:35","Cerah",30.8,66,43,0,"Sehat","Daun dewasa sehat dan tongkol mulai berkembang.","Tidak ditemukan gejala signifikan.","Irigasi pagi.","Belum ada aplikasi hari ini.","Pantau pembentukan tongkol."),
  buildObservation("obs-013","plot-mentimun","2026-10-10T08:00","Berawan",29.6,80,60,5.2,"Perlu Perhatian","Sulur terus bertambah dan bunga terlihat.","Bintik kuning ringan pada daun bawah.","Penyiraman di pangkal tanaman.","Belum ada pupuk tambahan.","Hindari membasahi daun malam hari."),
  buildObservation("obs-014","plot-mentimun","2026-10-17T08:05","Berawan",30.0,81,59,7.0,"Perlu Perhatian","Beberapa buah kecil terbentuk.","Bintik daun perlu dipantau; cek sisi bawah daun.","Penyiraman pangkal sesuai kebutuhan.","Kompos tipis.","Pastikan rambatan tidak terlalu rapat."),
  buildObservation("obs-015","plot-pakcoy","2026-10-12T07:25","Berawan",28.0,74,null,null,"Belum Ada Data","Daun sejati pertama muncul.","Belum dilakukan pemeriksaan hama mendetail.","Penyiraman kabut pagi.","Belum ada pemupukan.","Catat kelembapan tanah pada kunjungan berikutnya."),
  buildObservation("obs-016","plot-pakcoy","2026-10-17T07:30","Berawan",28.2,75,null,null,"Belum Ada Data","Pertumbuhan awal tampak merata.","Pemeriksaan hama masih diperlukan.","Penyiraman ringan.","Belum ada pemupukan.","Lengkapi pengukuran media dan pemeriksaan daun.")
];

export const getSeedCopy = () => ({ plots: structuredClone(SEED_PLOTS), observations: structuredClone(SEED_OBSERVATIONS) });
