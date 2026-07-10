import React from "react";
import { Outlet } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectAuthUser } from "../../store/slices/authSlice";
import AdminBottomNav from "../components/AdminBottomNav";
import AdminBrand from "../components/AdminBrand";
import AdminHeader from "../components/AdminHeader";

const AdminMobileTopBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  return (
    <header className="sticky top-0 z-40 border-b border-maroon-200/50 bg-cream-50/95 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <AdminBrand />
        <div className="flex min-w-0 items-center gap-2">
          {user?.name && (
            <span className="truncate font-sans text-xs text-maroon-700">
              {user.name}
            </span>
          )}
          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-maroon-200/70 bg-white text-maroon-700 transition-colors hover:border-maroon-400 hover:text-maroon-900"
            aria-label="Logout"
          >
            <HugeiconsIcon
              icon={Logout01Icon}
              size={18}
              color="currentColor"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-cream-100">
      <AdminHeader />
      <AdminMobileTopBar />

      <main className="mx-auto max-w-[1400px] px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
        <Outlet />
      </main>

      <AdminBottomNav />
    </div>
  );
};

export default AdminLayout;
