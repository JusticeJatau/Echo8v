import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../api/api";
import { Notice } from "../../components/Shared";
import MediaField from "../../components/MediaField";
import { ProductBody } from "../ProductDetail";
const empty = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  category: "",
  availability: "Demo available",
  cover: "",
  logo: "",
  screenshots: [],
  video: "",
  features: [],
  url: "",
  buttonLabel: "Try it out",
  enquiryEnabled: true,
  featured: false,
  order: 0,
  status: "draft",
};
export default function ContentEditor({ kind, section }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...empty, kind }),
    [loading, setLoading] = useState(!!id),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(false);
  useEffect(() => {
    if (id)
      api("/admin/content")
        .then((items) => {
          const item = items.find((i) => i._id === id);
          if (!item) throw new Error("Entry not found.");
          setForm(item);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
  }, [id]);
  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/admin/content" + (id ? "/" + id : ""), {
        method: id ? "PUT" : "POST",
        body: {
          ...form,
          features: form.features.map((value) => value.trim()).filter(Boolean),
          screenshots: form.screenshots
            .map((value) => value.trim())
            .filter(Boolean),
        },
      });
      navigate("/admin/" + section);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <p>Loading editor…</p>;
  return (
    <>
      <div className="admin-heading">
        <div>
          <Link className="text-link" to={"/admin/" + section}>
            ← Back
          </Link>
          <h1>
            {id ? "Edit" : "Add"} {kind}
          </h1>
        </div>
        <button
          className="button secondary"
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Back to editor" : "Preview"}
        </button>
      </div>
      <Notice error>{error}</Notice>
      {preview ? (
        <ProductBody item={form} preview />
      ) : (
        <form onSubmit={save}>
          <div className="editor-grid">
            <section className="admin-panel">
              <h2>Content</h2>
              <label>
                Title
                <input
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!id)
                      set(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, ""),
                      );
                  }}
                />
              </label>
              <label>
                Page slug
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="product-name"
                />
              </label>
              <label>
                Short description
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={form.summary}
                  onChange={(e) => set("summary", e.target.value)}
                />
              </label>
              <label>
                Full description
                <textarea
                  rows={8}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </label>
              <label>
                Features (one per line)
                <textarea
                  rows={5}
                  value={form.features.join("\n")}
                  onChange={(e) => set("features", e.target.value.split("\n"))}
                />
              </label>
              <MediaField
                label="Cover image"
                value={form.cover}
                onChange={(v) => set("cover", v)}
              />
              <MediaField
                label="Product logo"
                value={form.logo}
                onChange={(v) => set("logo", v)}
              />
              <h3 className="my-5">Screenshots</h3>
              {form.screenshots.map((src, i) => (
                <div className="screenshot-editor" key={i}>
                  <MediaField
                    label={"Screenshot " + (i + 1)}
                    value={src}
                    onChange={(v) =>
                      set(
                        "screenshots",
                        form.screenshots.map((s, n) => (n === i ? v : s)),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="text-link"
                    onClick={() =>
                      set(
                        "screenshots",
                        form.screenshots.filter((_, n) => n !== i),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="button secondary mb-6"
                type="button"
                onClick={() => set("screenshots", [...form.screenshots, ""])}
              >
                Add screenshot
              </button>
              <MediaField
                label="Demo video"
                video
                value={form.video}
                onChange={(v) => set("video", v)}
              />
            </section>
            <aside className="admin-panel">
              <h2>Publishing</h2>
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label>
                Category
                <input
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                />
              </label>
              <label>
                Availability
                <select
                  value={form.availability}
                  onChange={(e) => set("availability", e.target.value)}
                >
                  {["Available", "Demo available", "Coming soon"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Display order
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => set("order", Number(e.target.value))}
                />
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />{" "}
                Featured on homepage
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={form.enquiryEnabled}
                  onChange={(e) => set("enquiryEnabled", e.target.checked)}
                />{" "}
                Show enquiry button
              </label>
              <label>
                Try / demo URL
                <input
                  type="url"
                  placeholder="Add live URL when ready"
                  value={form.url}
                  onChange={(e) => set("url", e.target.value)}
                />
              </label>
              <label>
                Button label
                <input
                  value={form.buttonLabel}
                  onChange={(e) => set("buttonLabel", e.target.value)}
                />
              </label>
              <button className="button w-full" disabled={busy}>
                {busy ? "Saving…" : "Save " + form.status}
              </button>
            </aside>
          </div>
        </form>
      )}
    </>
  );
}
