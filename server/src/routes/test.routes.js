
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Accessible to any logged-in user
router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful!",
    user: req.user.name,
    role: req.user.role,
  });
});

// Accessible only to Ward Administrators
router.get(
  "/admin",
  protect,
  authorize("Ward Administrator"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Administrator access granted!",
    });
  }
);

export default router;
