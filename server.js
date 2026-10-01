console.log("server.js execution started");
// simple backend that does not require a database
import express from "express";
import cors from "cors";
import morgan from "morgan";
import sleepRoutes from "./routes/sleepRoutes.js";
import path from "path";

// create express app and configure middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes (sleepRoutes uses in-memory array now)
app.use("/api/sleep", sleepRoutes);

// serve frontend build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "..", "frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "frontend", "build", "index.html"));
  });
}

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});