import React from "react";
import { ENQUIRY_STATUS_STYLES, ENQUIRY_STATUSES } from "../../constants/enquiryStatuses";

const EnquiryStatusBadge = ({ status }) => {
  const label =
    ENQUIRY_STATUSES.find((item) => item.value === status)?.label || status;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wide uppercase ring-1 ${
        ENQUIRY_STATUS_STYLES[status] || ENQUIRY_STATUS_STYLES.pending
      }`}
    >
      {label}
    </span>
  );
};

export default EnquiryStatusBadge;
