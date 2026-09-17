import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDown,
  Code2,
  Layers,
  Workflow,
  LifeBuoy,
} from "lucide-react";
import { api } from "../api/api";
import { ButtonLink, Notice, ProductCard } from "../components/Shared";

const serviceIcons = [Code2, Layers, Workflow, LifeBuoy];

export default function Home() {
  const [settings, setSettings] = useState({ sections: {} });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHome() {
    setError("");
    setLoading(true);
    try {
      const [siteSettings, content] = await Promise.all([
        api("/settings"),
        api("/content"),
      ]);
      setSettings(siteSettings);
      setItems(content);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHome();
  }, []);

  const products = items.filter((item) => item.kind === "product");
  const featuredProducts = products.filter((item) => item.featured);
  const services = items.filter((item) => item.kind === "service");
  const projects = items.filter((item) => item.kind === "project");
  const visibleProducts = featuredProducts.length ? featuredProducts : products;

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow hero-kicker">
            <span className="short-line" />
            {settings.tagline}
          </div>
          <h1>{settings.heroTitle}</h1>
          <p className="hero-description">{settings.heroText}</p>
          <div className="button-row">
            <ButtonLink to={settings.heroButtonUrl}>
              {settings.heroButtonLabel}
            </ButtonLink>
            <ButtonLink to={settings.secondaryButtonUrl} secondary>
              {settings.secondaryButtonLabel}
            </ButtonLink>
          </div>
          <a className="scroll-cue" href="#selected">
            Explore what we’re building <ArrowDown size={16} />
          </a>
        </div>

        <div className="hero-mark">
          <span className="mark-label">BUILT WITH PURPOSE / ECHO8V</span>
          <img
            src="/media/echo8v-logo.png"
            alt="Echo8V blue and charcoal emblem"
          />
          <div className="mark-footer">
            <span>Ideas into useful software.</span>
            <span>01 — ∞</span>
          </div>
        </div>
      </section>

      <div className="industry-strip">
        <div className="wrap flex flex-wrap justify-between gap-5">
          <span>Built around your world</span>
          <span>Businesses</span>
          <span>Schools</span>
          <span>Organisations</span>
          <span>Everyday life</span>
        </div>
      </div>

      {loading && <div className="wrap section">Loading products…</div>}
      {error && (
        <div className="wrap section">
          <Notice error>We couldn’t load the website content.</Notice>
          <button className="button" onClick={loadHome}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && settings.sections?.products !== false && (
        <section className="wrap section" id="selected">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / Our products</span>
              <h2>Useful by design.</h2>
            </div>
            <Link className="text-link" to="/products">
              All products <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product._id} item={product} index={index} />
            ))}
          </div>
        </section>
      )}

      {!loading && !error && settings.sections?.services !== false && (
        <section className="services-section">
          <div className="wrap section services-layout">
            <div>
              <span className="eyebrow">02 / Built for your business</span>
              <h2>
                Your workflow.
                <br />
                Your software.
              </h2>
              <p className="muted max-w-md mt-5">
                When an off-the-shelf tool doesn’t fit, we can build around the
                way your team works.
              </p>
              <div className="mt-8">
                <ButtonLink to="/contact">Tell us what you need</ButtonLink>
              </div>
            </div>
            <div className="service-list">
              {services.map((service, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];
                return (
                  <div className="service-row" key={service._id}>
                    <Icon size={24} />
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {!loading &&
        !error &&
        settings.sections?.projects !== false &&
        projects.length > 0 && (
          <section className="wrap section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Selected work</span>
                <h2>From problem to product.</h2>
              </div>
            </div>
            <div className="product-grid">
              {projects.map((project, index) => (
                <ProductCard key={project._id} item={project} index={index} />
              ))}
            </div>
          </section>
        )}

      {!loading && !error && settings.sections?.founder !== false && (
        <section className="wrap section founder-teaser">
          <div className="founder-photo">
            <img src="/media/justice-jatau.png" alt={settings.founderName} />
          </div>
          <div>
            <span className="eyebrow">The person behind Echo8V</span>
            <h2>
              Built with care.
              <br />
              Made to be useful.
            </h2>
            <p className="muted mt-6">{settings.founderBio}</p>
            <p className="founder-signature">
              {settings.founderName}
              <span>{settings.founderTitle}</span>
            </p>
            <Link className="text-link" to="/about">
              More about Echo8V <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      )}

      <section className="wrap cta-section">
        <div>
          <span className="eyebrow">Let’s make work simpler</span>
          <h2>What could work better?</h2>
          <p>Tell us about the process you want to improve.</p>
        </div>
        <ButtonLink to="/contact">Start a conversation</ButtonLink>
      </section>
    </>
  );
}
