import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./Routes/userRoute.js";

const app = express();
dotenv.config();

// Middleware pour l'analyse des données JSON dans les requêtes
app.use(express.json());

// Middleware pour gérer les problèmes de CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use("/api/users", userRoute);

//1st parameter : route
//2nd parameter fuction(callback)
app.get("/", (req, res) => {
  res.send("Welcome to our chat-App APIs");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
// console.log(process.env.ATLAS_URI);

// Set strictQuery to false to suppress the deprecation warning
mongoose.set("strictQuery", false);

// Démarrer le serveur et afficher un message lorsque le serveur est prêt
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB
// 1st parameter: uri
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection failed:", error.message));
