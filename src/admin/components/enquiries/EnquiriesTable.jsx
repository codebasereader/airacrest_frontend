import React, { useState } from "react";
import {
  adminFieldClass,
  adminSecondaryButtonClass,
} from "../../constants/formStyles";
import { ENQUIRY_STATUSES } from "../../constants/enquiryStatuses";
import {
  formatEnquiryDate,
  getProductSummary,
  getQuantitySummary,
} from "../../utils/enquiryFormatters";
import AdminAlert from "../shared/AdminAlert";
import AdminEmptyState from "../shared/AdminEmptyState";
import AdminSpinner from "../shared/AdminSpinner";
import EnquiryDetailDrawer from "./EnquiryDetailDrawer";
import EnquiryStatusBadge from "./EnquiryStatusBadge";

const thClass =
  "px-4 py-3 text-left font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-600 uppercase";

const tdClass = "px-4 py-3.5 font-sans text-sm text-maroon-900 align-top";

const filterLabelClass =
  "mb-1.5 block font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-700 uppercase";

const EnquiriesTable = ({
  enquiries,
  loading,
  loadingMore,
  loadMore,
  saving,
  error,
  filters,
  onFiltersChange,
  onLoadMore,
  onDismissError,
  onUpdate,
  onDelete,
}) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { status: statusFilter, startDate, endDate } = filters;

  const hasActiveFilters = statusFilter || startDate || endDate;

  const openDrawer = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDrawerOpen(true);
    onDismissError?.();
  };

  const closeDrawer = () => {
    if (saving) return;
    setDrawerOpen(false);
    setSelectedEnquiry(null);
  };

  const handleSave = async (id, payload) => {
    await onUpdate(id, payload);
    setSelectedEnquiry((prev) =>
      prev?._id === id ? { ...prev, ...payload } : prev,
    );
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    closeDrawer();
  };

  const updateFilter = (field) => (event) => {
    onFiltersChange({ ...filters, [field]: event.target.value });
  };

  const clearFilters = () => {
    onFiltersChange({ status: "", startDate: "", endDate: "" });
  };

  const countLabel =
    loadMore.total > enquiries.length
      ? `${enquiries.length} of ${loadMore.total}`
      : String(enquiries.length);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-[0.06em] text-maroon-900">
            All Enquiries
          </h2>
          <p className="mt-1 font-sans text-xs text-maroon-600">
            {loading ? "Loading…" : `${countLabel} submission${loadMore.total === 1 ? "" : "s"}`}
            {hasActiveFilters ? " · filtered" : ""}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-maroon-100 bg-cream-50/50 p-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[160px] flex-1 sm:max-w-[200px]">
            <label htmlFor="enquiry-status-filter" className={filterLabelClass}>
              Status
            </label>
            <select
              id="enquiry-status-filter"
              value={statusFilter}
              onChange={updateFilter("status")}
              className={adminFieldClass}
            >
              <option value="">All statuses</option>
              {ENQUIRY_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[160px] flex-1 sm:max-w-[180px]">
            <label htmlFor="enquiry-start-date" className={filterLabelClass}>
              From date
            </label>
            <input
              id="enquiry-start-date"
              type="date"
              value={startDate}
              onChange={updateFilter("startDate")}
              className={adminFieldClass}
            />
          </div>

          <div className="min-w-[160px] flex-1 sm:max-w-[180px]">
            <label htmlFor="enquiry-end-date" className={filterLabelClass}>
              To date
            </label>
            <input
              id="enquiry-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={updateFilter("endDate")}
              className={adminFieldClass}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={`${adminSecondaryButtonClass} self-end`}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {error && <AdminAlert message={error} onDismiss={onDismissError} />}

      {loading ? (
        <AdminSpinner label="Loading enquiries..." />
      ) : enquiries.length === 0 ? (
        <AdminEmptyState
          title={
            hasActiveFilters
              ? "No enquiries match these filters"
              : "No enquiries yet"
          }
          description={
            hasActiveFilters
              ? "Try adjusting the status or date range."
              : "Bulk enquiry submissions from the website will appear here."
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-maroon-200/60 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[960px] w-full border-collapse">
                <thead className="border-b border-maroon-100 bg-cream-50/80">
                  <tr>
                    <th className={thClass}>Date</th>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Company</th>
                    <th className={thClass}>Contact</th>
                    <th className={thClass}>Country</th>
                    <th className={thClass}>Product</th>
                    <th className={thClass}>Quantity</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maroon-100/80">
                  {enquiries.map((enquiry) => (
                    <tr
                      key={enquiry._id}
                      className="transition-colors hover:bg-cream-50/50"
                    >
                      <td className={`${tdClass} whitespace-nowrap text-xs text-maroon-700`}>
                        {formatEnquiryDate(enquiry.createdAt)}
                      </td>
                      <td className={`${tdClass} font-medium`}>{enquiry.name}</td>
                      <td className={tdClass}>{enquiry.companyName}</td>
                      <td className={tdClass}>
                        <div className="space-y-1 text-xs">
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="block text-maroon-800 underline-offset-2 hover:underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {enquiry.email}
                          </a>
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="block text-maroon-600 underline-offset-2 hover:underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {enquiry.phone}
                          </a>
                        </div>
                      </td>
                      <td className={tdClass}>{enquiry.country}</td>
                      <td className={tdClass}>{getProductSummary(enquiry.products)}</td>
                      <td className={tdClass}>{getQuantitySummary(enquiry.products)}</td>
                      <td className={tdClass}>
                        <EnquiryStatusBadge status={enquiry.status} />
                      </td>
                      <td className={tdClass}>
                        <button
                          type="button"
                          onClick={() => openDrawer(enquiry)}
                          className="cursor-pointer font-sans text-[11px] font-semibold tracking-[0.1em] text-maroon-800 uppercase underline-offset-2 hover:text-maroon-950 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {loadMore.hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={loadingMore}
                className={adminSecondaryButtonClass}
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}

      <EnquiryDetailDrawer
        enquiry={selectedEnquiry}
        open={drawerOpen}
        saving={saving}
        onClose={closeDrawer}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EnquiriesTable;
