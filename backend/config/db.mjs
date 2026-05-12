// import mysql from "mysql2/promise";
// import "dotenv/config";

// console.log("Menghubungkan ke database...");

// // const db = await mysql.createConnection({
// //   host: process.env.DB_HOST,
// //   port: process.env.DB_PORT,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME,
// //   waitForConnections: true,
// //   connectionLimit: 10,
// //   queueLimit: 0,
// // });
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   // Tambahkan 3 baris ini untuk mencegah ETIMEDOUT:
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 10000, // Kirim sinyal "halo" ke MySQL setiap 10 detik
//   connectTimeout: 30000, // Beri waktu 30 detik untuk koneksi awal
// });

// console.log("Database Connected");

// export default db;

import mysql from "mysql2/promise";
import "dotenv/config";

console.log("🔄 Sedang menyiapkan Pool database...");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 30000,
});

// Cek koneksi secara nyata saat backend baru dinyalakan
try {
  const connection = await db.getConnection();
  console.log("✅ Database Connected: Berhasil meminjam koneksi dari Pool.");
  connection.release(); // Langsung kembalikan ke pool agar bisa dipakai yang lain
} catch (err) {
  console.error("❌ Database Connection Failed!");
  console.error("Pesan Error:", err.message);
  // Opsional: proses.exit(1) jika kamu ingin backend mati kalau DB tidak konek
}

export default db;
