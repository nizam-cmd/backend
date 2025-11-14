// backend/server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// Folder Upload Setup
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Serve file statis (agar foto tampil di frontend)
app.use("/uploads", express.static(uploadDir));

// =======================
// Konfigurasi Multer
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// =======================
// ROUTES
// =======================
app.use("/api/schedule", scheduleRoutes);

// ROUTE UTAMA
app.get("/", (req, res) => {
  res.send(`
      <h2>🚀 Gym API Server Berjalan</h2>
      <ul>
        <li><a href="/api/members">/api/members</a></li>
        <li><a href="/api/trainers">/api/trainers</a></li>
        <li><a href="/api/membership">/api/membership</a></li>
        <li><a href="/api/dashboard/income">/api/dashboard/income</a></li>
        <li><a href="/api/dashboard/reminder">/api/dashboard/reminder</a></li>
      </ul>
    `);
});

// =======================
// MEMBER ENDPOINTS
// =======================
app.get("/api/members", async (req, res) => {
  try {
    const sql = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone,
        u.photo,
        u.address,
        u.gender,
        COALESCE(m.membership_type, '-') AS membership_type,
        COALESCE(m.start_date, '-') AS start_date,
        COALESCE(m.end_date, '-') AS end_date,
        COALESCE(m.status, '-') AS status
      FROM users u
      LEFT JOIN membership m ON u.membership_id = m.membership_id
      WHERE u.role_id IS NULL OR u.role_id = 2
      ORDER BY u.user_id DESC
    `;
    const [results] = await db.query(sql);

    // ✅ Tambahkan base URL agar foto muncul di frontend
    const updated = results.map((r) => ({
      ...r,
      photo: r.photo ? r.photo : null,
    }));

    res.json(updated);
  } catch (err) {
    console.error("❌ Gagal ambil data member:", err);
    res.status(500).json({ message: "Gagal ambil data member" });
  }
});

app.post("/api/members", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, phone, membership_id, address, gender } = req.body;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name) return res.status(400).json({ message: "Nama wajib diisi" });

    const sqlInsertUser = `
      INSERT INTO users (name, email, phone, address, gender, photo, membership_id, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, 2)
    `;
    const [result] = await db.query(sqlInsertUser, [
      name,
      email,
      phone,
      address || null,
      gender || null,
      photoPath,
      membership_id || null,
    ]);

    res.json({
      message: "✅ Member berhasil ditambahkan",
      id: result.insertId,
      photo: photoPath
        ? `${req.protocol}://${req.get("host")}${photoPath}`
        : null,
    });
  } catch (err) {
    console.error("❌ Gagal tambah member:", err);
    res.status(500).json({ message: "Gagal menambah member" });
  }
});

app.get("/api/members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone,
        u.address,
        u.gender,
        u.photo,
        COALESCE(m.membership_id, NULL) AS membership_id,
        COALESCE(m.membership_type, '-') AS membership_type,
        COALESCE(m.start_date, '-') AS start_date,
        COALESCE(m.end_date, '-') AS end_date,
        COALESCE(m.status, '-') AS status,
        COALESCE(m.price, 0) AS price,
        COALESCE(m.category, '-') AS category
      FROM users u
      LEFT JOIN membership m ON u.membership_id = m.membership_id
      WHERE u.user_id = ?
    `;
    const [results] = await db.query(sql, [id]);
    if (results.length === 0)
      return res.status(404).json({ message: "Member tidak ditemukan" });

    const member = results[0];
    member.photo = member.photo
      ? `${req.protocol}://${req.get("host")}${member.photo}`
      : null;

    res.json(member);
  } catch (err) {
    console.error("❌ Gagal ambil detail member:", err);
    res.status(500).json({ message: "Gagal ambil detail member" });
  }
});

// =======================
// MEMBERSHIP ENDPOINTS
// =======================
app.get("/api/membership", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM membership");
    res.json(results);
  } catch (err) {
    console.error("❌ Gagal ambil data membership:", err);
    res.status(500).json({ message: "Gagal ambil data membership" });
  }
});

