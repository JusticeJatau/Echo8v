import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitch } from "../components/Shared";

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const [error, setError] = useState("");

  if (loading) return <p className="wrap section">Checking your session…</p>;
  if (!user) return <Navigate to="/admin/login" replace />;

  async function signOut() {
    try {
      await logout();
    } catch (logoutError) {
      setError(logoutError.message);
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" to="/">
          Echo8V.
        </Link>
        <span className="eyebrow mt-3 mb-8">Website manager</span>

        <nav aria-label="Admin navigation">
          <NavLink end to="/admin">
            Overview
          </NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/services">Services</NavLink>
          <NavLink to="/admin/projects">Case studies</NavLink>
          <NavLink to="/admin/enquiries">Enquiries</NavLink>
          <NavLink to="/admin/media">Media</NavLink>
          <NavLink to="/admin/settings">Site settings</NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/">View website ↗</Link>
          <button onClick={signOut}>Sign out</button>
          {error && <p role="alert">{error}</p>}
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span>{user.name}</span>
          <ThemeSwitch />
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
