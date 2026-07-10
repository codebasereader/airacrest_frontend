import React from "react";
import { NavLink } from "react-router-dom";
import { ADMIN_NAV_ITEMS } from "../constants/navItems";
import AdminNavIcon from "./AdminNavIcon";

const bottomNavLinkClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center justify-center gap-1 py-2 font-sans text-[10px] font-semibold tracking-[0.08em] no-underline uppercase transition-colors duration-200 ${
    isActive ? "text-maroon-900" : "text-maroon-500"
  }`;

const AdminBottomNav = () => {
  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-maroon-200/60 bg-cream-50/95 backdrop-blur-md lg:hidden"
      aria-label="Admin mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={bottomNavLinkClass}
            end
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-maroon-800 text-gold-400" : "text-maroon-600"
                  }`}
                >
                  <AdminNavIcon iconKey={item.iconKey} size={18} />
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AdminBottomNav;
