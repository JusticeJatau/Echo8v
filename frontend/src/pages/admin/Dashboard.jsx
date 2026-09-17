import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import { Notice } from "../../components/Shared";

export default function Dashboard() {
  const [content, setContent] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/admin/content"), api("/admin/enquiries")])
      .then(([contentData, enquiryData]) => {
        setContent(contentData);
        setEnquiries(enquiryData);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const productCount = content.filter((item) => item.kind === "product").length;
  const publishedCount = content.filter(
    (item) => item.status === "published",
  ).length;
  const draftCount = content.filter((item) => item.status === "draft").length;
  const newEnquiryCount = enquiries.filter(
    (item) => item.status === "new",
  ).length;

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">Your company website</span>
          <h1>Overview</h1>
        </div>
        <Link className="button" to="/admin/products/new">
          Add product
        </Link>
      </div>

      <Notice error>{error}</Notice>
      {loading && <p>Loading overview…</p>}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            <div className="stat">
              <span>Products</span>
              <strong>{productCount}</strong>
            </div>
            <div className="stat">
              <span>Published entries</span>
              <strong>{publishedCount}</strong>
            </div>
            <div className="stat">
              <span>New enquiries</span>
              <strong>{newEnquiryCount}</strong>
            </div>
            <div className="stat">
              <span>Drafts</span>
              <strong>{draftCount}</strong>
            </div>
          </div>

          <section className="admin-panel">
            <h2>Make it yours</h2>
            <p className="muted my-4">
              Add screenshots, video demos and live URLs. Update company text,
              email and social links when needed.
            </p>
            <Link className="text-link" to="/admin/settings">
              Edit website settings →
            </Link>
          </section>

          <section className="admin-panel">
            <h2>Recent enquiries</h2>
            {enquiries.slice(0, 5).map((enquiry) => (
              <div className="list-row" key={enquiry._id}>
                <div>
                  <strong>{enquiry.name}</strong>
                  <p>{enquiry.interest || "General enquiry"}</p>
                </div>
                <span className="badge">{enquiry.status}</span>
              </div>
            ))}
            {!enquiries.length && (
              <p className="muted mt-4">No enquiries yet.</p>
            )}
            <Link className="text-link mt-6" to="/admin/enquiries">
              Open enquiries →
            </Link>
          </section>
        </>
      )}
    </>
  );
}
