import { useEffect, useState } from "react";
import { api } from "../api/api";
import { ButtonLink, Notice } from "../components/Shared";
export default function Solutions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/content")
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <section className="wrap section">
      <span className="eyebrow">Custom systems & services</span>
      <h1 className="page-title">
        Make room for
        <br />
        better work.
      </h1>
      <p className="intro">
        Bring us the process that slows your team down. We’ll work with you to
        understand it and shape a practical solution.
      </p>
      <Notice error>{error}</Notice>
      <div className="solutions-list">
        {items
          .filter((i) => i.kind === "service")
          .map((s, i) => (
            <article key={s._id}>
              <span className="eyebrow">0{i + 1}</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.description || s.summary}</p>
              </div>
              <ButtonLink
                to={"/contact?product=" + encodeURIComponent(s.title)}
                secondary
              >
                Discuss this
              </ButtonLink>
            </article>
          ))}
      </div>
      <h2 className="mt-20">A clear path from idea to use.</h2>
      <div className="process-grid">
        {[
          [
            "Understand",
            "We discuss your current workflow and the problem to solve.",
          ],
          ["Agree", "We define the scope, pricing, and delivery expectations."],
          ["Build & review", "You review the system as it takes shape."],
          [
            "Launch & support",
            "We help with setup, training, and agreed ongoing support.",
          ],
        ].map(([t, d], i) => (
          <div key={t}>
            <span className="eyebrow">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