app.post("/api/membership", async (req, res) => {
  try {
    const { membership_type, start_date, end_date, status, price, category } =
      req.body;
    await db.query(
      `INSERT INTO membership (membership_type, start_date, end_date, status, price, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [membership_type, start_date, end_date, status, price, category]
    );
    res.json({ message: "✅ Membership berhasil ditambahkan" });
  } catch (err) {
    console.error("❌ Gagal menambah membership:", err);
    res.status(500).json({ message: "Gagal menambah membership" });
  }
});

app.put("/api/membership/:id", async (req, res) => {
  const { id } = req.params;
  const { membership_type, category, start_date, end_date, status, price } =
    req.body;

  try {
    const fieldsToUpdate = {};
    if (membership_type) fieldsToUpdate.membership_type = membership_type;
    if (category) fieldsToUpdate.category = category;
    if (start_date) fieldsToUpdate.start_date = start_date;
    if (end_date) fieldsToUpdate.end_date = end_date;
    if (status) fieldsToUpdate.status = status;
    if (price) fieldsToUpdate.price = price;

    const updates = Object.keys(fieldsToUpdate)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(fieldsToUpdate);

    if (updates.length === 0)
      return res.status(400).json({ message: "Tidak ada data untuk diupdate" });

    const [result] = await db.query(
      `UPDATE membership SET ${updates} WHERE membership_id = ?`,
      [...values, id]
    );

    res.json({ message: "✅ Membership diperbarui", result });
  } catch (err) {
    console.error("❌ Error update membership:", err);
    res.status(500).json({ message: "Gagal update data" });
  }
});

app.delete("/api/membership/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM membership WHERE membership_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "❌ Membership tidak ditemukan" });

    res.json({ message: "✅ Membership berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal hapus membership:", err);
    res.status(500).json({ message: "Gagal hapus membership" });
  }
});

// =======================
// TRAINER ENDPOINTS
// =======================
// =======================
// TRAINER ENDPOINTS
// =======================
app.get("/api/trainers", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM trainer ORDER BY trainer_id DESC"
    );

    // ✅ Sama seperti member: kirim path relatif aja
    const trainers = results.map((t) => ({
      ...t,
      photo: t.photo ? t.photo : null,
    }));

    res.json(trainers);
  } catch (err) {
    console.error("❌ Gagal ambil data trainer:", err);
    res.status(500).json({ message: "Gagal ambil data trainer" });
  }
});

app.get("/api/trainers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM trainer WHERE trainer_id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Trainer tidak ditemukan" });

    const trainer = rows[0];
    trainer.photo = trainer.photo ? trainer.photo : null; // 👈 ini juga diubah

    res.json(trainer);
  } catch (err) {
    console.error("❌ Gagal mengambil data trainer:", err);
    res.status(500).json({ message: "Gagal mengambil data trainer" });
  }
});

app.post("/api/trainers", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      bio,
      jumlah_pertemuan = "1 Sesi",
      harga = 0,
    } = req.body;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO trainer (name, jumlah_pertemuan, harga, phone, email, bio, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      name,
      jumlah_pertemuan,
      harga,
      phone,
      email,
      bio,
      photoPath,
    ]);

    res.json({
      message: "✅ Trainer berhasil ditambahkan",
      id: result.insertId,
      photo: photoPath
        ? `${req.protocol}://${req.get("host")}${photoPath}`
        : null,
    });
  } catch (err) {
    console.error("❌ Gagal menambah trainer:", err);
    res.status(500).json({ message: "Gagal menambah trainer" });
  }
});

