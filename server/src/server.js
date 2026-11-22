
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);

// API welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to WardWatch API!",
  });
});

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`WardWatch server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
