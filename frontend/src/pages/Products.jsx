import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Notice, ProductCard } from "../components/Shared";
export default function Products() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/content")
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);
  const [category, setCategory] = useState("All");
  const products = items.filter((i) => i.kind === "product");
  const categories = [
    "All",
    ...new Set(products.map((i) => i.category).filter(Boolean)),
  ];
  return (
    <section className="wrap section">
      <span className="eyebrow">The Echo8V portfolio</span>
      <h1 className="page-title">
        Small frictions.
        <br />
        Thoughtful solutions.
      </h1>
      <p className="intro">
        Explore software for your ideas, your organisation, and the work that
        happens every day.
      </p>
      <Notice error>{error}</Notice>
      <div className="filters">
        {categories.map((c) => (
          <button
            key={c}
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {products
          .filter((i) => category === "All" || i.category === category)
          .map((item, i) => (
            <ProductCard key={item._id} item={item} index={i} />
          ))}
      </div>
      {products.length === 0 && <p>Products will appear here soon.</p>}
    </section>
  );
}
