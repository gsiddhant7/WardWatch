import Complaint from "../models/Complaint.js";
import StatusHistory from "../models/StatusHistory.js";
import Counter from "../models/Counter.js";
import Response from "../models/Response.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, images } = req.body;

    // Check required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required complaint details.",
      });
    }

    // Create the complaint
    const year = new Date().getFullYear();

const counter = await Counter.findOneAndUpdate(
  { _id: `complaint-${year}` },
  { $inc: { sequence: 1 } },
  { new: true, upsert: true }
);

const complaintId = `WW-${year}-${String(counter.sequence).padStart(4, "0")}`;
    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category,
      location,
      images: images || [],
      citizen: req.user._id,
    });

    // Record the initial status
    await StatusHistory.create({
      complaint: complaint._id,
      status: "Submitted",
      updatedBy: req.user._id,
      note: "Complaint submitted by citizen.",
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit complaint.",
      error: error.message,
    });
  }
};

export const getPublicComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ isDeleted: false })
      .select("-__v")
      .populate("citizen", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve complaints.",
    });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      citizen: req.user._id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve your complaints.",
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;

    // Find the complaint belonging to the logged-in citizen
    const complaint = await Complaint.findOne({
      complaintId,
      citizen: req.user._id,
      isDeleted: false,
    }).populate("citizen", "name");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // Retrieve complete status history
    const statusHistory = await StatusHistory.find({
      complaint: complaint._id,
    })
      .populate("updatedBy", "name")
      .sort({ createdAt: 1 });

    // Retrieve administrator responses
    const responses = await Response.find({
      complaint: complaint._id,
    })
      .populate("admin", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      complaint,
      statusHistory,
      responses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve complaint details.",
    });
  }
};

export const getAllComplaintsForAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      isDeleted: false,
    })
      .populate("citizen", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve complaints.",
    });
  }
};

export const getComplaintDetailsForAdmin = async (req, res) => {
  try {
    const { complaintId } = req.params;

    // Find the complaint without restricting it to one citizen
    const complaint = await Complaint.findOne({
      complaintId,
      isDeleted: false,
    }).populate("citizen", "name email phone");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // Retrieve complete status history
    const statusHistory = await StatusHistory.find({
      complaint: complaint._id,
    })
      .populate("updatedBy", "name")
      .sort({ createdAt: 1 });

    // Retrieve administrator responses
    const responses = await Response.find({
      complaint: complaint._id,
    })
      .populate("admin", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      complaint,
      statusHistory,
      responses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve complaint details.",
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, note } = req.body;

    const allowedStatuses = [
      "Submitted",
      "Under Review",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
      });
    }

    const complaint = await Complaint.findOne({
      complaintId,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (complaint.status === status) {
      return res.status(400).json({
        success: false,
        message: "Complaint already has this status.",
      });
    }

    // Update the complaint's current status
    complaint.status = status;
    await complaint.save();

    // Record the status change
    const history = await StatusHistory.create({
      complaint: complaint._id,
      status,
      updatedBy: req.user._id,
      note: note || "",
    });

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status.",
    });
  }
};

export const addComplaintResponse = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Response message is required.",
      });
    }

    const complaint = await Complaint.findOne({
      complaintId,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const response = await Response.create({
      complaint: complaint._id,
      admin: req.user._id,
      message: message.trim(),
    });

    await response.populate("admin", "name");

    res.status(201).json({
      success: true,
      message: "Official response added successfully.",
      response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add official response.",
    });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({
      complaintId,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.isDeleted = true;
    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove complaint.",
    });
  }
};


export const cancelMyComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({
      complaintId,
      citizen: req.user._id,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (complaint.status !== "Submitted") {
      return res.status(400).json({
        success: false,
        message: "Only submitted complaints can be cancelled.",
      });
    }

    complaint.isDeleted = true;
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint cancelled successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to cancel complaint.",
    });
  }
};
