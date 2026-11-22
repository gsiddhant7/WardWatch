
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "admin@wardwatch.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Administrator account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "Admin123!",
      12
    );

    await User.create({
      name: "Ward Administrator",
      email: adminEmail,
      password: hashedPassword,
      phone: "9800000001",
      role: "Ward Administrator",
    });

    console.log("Administrator account created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