app.put("/api/trainers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, jumlah_pertemuan, harga, phone, email, bio } = req.body;

    const [result] = await db.query(
      `UPDATE trainer SET name=?, jumlah_pertemuan=?, harga=?, phone=?, email=?, bio=? WHERE trainer_id=?`,
      [name, jumlah_pertemuan, harga, phone, email, bio, id]
    );

    res.json({ message: "✅ Trainer berhasil diperbarui", result });
  } catch (err) {
    console.error("❌ Gagal update trainer:", err);
    res.status(500).json({ message: "Gagal update trainer" });
  }
});

app.delete("/api/trainers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM trainer WHERE trainer_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Trainer tidak ditemukan" });

    res.json({ message: "✅ Trainer berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal hapus trainer:", err);
    res.status(500).json({ message: "Gagal hapus trainer" });
  }
});

// =======================
// DASHBOARD & ATTENDANCE (tidak diubah banyak)
// =======================
// ... (bagian income, reminder, attendance tetap sama)

// =======================
// DASHBOARD ENDPOINTS
// =======================
app.get("/api/dashboard/income", async (req, res) => {
  try {
    const sql = `
        SELECT 
          u.name AS nama_member,
          m.start_date AS tanggal_daftar,
          m.category AS durasi,
          m.price AS harga_per_bulan,
          m.price AS total_pembayaran,
          COALESCE(p.method, 'Transfer Bank') AS metode_pembayaran,
          m.status AS keterangan
        FROM membership m
        LEFT JOIN users u ON u.membership_id = m.membership_id
        LEFT JOIN payment p ON p.payment_id = m.payment_id
        ORDER BY m.start_date DESC
      `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ Gagal ambil data rekap penghasilan:", err);
    res.status(500).json({ message: "Gagal ambil data rekap penghasilan" });
  }
});

// =======================
// REMINDER DASHBOARD
// =======================
app.get("/api/dashboard/reminder", async (req, res) => {
  try {
    const sql = `
        SELECT 
          u.name AS nama_member,
          m.start_date AS tanggal_daftar,
          m.category AS durasi,
          m.end_date AS tanggal_berakhir,
          DATEDIFF(m.end_date, CURDATE()) AS sisa_hari,
          CASE WHEN DATEDIFF(m.end_date, CURDATE()) < 0 THEN 'Kadaluarsa'
              ELSE 'Aktif' END AS status,
          CASE WHEN DATEDIFF(m.end_date, CURDATE()) < 0 THEN 'Hubungi untuk renewal'
              WHEN DATEDIFF(m.end_date, CURDATE()) BETWEEN 0 AND 5 THEN 'Kirim reminder via WA'
              ELSE 'Belum perlu reminder' END AS tindakan_disarankan
        FROM membership m
        LEFT JOIN users u ON u.membership_id = m.membership_id
        ORDER BY m.end_date ASC
      `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ Gagal ambil data reminder membership:", err);
    res.status(500).json({ message: "Gagal ambil data reminder membership" });
  }
});

// =======================
// ATTENDANCE ENDPOINTS
// =======================
app.get("/api/attendance", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.attendance_id,
        a.user_id,
        COALESCE(u.name, t.name) AS name,
        a.role,
        a.check_in,
        a.check_out,
        a.duration,
        a.status,
        a.created_at
      FROM attendance a
      LEFT JOIN users u ON a.user_id = u.user_id
      LEFT JOIN trainer t ON a.user_id = t.trainer_id
      ORDER BY a.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Gagal ambil data attendance:", err);
    res.status(500).json({ message: "Gagal ambil data attendance" });
  }
});

