import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeSwitch } from "../components/Shared";
import { api, safeUrl } from "../api/api";
export default function PublicLayout() {
  const [settings, setSettings] = useState({
    companyName: "Echo8V",
    email: "jataujustice200@gmail.com",
    socials: {},
  });
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    api("/settings")
      .then(setSettings)
      .catch(() => {});
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="brand" to="/">
            <img src="/media/echo8v-logo.png" alt="" />
            <span>
              Echo<span className="blue">8</span>V
              <span className="brand-dot">.</span>
            </span>
          </Link>
          <nav
            className={open ? "main-nav open" : "main-nav"}
            aria-label="Main navigation"
          >
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/solutions">Solutions</NavLink>
            <NavLink to="/about">About</NavLink>
            <Link className="nav-contact" to="/contact">
              Let’s talk <ArrowUpRight size={16} />
            </Link>
          </nav>
          <ThemeSwitch />
          <button
            className="icon-button mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <div>
              <Link className="brand" to="/">
                Echo8V.
              </Link>
              <p>
                Practical software.
                <br />
                Real possibilities.
              </p>
            </div>
            <div>
              <span className="eyebrow">Have something in mind?</span>
              <a className="footer-email" href={"mailto:" + settings.email}>
                {settings.email} <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {settings.companyName}
            </span>
            <div className="flex flex-wrap gap-5">
              {Object.entries(settings.socials || {})
                .filter(([, url]) => safeUrl(url))
                .map(([name, url]) => (
                  <a
                    key={name}
                    href={safeUrl(url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {name}
                  </a>
                ))}
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
