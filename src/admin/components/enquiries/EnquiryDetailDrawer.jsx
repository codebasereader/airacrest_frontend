import React, { useEffect, useState } from "react";
import {
  adminDangerButtonClass,
  adminFieldClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "../../constants/formStyles";
import { ENQUIRY_STATUSES } from "../../constants/enquiryStatuses";
import {
  formatEnquiryDate,
  getProductName,
} from "../../utils/enquiryFormatters";
import AdminDrawer from "../shared/AdminDrawer";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import EnquiryStatusBadge from "./EnquiryStatusBadge";

const DetailRow = ({ label, children }) => (
  <div className="border-b border-maroon-100/80 py-3 last:border-b-0">
    <dt className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
      {label}
    </dt>
    <dd className="mt-1 font-sans text-sm text-maroon-900">{children}</dd>
  </div>
);

const EnquiryDetailDrawer = ({
  enquiry,
  open,
  saving,
  onClose,
  onSave,
  onDelete,
}) => {
  const [status, setStatus] = useState("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!enquiry) return;
    setStatus(enquiry.status || "pending");
    setAdminNotes(enquiry.adminNotes || "");
    setDeleteConfirmOpen(false);
  }, [enquiry]);

  if (!enquiry) return null;

  const handleSave = async () => {
    await onSave(enquiry._id, {
      status,
      adminNotes: adminNotes.trim() || null,
    });
    onClose();
  };

  const handleConfirmDelete = async () => {
    await onDelete(enquiry._id);
    setDeleteConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <AdminDrawer
      open={open}
      onClose={onClose}
      size="lg"
      title={enquiry.name}
      description={`${enquiry.companyName} · ${formatEnquiryDate(enquiry.createdAt)}`}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <EnquiryStatusBadge status={enquiry.status} />
          <span className="font-sans text-xs text-maroon-600">
            Submitted {formatEnquiryDate(enquiry.createdAt)}
          </span>
        </div>

        <dl className="rounded-xl border border-maroon-100 bg-white px-4">
          <DetailRow label="Company">{enquiry.companyName}</DetailRow>
          <DetailRow label="Email">
            <a
              href={`mailto:${enquiry.email}`}
              className="text-maroon-800 underline-offset-2 hover:underline"
            >
              {enquiry.email}
            </a>
          </DetailRow>
          <DetailRow label="Phone / WhatsApp">
            <a
              href={`tel:${enquiry.phone}`}
              className="text-maroon-800 underline-offset-2 hover:underline"
            >
              {enquiry.phone}
            </a>
          </DetailRow>
          <DetailRow label="Country">{enquiry.country}</DetailRow>
          {enquiry.destinationPort && (
            <DetailRow label="Destination Port">
              {enquiry.destinationPort}
            </DetailRow>
          )}
        </dl>

        <div>
          <h3 className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
            Products requested
          </h3>
          <ul className="mt-2 space-y-2">
            {(enquiry.products || []).map((line, index) => (
              <li
                key={`${line.product?._id || index}-${index}`}
                className="rounded-lg border border-maroon-100 bg-cream-50/60 px-3 py-2.5"
              >
                <p className="font-sans text-sm font-semibold text-maroon-900">
                  {getProductName(line)}
                </p>
                <p className="mt-1 font-sans text-xs text-maroon-700">
                  Qty: {line.estimatedQuantity || "—"}
                  {line.packagingPreference
                    ? ` · ${line.packagingPreference}`
                    : ""}
                </p>
                {line.note && (
                  <p className="mt-2 font-sans text-xs leading-relaxed text-maroon-600">
                    <span className="font-semibold text-maroon-700">Note:</span>{" "}
                    {line.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {enquiry.message && (
          <div>
            <h3 className="font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-500 uppercase">
              Message
            </h3>
            <p className="mt-2 rounded-lg border border-maroon-100 bg-white px-3 py-2.5 font-sans text-sm leading-relaxed text-maroon-800">
              {enquiry.message}
            </p>
          </div>
        )}

        <div className="space-y-4 border-t border-maroon-100 pt-5">
          <div>
            <label htmlFor="enquiry-status" className={adminLabelClass}>
              Status
            </label>
            <select
              id="enquiry-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={saving}
              className={adminFieldClass}
            >
              {ENQUIRY_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="enquiry-notes" className={adminLabelClass}>
              Admin notes
            </label>
            <textarea
              id="enquiry-notes"
              rows={3}
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              disabled={saving}
              placeholder="Internal notes for your team…"
              className={`${adminFieldClass} resize-none`}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-maroon-100 pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={saving}
            className={adminDangerButtonClass}
          >
            Delete
          </button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={adminSecondaryButtonClass}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={adminPrimaryButtonClass}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </AdminDrawer>

      <DeleteConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={`enquiry from ${enquiry.name}`}
        message={`Are you sure you want to delete the enquiry from "${enquiry.name}" at ${enquiry.companyName}?`}
        confirmMessage={`This will permanently delete the enquiry from "${enquiry.name}" at ${enquiry.companyName}. Please confirm one more time to proceed.`}
        deleting={saving}
      />
    </>
  );
};

export default EnquiryDetailDrawer;
