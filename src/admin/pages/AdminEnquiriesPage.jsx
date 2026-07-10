import React, { useState } from "react";
import EnquiriesTable from "../components/enquiries/EnquiriesTable";
import AdminPageHeader from "../components/shared/AdminPageHeader";
import { useEnquiries } from "../hooks/useEnquiries";

const AdminEnquiriesPage = () => {
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const {
    enquiries,
    loading,
    loadingMore,
    loadMore,
    saving,
    error,
    setError,
    loadMoreEnquiries,
    updateEnquiry,
    removeEnquiry,
  } = useEnquiries(filters);

  return (
    <section>
      <AdminPageHeader
        title="Enquiries"
        description="Review bulk enquiry submissions from the website. Filter by status or date range, update status, add internal notes, and follow up with leads."
      />

      <div className="rounded-2xl border border-maroon-200/50 bg-white p-5 shadow-sm sm:p-6">
        <EnquiriesTable
          enquiries={enquiries}
          loading={loading}
          loadingMore={loadingMore}
          loadMore={loadMore}
          saving={saving}
          error={error}
          filters={filters}
          onFiltersChange={setFilters}
          onLoadMore={loadMoreEnquiries}
          onDismissError={() => setError(null)}
          onUpdate={updateEnquiry}
          onDelete={removeEnquiry}
        />
      </div>
    </section>
  );
};

export default AdminEnquiriesPage;
