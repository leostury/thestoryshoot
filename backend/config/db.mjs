import mysql from "mysql2/promise";

console.log("Menghubungkan ke database...");

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "soupkatak",
  port: 3306,
  database: "aplikasi_booking",
});

console.log("Database Connected");

export default db;
