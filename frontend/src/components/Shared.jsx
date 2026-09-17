import { Link } from "react-router-dom";
import { ArrowUpRight, Monitor, Image as ImageIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { safeUrl } from "../api/api";
export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <label className="theme-switch">
      <Monitor size={17} />
      <span className="sr-only">Colour theme</span>
      <select
        aria-label="Colour theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
export function ButtonLink({ to, children, secondary = false }) {
  const url = safeUrl(to);
  if (!url) return null;
  return url.startsWith("/") ? (
    <Link className={"button " + (secondary ? "secondary" : "")} to={url}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  ) : (
    <a
      className={"button " + (secondary ? "secondary" : "")}
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <ArrowUpRight size={18} />
    </a>
  );
}
export function Notice({ children, error = false }) {
  return children ? (
    <div
      role={error ? "alert" : "status"}
      className={"notice " + (error ? "error" : "")}
    >
      {children}
    </div>
  ) : null;
}
export function ProductCard({ item, index = 0 }) {
  return (
    <Link className="product-card group" to={"/products/" + item.slug}>
      <div className={"product-art art-" + (index % 5)}>
        {safeUrl(item.cover) ? (
          <img src={safeUrl(item.cover)} alt={item.title + " preview"} />
        ) : (
          <>
            <span className="art-category">{item.category || "Echo8V"}</span>
            <span className="art-name">{item.title}</span>
            <span className="art-placeholder">
              <ImageIcon size={15} /> Product screenshot coming soon
            </span>
          </>
        )}
      </div>
      <div className="card-caption">
        <div>
          <span className="eyebrow">{item.category}</span>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </div>
        <ArrowUpRight size={22} />
      </div>
    </Link>
  );
}
