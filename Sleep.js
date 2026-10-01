import mongoose from "mongoose";

const sleepSchema = new mongoose.Schema({
  date: { type: String, required: true },
  sleepHours: { type: Number, required: true },
  deepSleep: { type: Number, required: true },
  interruptions: { type: Number, required: true },
  caffeineIntake: { type: Number, required: true },
  qualityScore: { type: Number }
});

// create model and export both as default and named export
const Sleep = mongoose.model("Sleep", sleepSchema);
export default Sleep;
export { Sleep };