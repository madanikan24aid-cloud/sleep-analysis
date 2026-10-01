import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// in-memory store (would be replaced by a database in production)
const sleepData = [];

// Calculate Sleep Quality Score
const calculateScore = (data) => {
  let score = 0;
  score += data.sleepHours * 10;
  score += data.deepSleep * 5;
  score -= data.interruptions * 5;
  score -= data.caffeineIntake * 2;
  return Math.max(0, Math.min(100, score));
};

// validation rules
const sleepValidation = [
  body("date").isISO8601().withMessage("Date must be a valid ISO8601 string"),
  body("sleepHours").isFloat({ min: 0, max: 24 }).withMessage("Sleep hours must be between 0 and 24"),
  body("deepSleep").isFloat({ min: 0 }).withMessage("Deep sleep must be non-negative"),
  body("interruptions").isInt({ min: 0 }).withMessage("Interruptions must be non-negative"),
  body("caffeineIntake").isFloat({ min: 0 }).withMessage("Caffeine intake must be non-negative"),
  body("notes").optional().isString().trim().escape()
];

// Add Sleep Data
router.post("/", sleepValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const qualityScore = calculateScore(req.body);
  const record = { ...req.body, qualityScore, id: sleepData.length + 1 };
  sleepData.push(record);
  res.status(201).json(record);
});

// Get All Sleep Records (optionally filter by date range)
router.get("/", (req, res) => {
  const { startDate, endDate } = req.query;
  let results = sleepData.slice();
  if (startDate) {
    results = results.filter((r) => new Date(r.date) >= new Date(startDate));
  }
  if (endDate) {
    results = results.filter((r) => new Date(r.date) <= new Date(endDate));
  }
  res.json(results);
});

// Delete Sleep Record by id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = sleepData.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Record not found" });
  }
  sleepData.splice(idx, 1);
  res.json({ success: true });
});

// Update single sleep record
router.put("/:id", sleepValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = parseInt(req.params.id, 10);
  const idx = sleepData.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Record not found" });
  }
  const qualityScore = calculateScore(req.body);
  const updated = { ...req.body, qualityScore, id };
  sleepData[idx] = updated;
  res.json(updated);
});

// Clear all records
router.delete("/", (req, res) => {
  sleepData.length = 0;
  res.json({ success: true, message: "All records cleared" });
});

export default router;