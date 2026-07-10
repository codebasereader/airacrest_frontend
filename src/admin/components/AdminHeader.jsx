import React from "react";
import { NavLink } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectAuthUser } from "../../store/slices/authSlice";
import { ADMIN_NAV_ITEMS } from "../constants/navItems";
import AdminBrand from "./AdminBrand";
import AdminNavIcon from "./AdminNavIcon";

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-sm px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.14em] no-underline uppercase transition-colors duration-200 ${
    isActive
      ? "bg-maroon-800 text-gold-400"
      : "text-maroon-800 hover:bg-maroon-50 hover:text-maroon-950"
  }`;

const AdminHeader = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-40 hidden border-b border-maroon-200/50 bg-cream-50/95 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-6 xl:px-10">
        <AdminBrand />

        <nav
          className="flex items-center gap-1"
          aria-label="Admin primary navigation"
        >
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
              end
            >
              <AdminNavIcon iconKey={item.iconKey} size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user?.name && (
            <p className="hidden max-w-[180px] truncate font-sans text-xs text-maroon-700 xl:block">
              {user.name}
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-maroon-300/60 bg-transparent px-3 py-2 font-sans text-[10px] font-semibold tracking-[0.14em] text-maroon-800 uppercase transition-colors hover:border-maroon-500 hover:bg-maroon-50"
          >
            <HugeiconsIcon
              icon={Logout01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.75}
            />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
