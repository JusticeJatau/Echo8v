import Settings from "../models/Settings.js";
import Enquiry from "../models/Enquiry.js";
import Media from "../models/Media.js";
import { fileTypeFromBuffer } from "file-type";
import {
  uploadToBackblaze,
  deleteFromBackblaze,
  createSignedMediaUrl,
} from "../services/storageService.js";
import { sendEnquiryEmail } from "../services/emailService.js";
import Content from "../models/Content.js";
export async function getSettings(req, res) {
  res.json((await Settings.findOne({ key: "site" })) || {});
}
export async function saveSettings(req, res) {
  const data = {
    companyName: req.body.companyName,
    tagline: req.body.tagline,
    heroTitle: req.body.heroTitle,
    heroText: req.body.heroText,
    heroButtonLabel: req.body.heroButtonLabel,
    heroButtonUrl: req.body.heroButtonUrl,
    secondaryButtonLabel: req.body.secondaryButtonLabel,
    secondaryButtonUrl: req.body.secondaryButtonUrl,
    email: req.body.email,
    whatsapp: req.body.whatsapp,
    founderName: req.body.founderName,
    founderTitle: req.body.founderTitle,
    founderBio: req.body.founderBio,
    about: req.body.about,
    mission: req.body.mission,
    seoTitle: req.body.seoTitle,
    seoDescription: req.body.seoDescription,
    socials: req.body.socials,
    sections: req.body.sections,
  };
  res.json(
    await Settings.findOneAndUpdate({ key: "site" }, data, {
      new: true,
      upsert: true,
      runValidators: true,
    }),
  );
}
export async function sendEnquiry(req, res) {
  const { name, email, organisation, interest, message, website } = req.body;
  if (website)
    return res.status(201).json({ message: "Your enquiry has been received." });
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof message !== "string" ||
    !message.trim() ||
    typeof email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(email)
  )
    return res
      .status(400)
      .json({ message: "Enter your name, a valid email, and a message." });
  const enquiry = await Enquiry.create({
    name: name.trim(),
    email: email.trim(),
    organisation,
    interest,
    message: message.trim(),
  });
  try {
    enquiry.emailId = await sendEnquiryEmail(enquiry);
    enquiry.emailSent = true;
    enquiry.emailError = "";
  } catch (error) {
    enquiry.emailError = error.message;
  }
  await enquiry.save();
  res.status(201).json({
    message: "Your enquiry has been received. We will reply by email.",
  });
}
export async function enquiries(req, res) {
  res.json(await Enquiry.find().sort({ createdAt: -1 }));
}
export async function updateEnquiry(req, res) {
  res.json(
    await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    ),
  );
}
export async function media(req, res) {
  res.json(await Media.find().sort({ createdAt: -1 }));
}

export async function serveMedia(req, res) {
  const item = await Media.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      message: "Media not found.",
    });
  }

  const signedUrl = await createSignedMediaUrl(item.key);

  res.redirect(signedUrl);
}

export async function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "Choose a file.",
    });
  }

  const type = await fileTypeFromBuffer(req.file.buffer);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
  ];

  if (!type || !allowedTypes.includes(type.mime)) {
    return res.status(400).json({
      message:
        "Upload a JPG, PNG, WebP, GIF, MP4 or WebM file.",
    });
  }

  const key = await uploadToBackblaze(
    req.file.buffer,
    type,
  );

  const media = await Media.create({
    key,
    name: req.file.originalname,
    mime: type.mime,
    size: req.file.size,
  });

  media.url = "/api/media/" + media._id + "/file";

  await media.save();

  res.status(201).json(media);
}

export async function deleteMedia(req, res) {
  const item = await Media.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Media not found." });
  const used = await Content.exists({
    $or: [
      { cover: item.url },
      { logo: item.url },
      { video: item.url },
      { screenshots: item.url },
    ],
  });
  if (used)
    return res.status(409).json({
      message:
        "This media is in use. Remove it from all content, including drafts and archived entries, first.",
    });
  await deleteFromBackblaze(item.key);
  await item.deleteOne();
  res.json({ message: "Media deleted from Backblaze." });
}
export async function retryEnquiryEmail(req, res) {
  const item = await Enquiry.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Enquiry not found." });
  try {
    item.emailId = await sendEnquiryEmail(item);
    item.emailSent = true;
    item.emailError = "";
  } catch (error) {
    item.emailSent = false;
    item.emailError = error.message;
  }
  await item.save();
  res.json(item);
}
