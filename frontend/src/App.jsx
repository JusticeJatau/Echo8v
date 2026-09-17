import { Routes, Route, Link } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import AdminLayout from "./layout/AdminLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Solutions from "./pages/Solutions";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ContentList from "./pages/admin/ContentList";
import ContentEditor from "./pages/admin/ContentEditor";
import Settings from "./pages/admin/Settings";
import Enquiries from "./pages/admin/Enquiries";
import Media from "./pages/admin/Media";
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="*"
          element={
            <section className="wrap section">
              <h1>Page not found.</h1>
              <Link to="/">Back home</Link>
            </section>
          }
        />
      </Route>
      <Route path="admin/login" element={<Login />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="products"
          element={<ContentList kind="product" section="products" />}
        />
        <Route
          path="products/new"
          element={
            <ContentEditor key="editor-1" kind="product" section="products" />
          }
        />
        <Route
          path="products/:id"
          element={
            <ContentEditor key="editor-2" kind="product" section="products" />
          }
        />
        <Route
          path="services"
          element={<ContentList kind="service" section="services" />}
        />
        <Route
          path="services/new"
          element={
            <ContentEditor key="editor-3" kind="service" section="services" />
          }
        />
        <Route
          path="services/:id"
          element={
            <ContentEditor key="editor-4" kind="service" section="services" />
          }
        />
        <Route
          path="projects"
          element={<ContentList kind="project" section="projects" />}
        />
        <Route
          path="projects/new"
          element={
            <ContentEditor key="editor-5" kind="project" section="projects" />
          }
        />
        <Route
          path="projects/:id"
          element={
            <ContentEditor key="editor-6" kind="project" section="projects" />
          }
        />
        <Route path="settings" element={<Settings />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="media" element={<Media />} />
      </Route>
    </Routes>
  );
}
