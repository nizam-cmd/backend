// backend/db.js
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root", // sesuaikan user
  password: "", // sesuaikan password (kosong jika tidak ada)
  database: "gym", // sesuaikan nama database (kamu pakai 'gym' di server.js lama)
});

console.log("✅ Connected to MySQL database (promise wrapper)");

export default db;
