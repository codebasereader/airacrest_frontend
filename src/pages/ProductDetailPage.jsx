import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductBreadcrumb from "../components/product-detail/ProductBreadcrumb";
import ProductGallery from "../components/product-detail/ProductGallery";
import ProductHero from "../components/product-detail/ProductHero";
import SpecsTable from "../components/product-detail/SpecsTable";
import ProductNote from "../components/product-detail/ProductNote";
import ProductDetailActions from "../components/product-detail/ProductDetailActions";
import RelatedBlogs from "../components/blogs/RelatedBlogs";
import { usePublicProduct } from "../hooks/usePublicProducts";
import { toBritishSpelling } from "../utils/britishSpelling";

const ProductDetailSkeleton = () => (
  <div className="relative mx-auto max-w-[1200px] animate-pulse">
    <div className="mb-8 h-4 w-48 rounded bg-cream-200/80 lg:mb-10" />
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
      <div className="aspect-square rounded-2xl bg-cream-200/80" />
      <div className="space-y-4">
        <div className="h-3 w-32 rounded bg-cream-200/60" />
        <div className="h-10 w-3/4 rounded bg-cream-200/80" />
        <div className="h-24 w-full rounded bg-cream-200/60" />
      </div>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { product, loading, error } = usePublicProduct(productId);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <main className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <main className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div
          className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-maroon-300/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1200px]">
          <ProductBreadcrumb title={product.name} />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            <ProductGallery
              images={product.images}
              title={toBritishSpelling(product.name)}
            />
            <div>
              <ProductHero product={product} />
              <ProductDetailActions />
            </div>
          </div>

          <div className="mt-14 lg:mt-20">
            <SpecsTable specifications={product.specifications} />
            <ProductNote note={product.note} />
          </div>

          <RelatedBlogs productId={product._id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
