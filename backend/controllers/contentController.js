import Content from "../models/Content.js";
const allowed = [
  "kind",
  "title",
  "slug",
  "summary",
  "description",
  "category",
  "availability",
  "logo",
  "cover",
  "screenshots",
  "video",
  "features",
  "buttonLabel",
  "url",
  "enquiryEnabled",
  "featured",
  "order",
  "status",
];
function clean(body) {
  const result = Object.fromEntries(
    allowed
      .filter((key) => body[key] !== undefined)
      .map((key) => [key, body[key]]),
  );
  for (const field of ["url", "video", "cover", "logo"]) {
    const value = result[field];
    if (
      value &&
      (typeof value !== "string" || !/^(https?:\/\/|\/(?!\/))/.test(value))
    )
      throw Object.assign(
        new Error("Use an http(s) URL or a local media path."),
        { status: 400 },
      );
  }
  if (
    result.screenshots &&
    (!Array.isArray(result.screenshots) ||
      result.screenshots.some(
        (value) =>
          typeof value !== "string" || !/^(https?:\/\/|\/(?!\/))/.test(value),
      ))
  )
    throw Object.assign(new Error("Invalid screenshot URL."), { status: 400 });
  return result;
}
export async function publicList(req, res) {
  res.json(
    await Content.find({ status: "published" }).sort({
      order: 1,
      createdAt: -1,
    }),
  );
}
export async function publicOne(req, res) {
  const item = await Content.findOne({
    slug: req.params.slug,
    status: "published",
  });
  if (!item) return res.status(404).json({ message: "Page not found." });
  res.json(item);
}
export async function adminList(req, res) {
  res.json(await Content.find().sort({ order: 1, createdAt: -1 }));
}
export async function create(req, res) {
  res.status(201).json(await Content.create(clean(req.body)));
}
export async function update(req, res) {
  const item = await Content.findByIdAndUpdate(req.params.id, clean(req.body), {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "Content not found." });
  res.json(item);
}
export async function remove(req, res) {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted." });
}
