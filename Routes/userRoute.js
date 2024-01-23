import express from "express";
import {
  registerUser,
  loginUser,
  findUser,
  getUsers
} from "../Controllers/userController.js";
//mini app ,small version of express
const router = express.Router();

// registration route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

export default router;
