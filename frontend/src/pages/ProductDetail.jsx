import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { ButtonLink, Notice } from "../components/Shared";
import { api, safeUrl } from "../api/api";

function getYouTubeEmbedUrl(videoUrl) {
  if (!videoUrl) return "";

  try {
    const url = new URL(videoUrl);
    const hostname = url.hostname
      .replace("www.", "")
      .toLowerCase();

    if (hostname === "youtu.be") {
      const videoId = url.pathname
        .split("/")
        .filter(Boolean)[0];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");

        return videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : "";
      }

      if (
        url.pathname.startsWith("/shorts/") ||
        url.pathname.startsWith("/embed/")
      ) {
        const videoId = url.pathname
          .split("/")
          .filter(Boolean)[1];

        return videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : "";
      }
    }

    return "";
  } catch {
    return "";
  }
}

export function ProductBody({ item, preview = false }) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(
    item.video,
  );
  return (
    <section className="wrap section">
      <Link className="text-link mb-8" to="/products">
        <ArrowLeft size={16} /> All products
      </Link>
      {preview && (
        <p className="notice">
          Preview — your changes have not been published.
        </p>
      )}
      <div className="detail-header">
        <div>
          <span className="eyebrow">
            {item.category} / {item.availability}
          </span>
          <h1 className="page-title">{item.title}</h1>
          <p className="intro">{item.summary}</p>
          <div className="button-row">
            <ButtonLink to={item.url}>
              {item.buttonLabel || "Try it out"}
            </ButtonLink>
            {item.enquiryEnabled && (
              <ButtonLink
                to={"/contact?product=" + encodeURIComponent(item.title)}
                secondary
              >
                Request a demo
              </ButtonLink>
            )}
          </div>
          {!item.url && item.kind === "product" && (
            <p className="muted text-sm mt-4">
              Demo link coming soon. Contact us for a walkthrough.
            </p>
          )}
        </div>
        {safeUrl(item.logo) && (
          <img
            className="detail-logo"
            src={safeUrl(item.logo)}
            alt={item.title + " logo"}
          />
        )}
      </div>
      <div className="detail-cover">
        {safeUrl(item.cover) ? (
          <img src={safeUrl(item.cover)} alt={item.title + " overview"} />
        ) : (
          <div className="empty-media">
            <ImageIcon size={36} />
            <span>{item.title}</span>
            <p>Product screenshots coming soon</p>
          </div>
        )}
      </div>
      <div className="detail-columns">
        <div>
          <h2>Made for the everyday.</h2>
          <p className="whitespace-pre-line muted mt-5">{item.description}</p>
        </div>
        <div>
          <h3>What it brings together</h3>
          <ul className="feature-list">
            {item.features?.map((f, i) => (
              <li key={i}>
                <Check size={18} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {item.screenshots?.length > 0 && (
        <div className="screenshot-grid">
          {item.screenshots.filter(safeUrl).map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noreferrer">
              <img
                src={src}
                alt={item.title + " screenshot " + (i + 1)}
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}
      {safeUrl(item.video) && (
        <div className="section">
          <h2 className="mb-6">
            See it in action.
          </h2>

          {youtubeEmbedUrl ? (
            <div className="youtube-video">
              <iframe
                src={youtubeEmbedUrl}
                title={`${item.title} demo video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <video
              className="demo-video"
              controls
              preload="metadata"
              src={safeUrl(item.video)}
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>
      )}
    </section>
  );
}
export default function ProductDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    api("/content/" + slug)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);
  if (loading)
    return <section className="wrap section">Loading product…</section>;
  if (error)
    return (
      <section className="wrap section">
        <Notice error>{error}</Notice>
        <Link to="/products">Explore our products</Link>
      </section>
    );
  return item ? (
    <ProductBody item={item} />
  ) : (
    <section className="wrap section">
      <h1>Page not found.</h1>
      <Link to="/products">Explore our products</Link>
    </section>
  );
}
