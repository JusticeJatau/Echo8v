import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import { Notice } from "../../components/Shared";
export default function ContentList({ kind, section }) {
  const [items, setItems] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState("");
  async function load() {
    try {
      setItems(await api("/admin/content"));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function archive(item) {
    if (
      !confirm(
        "Archive " +
          item.title +
          "? It will be removed from the public website.",
      )
    )
      return;
    try {
      await api("/admin/content/" + item._id, {
        method: "PUT",
        body: { status: "archived" },
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <>
      <div className="admin-heading">
        <h1>{section === "projects" ? "Case studies" : section}</h1>
        <Link className="button" to={"/admin/" + section + "/new"}>
          Add {kind}
        </Link>
      </div>
      <Notice error>{error}</Notice>
      <input
        className="mb-6"
        aria-label="Search content"
        placeholder="Search by title…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="admin-panel">
        {loading ? (
          <p>Loading…</p>
        ) : (
          items
            .filter(
              (i) =>
                i.kind === kind &&
                i.title.toLowerCase().includes(query.toLowerCase()),
            )
            .map((item) => (
              <div className="list-row" key={item._id}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">
                    {item.category || kind} · Order {item.order}
                  </p>
                </div>
                <div className="list-actions">
                  <span className="badge">{item.status}</span>
                  <Link
                    className="text-link"
                    to={"/admin/" + section + "/" + item._id}
                  >
                    Edit
                  </Link>
                  {item.status !== "archived" && (
                    <button onClick={() => archive(item)}>Archive</button>
                  )}
                </div>
              </div>
            ))
        )}
        {!loading && !items.some((i) => i.kind === kind) && (
          <p>No entries yet. Add your first {kind}.</p>
        )}
      </div>
    </>
  );
}
