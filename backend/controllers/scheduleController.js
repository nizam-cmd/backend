import db from "../db.js";

// 🔹 Ambil semua jadwal
export const getSchedules = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.trainer_id,
        t.name AS trainer_name,
        s.member_id,
        u.name AS member_name,
        s.sesi,
        s.created_at
      FROM schedule s
      LEFT JOIN trainer t ON s.trainer_id = t.trainer_id
      LEFT JOIN users u ON s.member_id = u.user_id
      ORDER BY s.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Gagal ambil data jadwal:", err);
    res.status(500).json({ message: "Gagal ambil data jadwal" });
  }
};

// 🔹 Tambah jadwal baru
export const createOrUpdateSchedule = async (req, res) => {
  try {
    const { trainer_id, member_id, sesi } = req.body;

    if (!trainer_id || !member_id || !sesi) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    await db.query(
      "INSERT INTO schedule (trainer_id, member_id, sesi) VALUES (?, ?, ?)",
      [trainer_id, member_id, sesi]
    );

    res.json({ message: "✅ Jadwal berhasil disimpan" });
  } catch (err) {
    console.error("❌ Gagal simpan jadwal:", err);
    res.status(500).json({ error: "Gagal simpan jadwal" });
  }
};

// 🔹 Update jadwal berdasarkan ID
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { trainer_id, member_id, sesi } = req.body;

  try {
    if (!trainer_id || !member_id || !sesi) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    await db.query(
      `UPDATE schedule 
       SET trainer_id=?, member_id=?, sesi=? 
       WHERE id=?`,
      [trainer_id, member_id, sesi, id]
    );

    res.json({ message: "✅ Jadwal berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Gagal update jadwal:", err);
    res.status(500).json({ message: "Gagal update jadwal" });
  }
};

// DELETE jadwal
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM schedule WHERE id = ?", [id]);
    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal hapus jadwal:", err);
    res.status(500).json({ message: "Gagal hapus jadwal" });
  }
};
