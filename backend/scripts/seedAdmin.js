import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
try {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (
    !ADMIN_EMAIL ||
    !/^\S+@\S+\.\S+$/.test(ADMIN_EMAIL) ||
    !ADMIN_PASSWORD ||
    ADMIN_PASSWORD.length < 12
  )
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) in backend/.env",
    );
  await connectDB();
  const email = ADMIN_EMAIL.trim().toLowerCase();
  if (await User.findOne({ email }))
    console.log("Admin already exists. No password was changed.");
  else {
    await User.create({
      name: ADMIN_NAME || "Admin",
      email,
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    });
    console.log("Admin created. Sign in at /admin/login.");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
