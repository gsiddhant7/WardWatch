import express from "express";
import {
  getAllCitizens,
  getAdminDashboardStats,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/citizens",
  protect,
  authorize("Ward Administrator"),
  getAllCitizens
);

router.get(
  "/admin/stats",
  protect,
  authorize("Ward Administrator"),
  getAdminDashboardStats
);

// Administrator profile
router.get(
  "/admin/profile",
  protect,
  authorize("Ward Administrator"),
  getMyProfile
);

router.patch(
  "/admin/profile",
  protect,
  authorize("Ward Administrator"),
  updateMyProfile
);

router.patch(
  "/admin/profile/password",
  protect,
  authorize("Ward Administrator"),
  changeMyPassword
);

export default router;