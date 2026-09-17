import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/api";
import { Notice } from "../components/Shared";
export default function Contact() {
  const [settings, setSettings] = useState({
    email: "jataujustice200@gmail.com",
    whatsapp: "",
  });
  const [items, setItems] = useState([]);
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api("/settings"), api("/content")])
      .then(([siteSettings, content]) => {
        setSettings(siteSettings);
        setItems(content);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const form = e.currentTarget;
    try {
      const data = await api("/enquiries", {
        method: "POST",
        body: Object.fromEntries(new FormData(form)),
      });
      setMessage(data.message);
      form.reset();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="wrap section contact-layout">
      <div>
        <span className="eyebrow">Let’s talk</span>
        <h1 className="page-title">
          What are you
          <br />
          working on?
        </h1>
        <p className="intro">
          Request a demo, ask about a product, or tell us what your organisation
          needs.
        </p>
        <a className="text-link break-all" href={"mailto:" + settings.email}>
          {settings.email}
        </a>
        {settings.whatsapp && (
          <a
            className="text-link mt-5"
            href={"https://wa.me/" + settings.whatsapp.replace(/\D/g, "")}
          >
            Chat on WhatsApp
          </a>
        )}
      </div>
      <form className="form-panel" onSubmit={submit}>
        <Notice error>{error}</Notice>
        <Notice>{message}</Notice>
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Organisation <span className="muted">(optional)</span>
          <input
            name="organisation"
            autoComplete="organization"
            maxLength={180}
          />
        </label>
        <label>
          I’m interested in
          <select name="interest" defaultValue={params.get("product") || ""}>
            <option value="">A custom project / general enquiry</option>
            {items
              .filter((i) => i.kind !== "project")
              .map((i) => (
                <option key={i._id}>{i.title}</option>
              ))}
          </select>
        </label>
        <label>
          Tell us a little about it
          <textarea name="message" rows={5} required maxLength={6000} />
        </label>
        <div className="honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="muted text-sm">
          We’ll use these details to respond to your enquiry.
        </p>
        <button className="button" disabled={busy}>
          {busy ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </section>
  );
}
