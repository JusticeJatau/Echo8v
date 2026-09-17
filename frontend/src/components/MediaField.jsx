import { useState } from "react";
import { api, safeUrl } from "../api/api";
export default function MediaField({ label, value, onChange, video = false }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const result = await api("/admin/media", { method: "POST", body: data });
      onChange(result.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  return (
    <div className="media-field">
      <label>
        {label}
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            video
              ? "Paste a YouTube link or upload an MP4/WebM video"
              : "Upload an image or paste an image URL"
          }
        />
      </label>
      <label className="upload-label">
        {busy ? "Uploading…" : "Upload " + (video ? "video" : "image")}
        <input
          type="file"
          disabled={busy}
          accept={
            video
              ? "video/mp4,video/webm"
              : "image/png,image/jpeg,image/webp,image/gif"
          }
          onChange={upload}
        />
      </label>
      <span className="muted text-sm">
        {video
          ? "Paste a YouTube link or upload an MP4/WebM video. Maximum 30 MB."
          : "Upload a JPG, PNG, WebP or GIF image. Maximum 30 MB."}
      </span>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
      {!video && safeUrl(value) && (
        <img
          className="media-thumb"
          src={safeUrl(value)}
          alt={label + " preview"}
        />
      )}
    </div>
  );
}
