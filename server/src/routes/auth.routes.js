
import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Citizen registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

export default router;
