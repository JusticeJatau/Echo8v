import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ThemeSwitch, Notice } from "../../components/Shared";
export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (loading) return <p className="section wrap">Checking your session…</p>;
  if (user) return <Navigate to="/admin" replace />;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      await login(data.get("email"), data.get("password"));
      navigate("/admin");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="brand">
            Echo8V.
          </Link>
          <ThemeSwitch />
        </div>
        <span className="eyebrow">Website administration</span>
        <h1 className="text-3xl mt-3 mb-7">Welcome back.</h1>
        <form onSubmit={submit}>
          <Notice error>{error}</Notice>
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="button w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link className="text-link mt-7" to="/">
          Back to website
        </Link>
      </div>
    </main>
  );
}
