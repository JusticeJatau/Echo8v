import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Notice } from "../../components/Shared";

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/enquiries")
      .then(setEnquiries)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    try {
      const saved = await api("/admin/enquiries/" + id, {
        method: "PATCH",
        body: { status },
      });
      setEnquiries(enquiries.map((item) => (item._id === id ? saved : item)));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function retryEmail(id) {
    try {
      const saved = await api("/admin/enquiries/" + id + "/retry", {
        method: "POST",
      });
      setEnquiries(enquiries.map((item) => (item._id === id ? saved : item)));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const visibleEnquiries = enquiries.filter((item) => {
    return filter === "all" || item.status === filter;
  });

  return (
    <>
      <div className="admin-heading">
        <h1>Enquiries</h1>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <Notice error>{error}</Notice>
      {loading && <p>Loading enquiries…</p>}

      {visibleEnquiries.map((enquiry) => (
        <article className="admin-panel" key={enquiry._id}>
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <h2>{enquiry.name}</h2>
              <a className="text-link" href={"mailto:" + enquiry.email}>
                {enquiry.email}
              </a>
              <p className="muted">
                {enquiry.organisation || "No organisation"} ·{" "}
                {new Date(enquiry.createdAt).toLocaleString()}
              </p>
            </div>
            <select
              aria-label={"Status for " + enquiry.name}
              value={enquiry.status}
              onChange={(event) =>
                updateStatus(enquiry._id, event.target.value)
              }
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <p className="mt-5">
            Email notification: {enquiry.emailSent ? "Sent" : "Not sent"}
          </p>
          {!enquiry.emailSent && (
            <button
              className="text-link mt-2"
              onClick={() => retryEmail(enquiry._id)}
            >
              Retry email
            </button>
          )}
          {enquiry.emailError && (
            <p className="muted text-sm mt-2">{enquiry.emailError}</p>
          )}

          <h3 className="mt-6">{enquiry.interest || "General enquiry"}</h3>
          <p className="whitespace-pre-wrap mt-3">{enquiry.message}</p>
        </article>
      ))}

      {!loading && !visibleEnquiries.length && (
        <div className="admin-panel">No enquiries in this view.</div>
      )}
    </>
  );
}
