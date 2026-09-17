import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function requireAdmin(req, res, next) {
  try {
    const payload = jwt.verify(
      req.cookies.echo8v_session || "",
      process.env.JWT_SECRET,
    );
    const user = await User.findById(payload.id);
    if (!user || user.role !== "admin")
      return res.status(401).json({ message: "Please sign in." });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Please sign in." });
  }
}
export function sameOrigin(req, res, next) {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.get("origin");
    if (origin !== process.env.SITE_ORIGIN)
      return res
        .status(403)
        .json({ message: "Request origin is not allowed." });
  }
  next();
}
