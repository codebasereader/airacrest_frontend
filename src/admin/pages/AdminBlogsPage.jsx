import React, { useState } from "react";
import BlogsPanel from "../components/blogs/BlogsPanel";
import AdminPageHeader from "../components/shared/AdminPageHeader";
import { useBlogs } from "../hooks/useBlogs";
import { useProducts } from "../hooks/useProducts";

const AdminBlogsPage = () => {
  const [statusFilter, setStatusFilter] = useState("");

  const { products } = useProducts();
  const {
    blogs,
    loading,
    saving,
    error,
    setError,
    createBlog,
    updateBlog,
    removeBlog,
  } = useBlogs({ status: statusFilter });

  return (
    <section>
      <AdminPageHeader
        title="Blogs"
        description="Write and publish export insights, product guides, and company updates. Link articles to products so they appear as related posts on product detail pages."
      />

      <div className="rounded-2xl border border-maroon-200/50 bg-white p-5 shadow-sm sm:p-6">
        <BlogsPanel
          blogs={blogs}
          products={products}
          loading={loading}
          saving={saving}
          error={error}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onDismissError={() => setError(null)}
          onSetError={setError}
          onCreate={createBlog}
          onUpdate={updateBlog}
          onDelete={removeBlog}
        />
      </div>
    </section>
  );
};

export default AdminBlogsPage;
