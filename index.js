import express from "express";
import mysql from "mysql";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import muter from "multer";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Front/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Listening");
});
