import "dotenv/config";
import mongoose from "mongoose";
import { readFile } from "node:fs/promises";
import connectDB from "../config/db.js";
import Content from "../models/Content.js";
import Settings from "../models/Settings.js";
try {
  await connectDB();
  const data = JSON.parse(
    await readFile(
      new URL("../config/initialContent.json", import.meta.url),
      "utf8",
    ),
  );
  await Settings.updateOne(
    { key: "site" },
    { $setOnInsert: data.settings },
    { upsert: true },
  );
  for (const item of data.items)
    await Content.updateOne(
      { slug: item.slug },
      { $setOnInsert: item },
      { upsert: true },
    );
  console.log("Starter content added. Existing content was preserved.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
