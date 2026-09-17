import { Router } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { requireAdmin, sameOrigin } from "../middleware/auth.js";
import * as auth from "../controllers/authController.js";
import * as content from "../controllers/contentController.js";
import * as site from "../controllers/siteController.js";
const router = Router();
router.use(sameOrigin);
router.post(
  "/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many attempts. Try again in 15 minutes." },
  }),
  auth.login,
);
router.get("/auth/me", requireAdmin, auth.me);
router.post("/auth/logout", auth.logout);
router.get("/content", content.publicList);
router.get("/content/:slug", content.publicOne);
router.get("/settings", site.getSettings);
router.get("/media/:id/file", site.serveMedia);
router.post(
  "/enquiries",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: { message: "Please try again later." },
  }),
  site.sendEnquiry,
);
router.use("/admin", requireAdmin);
router.delete("/admin/media/:id", site.deleteMedia);
router.post("/admin/enquiries/:id/retry", site.retryEnquiryEmail);
router.get("/admin/content", content.adminList);
router.post("/admin/content", content.create);
router.put("/admin/content/:id", content.update);
router.delete("/admin/content/:id", content.remove);
router.put("/admin/settings", site.saveSettings);
router.get("/admin/enquiries", site.enquiries);
router.patch("/admin/enquiries/:id", site.updateEnquiry);
router.get("/admin/media", site.media);
router.post(
  "/admin/media",
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024, files: 1 },
  }).single("file"),
  site.upload,
);
export default router;
