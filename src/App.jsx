import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import { WhatsAppSourceProvider } from "./context/WhatsAppSourceContext";
import AuthHandler from "./components/auth/AuthHandler";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SeoHead from "./components/SeoHead";
import Hero from "./section/Hero";
import Certification from "./section/Certification";
import About from "./section/About";
import OurProducts from "./section/OurProducts";
import Export from "./section/Export";
import Enquire from "./section/Enquire";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductFaqPage from "./pages/ProductFaqPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BrochurePage from "./pages/BrochurePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminCategoriesPage from "./admin/pages/AdminCategoriesPage";
import AdminProductsPage from "./admin/pages/AdminProductsPage";
import AdminBlogsPage from "./admin/pages/AdminBlogsPage";
import AdminEnquiriesPage from "./admin/pages/AdminEnquiriesPage";
import { DEFAULT_DESCRIPTION, organizationJsonLd } from "./constants/seo";

const Home = () => {
  return (
    <div className="min-h-screen bg-header">
      <SeoHead
        path="/"
        description={DEFAULT_DESCRIPTION}
        jsonLd={organizationJsonLd()}
      />
      <Header />

      <main>
        <Hero />
        <Certification />
        <About />
        <OurProducts />
        <Export />
        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <WhatsAppSourceProvider>
      <AuthHandler />
      <ScrollToHash />
      <FloatingWhatsAppButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug/faq" element={<ProductFaqPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/brochure" element={<BrochurePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="categories" replace />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="blogs" element={<AdminBlogsPage />} />
        </Route>
      </Routes>
    </WhatsAppSourceProvider>
  );
};

export default App;
