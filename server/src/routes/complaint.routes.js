import express from "express";
import {
  createComplaint,
  getPublicComplaints,
  getMyComplaints,
getComplaintById,
getAllComplaintsForAdmin,
getComplaintDetailsForAdmin,
updateComplaintStatus,
addComplaintResponse,
deleteComplaint,
cancelMyComplaint
} from "../controllers/complaint.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Anyone can view public complaints
router.get("/", getPublicComplaints);

// Logged-in citizen views their own complaints
router.get("/my", protect, getMyComplaints);

// Ward Administrator views all complaints
router.get(
  "/admin",
  protect,
  authorize("Ward Administrator"),
  getAllComplaintsForAdmin
);

// Ward Administrator views individual complaint details
router.get(
  "/admin/:complaintId",
  protect,
  authorize("Ward Administrator"),
  getComplaintDetailsForAdmin
);

// Ward Administrator updates complaint status
router.patch(
  "/admin/:complaintId/status",
  protect,
  authorize("Ward Administrator"),
  updateComplaintStatus
);

// Ward Administrator adds an official complaint response
router.post(
  "/admin/:complaintId/responses",
  protect,
  authorize("Ward Administrator"),
  addComplaintResponse
);

// Ward Administrator soft-deletes a complaint
router.delete(
  "/admin/:complaintId",
  protect,
  authorize("Ward Administrator"),
  deleteComplaint
);

router.patch("/:complaintId/cancel", protect, cancelMyComplaint);

// Logged-in citizen views individual complaint details
router.get("/:complaintId", protect, getComplaintById);

// Citizen submits a new complaint
router.post("/", protect, createComplaint);

export default router;