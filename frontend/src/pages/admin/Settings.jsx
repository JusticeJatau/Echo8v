import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Notice } from "../../components/Shared";

export default function Settings() {
  const [form, setForm] = useState({ sections: {}, socials: {} });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/settings")
      .then(setForm)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function changeSection(section, checked) {
    setForm((current) => ({
      ...current,
      sections: { ...current.sections, [section]: checked },
    }));
  }

  function changeSocial(network, value) {
    setForm((current) => ({
      ...current,
      socials: { ...current.socials, [network]: value },
    }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api("/admin/settings", { method: "PUT", body: form });
      setMessage("Website settings saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p>Loading settings…</p>;

  return (
    <>
      <div className="admin-heading"><h1>Site settings</h1></div>
      <Notice error>{error}</Notice>
      <Notice>{message}</Notice>

      <form onSubmit={save}>
        <div className="settings-grid">
          <section className="admin-panel">
            <h2>Brand & homepage</h2>
            <label>Company name<input value={form.companyName || ""} onChange={(e) => change("companyName", e.target.value)} /></label>
            <label>Opening label<input value={form.tagline || ""} onChange={(e) => change("tagline", e.target.value)} /></label>
            <label>Main headline<textarea rows={4} value={form.heroTitle || ""} onChange={(e) => change("heroTitle", e.target.value)} /></label>
            <label>Introduction<textarea rows={4} value={form.heroText || ""} onChange={(e) => change("heroText", e.target.value)} /></label>
            <label>Primary button label<input value={form.heroButtonLabel || ""} onChange={(e) => change("heroButtonLabel", e.target.value)} /></label>
            <label>Primary button URL<input value={form.heroButtonUrl || ""} onChange={(e) => change("heroButtonUrl", e.target.value)} /></label>
            <label>Secondary button label<input value={form.secondaryButtonLabel || ""} onChange={(e) => change("secondaryButtonLabel", e.target.value)} /></label>
            <label>Secondary button URL<input value={form.secondaryButtonUrl || ""} onChange={(e) => change("secondaryButtonUrl", e.target.value)} /></label>
            <p className="muted text-sm">Logo: /media/echo8v-logo.png</p>

            <h3 className="my-5">Visible sections</h3>
            <label className="check-label"><input type="checkbox" checked={form.sections?.products !== false} onChange={(e) => changeSection("products", e.target.checked)} />Products</label>
            <label className="check-label"><input type="checkbox" checked={form.sections?.services !== false} onChange={(e) => changeSection("services", e.target.checked)} />Services</label>
            <label className="check-label"><input type="checkbox" checked={form.sections?.projects !== false} onChange={(e) => changeSection("projects", e.target.checked)} />Case studies</label>
            <label className="check-label"><input type="checkbox" checked={form.sections?.founder !== false} onChange={(e) => changeSection("founder", e.target.checked)} />Founder</label>
          </section>

          <section className="admin-panel">
            <h2>About & founder</h2>
            <label>About Echo8V<textarea rows={4} value={form.about || ""} onChange={(e) => change("about", e.target.value)} /></label>
            <label>Mission<textarea rows={4} value={form.mission || ""} onChange={(e) => change("mission", e.target.value)} /></label>
            <label>Founder name<input value={form.founderName || ""} onChange={(e) => change("founderName", e.target.value)} /></label>
            <label>Founder title<input value={form.founderTitle || ""} onChange={(e) => change("founderTitle", e.target.value)} /></label>
            <label>Founder biography<textarea rows={4} value={form.founderBio || ""} onChange={(e) => change("founderBio", e.target.value)} /></label>
            <p className="muted text-sm">Founder photo: /media/justice-jatau.png</p>
          </section>

          <section className="admin-panel">
            <h2>Contact & social links</h2>
            <label>Public email<input type="email" value={form.email || ""} onChange={(e) => change("email", e.target.value)} /></label>
            <label>WhatsApp number with country code<input value={form.whatsapp || ""} onChange={(e) => change("whatsapp", e.target.value)} /></label>
            <p className="muted text-sm">Leave a link empty to hide it.</p>
            <label>Facebook<input type="url" placeholder="Add Facebook profile URL" value={form.socials?.facebook || ""} onChange={(e) => changeSocial("facebook", e.target.value)} /></label>
            <label>Instagram<input type="url" placeholder="Add Instagram profile URL" value={form.socials?.instagram || ""} onChange={(e) => changeSocial("instagram", e.target.value)} /></label>
            <label>LinkedIn<input type="url" placeholder="Add LinkedIn profile URL" value={form.socials?.linkedin || ""} onChange={(e) => changeSocial("linkedin", e.target.value)} /></label>
            <label>GitHub<input type="url" placeholder="Add GitHub profile URL" value={form.socials?.github || ""} onChange={(e) => changeSocial("github", e.target.value)} /></label>
            <label>YouTube<input type="url" placeholder="Add YouTube profile URL" value={form.socials?.youtube || ""} onChange={(e) => changeSocial("youtube", e.target.value)} /></label>
          </section>

          <section className="admin-panel">
            <h2>Search appearance</h2>
            <label>Site title<input value={form.seoTitle || ""} onChange={(e) => change("seoTitle", e.target.value)} /></label>
            <label>Site description<textarea rows={4} value={form.seoDescription || ""} onChange={(e) => change("seoDescription", e.target.value)} /></label>
          </section>
        </div>
        <button className="button" disabled={busy}>{busy ? "Saving…" : "Save website settings"}</button>
      </form>
    </>
  );
}
