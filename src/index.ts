import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
const mongouri = process.env.MONGO_URI || "mongodb://localhost:27017/test";
import cors from "cors";
import authRouter from "../routes/auth";
import auth from "../middleware/auth";
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

mongoose.connect(mongouri);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));

app.get("/", async (req, res) => {
  res.json({ success: true, message: "Hello World" });
});

app.use("/auth", authRouter);

// Protected Route
app.get("/welcome", auth, async (req, res) => {
  res.json({ success: true, message: "🙌 Welcome to the API" });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