// ✅ POST check-in
app.post("/api/attendance", async (req, res) => {
  try {
    const { user_id, role } = req.body;
    if (!user_id || !role)
      return res.status(400).json({ message: "user_id dan role wajib diisi" });

    const now = new Date();
    const [result] = await db.query(
      `INSERT INTO attendance (user_id, role, check_in, status)
       VALUES (?, ?, ?, 'Check-in')`,
      [user_id, role, now]
    );

    res.json({
      message: "✅ Check-in berhasil",
      attendance_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Gagal check-in:", err);
    res.status(500).json({ message: "Gagal check-in", error: err.message });
  }
});

// ✅ PUT check-out
app.put("/api/attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "attendance_id tidak valid" });
    }

    const now = new Date();

    // cek apakah attendance_id ada
    const [rows] = await db.query(
      `SELECT check_in FROM attendance WHERE attendance_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Attendance ID ${id} tidak ditemukan`,
      });
    }

    const checkInTime = new Date(rows[0].check_in);
    const durationMs = now - checkInTime;

    if (isNaN(durationMs)) {
      return res.status(500).json({ message: "check_in invalid (NULL?)" });
    }

    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const durasi = `${hours > 0 ? hours + "j " : ""}${minutes % 60}m`;

    const [update] = await db.query(
      `UPDATE attendance 
       SET check_out = ?, status = 'Check-out', duration = ?
       WHERE attendance_id = ?`,
      [now, durasi, id]
    );

    if (update.affectedRows === 0) {
      return res.status(500).json({
        message: "Update gagal. attendance_id mungkin salah.",
      });
    }

    res.json({ message: "Check-out berhasil", durasi });
  } catch (err) {
    console.error("❌ Gagal check-out:", err);
    res.status(500).json({ message: "Gagal check-out", error: err.message });
  }
});

// Ambil semua attendance yang masih aktif (belum check-out)
app.get("/api/attendance/active", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT attendance_id, user_id 
       FROM attendance
       WHERE status = 'Check-in' AND check_out IS NULL`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Gagal ambil active attendance:", err);
    res.status(500).json({ message: "Gagal ambil active attendance" });
  }
});

// =========================
// 📌 ANALYTICS API
// =========================
app.get("/api/analytics", async (req, res) => {
  try {
    // ================================
    // 1️⃣ Paket paling sering dipilih
    // ================================
    const [popularPackages] = await db.query(`
      SELECT 
        membership_type AS package,
        COUNT(*) AS total
      FROM membership
      GROUP BY membership_type
      ORDER BY total DESC
    `);

    // ============================================
    // 2️⃣ Member yang sering memperpanjang membership
    // ============================================
    const [retention] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        COUNT(m.membership_id) AS total_renew
      FROM membership m
      JOIN users u ON m.user_id = u.user_id
      GROUP BY m.user_id
      HAVING total_renew > 1
      ORDER BY total_renew DESC
    `);

    // ================================
    // 3️⃣ Total income bulan ini
    // ================================
    const [income] = await db.query(`
      SELECT 
        CAST(
          SUM(CAST(REPLACE(REPLACE(price,'Rp ',''),'.','') AS UNSIGNED))
        AS UNSIGNED) AS total_income
      FROM membership
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    // ===================================
    // 4️⃣ Income bulanan per paket (FIX)
    // ===================================
    const [incomeByPackage] = await db.query(`
      SELECT 
        membership_type AS package,
        CAST(
          COALESCE(
            SUM(CAST(REPLACE(REPLACE(price,'Rp ',''),'.','') AS UNSIGNED)),
            0
          )
        AS UNSIGNED) AS income
      FROM membership
      GROUP BY membership_type
      ORDER BY income DESC
    `);

    // ===================================
    // 5️⃣ Prediksi siapa yang akan perpanjang
    // ===================================
    const [renewPrediction] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        COUNT(m.membership_id) AS renew_count,
        MAX(m.end_date) AS last_end
      FROM membership m
      JOIN users u ON m.user_id = u.user_id
      GROUP BY m.user_id
      HAVING renew_count >= 2
      ORDER BY last_end ASC
    `);

    res.json({
      popularPackages,
      retention,
      monthlyIncome: income[0]?.total_income || 0,
      revenueByPackage: incomeByPackage,
      renewPrediction,
    });
  } catch (err) {
    console.error("❌ Error Analytics:", err);
    res.status(500).json({ message: "Analytics error", error: err.message });
  }
});

// =======================
// START SERVER
// =======================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
