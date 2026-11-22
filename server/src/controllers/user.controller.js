import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import bcrypt from "bcryptjs";

export const getAllCitizens = async (req, res) => {
  try {
    const citizens = await User.find({
      role: "Citizen",
    })
      .select("name email phone createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: citizens.length,
      citizens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve citizens.",
    });
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalCitizens,
      totalComplaints,
      submitted,
      underReview,
      inProgress,
      resolved,
    ] = await Promise.all([
      User.countDocuments({ role: "Citizen" }),
      Complaint.countDocuments({ isDeleted: false }),
      Complaint.countDocuments({
        isDeleted: false,
        status: "Submitted",
      }),
      Complaint.countDocuments({
        isDeleted: false,
        status: "Under Review",
      }),
      Complaint.countDocuments({
        isDeleted: false,
        status: "In Progress",
      }),
      Complaint.countDocuments({
        isDeleted: false,
        status: "Resolved",
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCitizens,
        totalComplaints,
        submitted,
        underReview,
        inProgress,
        resolved,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics.",
    });
  }
};

// Get the logged-in administrator's profile
export const getMyProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select(
      "name email phone role createdAt"
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch administrator profile.",
    });
  }
};

// Update the logged-in administrator's profile
export const updateMyProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone number are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email address is already in use.",
      });
    }

    const admin = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email phone role createdAt");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update administrator profile.",
    });
  }
};

// Change the logged-in administrator's password
export const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 6 characters.",
      });
    }

    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to change password.",
    });
  }
};