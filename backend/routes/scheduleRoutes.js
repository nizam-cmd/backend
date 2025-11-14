import express from "express";
import {
  getSchedules,
  createOrUpdateSchedule,
  updateSchedule,
  deleteSchedule, // ✅ tambahkan import ini
} from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", getSchedules);
router.post("/", createOrUpdateSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule); // ✅ route hapus jadwal

export default router;
