import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Notice } from "../../components/Shared";
export default function Media() {
  const [items, setItems] = useState([]),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api("/admin/media")
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const item = await api("/admin/media", { method: "POST", body });
      setItems([item, ...items]);
      setMessage("Uploaded. Copy the path into any image or video field.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  async function remove(item) {
    if (!confirm("Permanently delete " + item.name + " from Backblaze?"))
      return;
    setError("");
    setMessage("");
    try {
      await api("/admin/media/" + item._id, { method: "DELETE" });
      setItems(items.filter((i) => i._id !== item._id));
      setMessage("Media deleted.");
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <>
      <div className="admin-heading">
        <h1>Media library</h1>
        <label className="upload-label">
          {busy ? "Uploading…" : "Upload media"}
          <input
            type="file"
            disabled={busy}
            accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
            onChange={upload}
          />
        </label>
      </div>
      <p className="muted mb-6">
        Images and videos up to 30 MB. Files remain available when you archive a
        product.
      </p>
      <Notice error>{error}</Notice>
      <Notice>{message}</Notice>
      <div className="media-grid">
        {items.map((item) => (
          <article className="admin-panel" key={item._id}>
            {item.mime?.startsWith("image/") ? (
              <img src={item.url} alt={item.name} />
            ) : (
              <video src={item.url} controls preload="metadata" />
            )}
            <p className="break-all mt-3">{item.name}</p>
            <input
              aria-label={"Path for " + item.name}
              readOnly
              value={item.url}
              onFocus={(e) => e.target.select()}
            />
            <button
              className="text-link mt-3"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(item.url);
                  setMessage("Media path copied.");
                } catch {
                  setError("Select and copy the path manually.");
                }
              }}
            >
              Copy path
            </button>
            <button
              className="text-link mt-3 ml-5"
              onClick={() => remove(item)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
      {!items.length && (
        <p>
          No uploads yet. Your logo and founder photo are included as built-in
          assets.
        </p>
      )}
    </>
  );
}
