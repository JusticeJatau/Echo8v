import { useEffect, useState } from "react";
import { api } from "../api/api";
import { ButtonLink, Notice } from "../components/Shared";
export default function About() {
  const [s, setSettings] = useState({ sections: {} });
  const [error, setError] = useState("");
  useEffect(() => {
    api("/settings")
      .then(setSettings)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <section className="wrap section">
      <span className="eyebrow">About Echo8V</span>
      <h1 className="page-title">
        Technology with
        <br />a practical purpose.
      </h1>
      <Notice error>{error}</Notice>
      <div className="about-copy">
        <p>{s.about}</p>
        <div>
          <span className="eyebrow">Our mission</span>
          <h2>{s.mission}</h2>
        </div>
      </div>
      {s.sections?.founder !== false && (
        <div className="founder-teaser about-founder">
          <div className="founder-photo">
            <img src="/media/justice-jatau.png" alt={s.founderName} />
          </div>
          <div>
            <span className="eyebrow">Meet the founder</span>
            <h2>{s.founderName}</h2>
            <p className="blue mt-4">{s.founderTitle}</p>
            <p className="muted whitespace-pre-line my-7">{s.founderBio}</p>
            <ButtonLink to="/contact">Get in touch</ButtonLink>
          </div>
        </div>
      )}
    </section>
  );
}
