import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import api from "./routes/api.js";

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET.length < 32 ||
  process.env.JWT_SECRET.startsWith("replace-")
)
  throw new Error(
    "Set a random JWT_SECRET of at least 32 characters in backend/.env",
  );
if (!process.env.SITE_ORIGIN)
  throw new Error("Set SITE_ORIGIN in backend/.env");
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "https:", "data:", "blob:"],
        "media-src": ["'self'", "https:", "blob:"],
        "script-src": ["'self'"],
        "upgrade-insecure-requests":
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
  }),
);

const corsOptions = {
  origin: process.env.SITE_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api", api);
app.use("/api", (req, res) =>
  res.status(404).json({ message: "API route not found." }),
);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("../frontend/dist")));
  app.get("/{*path}", (req, res) =>
    res.sendFile(path.resolve("../frontend/dist/index.html")),
  );
}
app.use((error, req, res, next) => {
  console.error(error.message);
  const status =
    error.code === 11000
      ? 409
      : error.name === "ValidationError" ||
          error.name === "CastError" ||
          error.code === "LIMIT_FILE_SIZE"
        ? 400
        : error.status || 500;
  res.status(status).json({
    message:
      error.code === 11000
        ? "This slug or email is already in use."
        : status === 500
          ? "Something went wrong. Please try again."
          : error.message,
  });
});
await connectDB();
app.listen(process.env.PORT || 5000, () =>
  console.log("Echo8V API is running"),
);
