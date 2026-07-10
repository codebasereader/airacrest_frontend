import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Folder01Icon,
  Mail01Icon,
  PackageIcon,
} from "@hugeicons/core-free-icons";

const ICON_MAP = {
  categories: Folder01Icon,
  products: PackageIcon,
  enquiries: Mail01Icon,
  blogs: BookOpen01Icon,
};

const AdminNavIcon = ({ iconKey, size = 20, className = "" }) => {
  const icon = ICON_MAP[iconKey];

  if (!icon) return null;

  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    />
  );
};

export default AdminNavIcon;
