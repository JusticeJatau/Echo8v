import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});
export async function login(req, res) {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof req.body.password === "string" ? req.body.password : "";
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Incorrect email or password." });
  res.cookie(
    "echo8v_session",
    jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "8h" }),
    { ...cookieOptions(), maxAge: 8 * 60 * 60 * 1000 },
  );
  res.json({ name: user.name, email: user.email });
}
export function logout(req, res) {
  res.clearCookie("echo8v_session", cookieOptions());
  res.json({ message: "Signed out." });
}
export function me(req, res) {
  res.json({ name: req.user.name, email: req.user.email });
}
