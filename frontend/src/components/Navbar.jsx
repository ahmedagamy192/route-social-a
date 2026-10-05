// Navbar.jsx

import { useState } from "react";
import { Avatar } from "@heroui/react";
import { NavLink, useNavigate } from "react-router";
import {
  Home,
  User,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "../Layout/AuthLayout/Logout";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-white text-blue-600 shadow-sm"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="relative mx-auto flex h-22 max-w-384 items-center justify-between">
        {/* logo*/}
        <button
          type="button"
          className="flex min-w-0 items-center gap-3 text-left focus:outline-none"
          onClick={() => navigate("/home")}
          aria-label="Route Posts home"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#062f91] text-[10px] font-black tracking-tight text-white">
            ROUTE
          </span>
          <span className="whitespace-nowrap text-lg font-extrabold text-slate-900 md:text-xl">
            Route Posts
          </span>
        </button>

        
        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-[20px] border border-slate-200 bg-slate-50 p-1.5 md:flex"
        >
          {/* end: الرابط يصبح نشطاً فقط إذا كان المسار مطابقاً تماماً */}
          <NavLink to="/home" end className={navLinkClass}>
            <Home size={22} strokeWidth={2} />
            Feed
          </NavLink>
          <NavLink to="/home/profile" className={navLinkClass}>
            <User size={22} strokeWidth={2} />
            Profile
          </NavLink>
          <NavLink to="/home/notifications" className={navLinkClass}>
            <MessageCircle size={22} strokeWidth={2} />
            Notifications
          </NavLink>
        </nav>

        {/* drope menu*/}
        <div className="relative hidden items-center md:flex">
          <button
            type="button"
            className="flex h-14.5 items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-3 transition-colors hover:bg-slate-200 focus:outline-none"
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
          >
            <Avatar
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              name="Ashley Smith"
            />
            <span className="max-w-36 truncate text-sm font-medium text-slate-800">
              Ashley Smith
            </span>
            <Menu size={19} className="text-slate-500" />
          </button>

          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setProfileMenuOpen(false)}
              />
              <div
                id="account-menu"
                role="menu"
                aria-label="Profile actions"
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/home/profile");
                  }}
                  className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-slate-700 hover:bg-slate-50"
                >
                  <User size={18} /> Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate("/home/settings");
                  }}
                  className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-slate-700 hover:bg-slate-50"
                >
                  <Settings size={18} /> Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="mt-1 flex h-11 w-full items-center gap-3 rounded-lg border-t border-slate-200 px-3 pt-2 text-left text-red-600 hover:bg-red-50"
                >
                  
                   <LogoutButton/>
                </button>
              </div>
            </>
          )}
        </div>

        {/* زر قائمة الموبايل */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            className="rounded-xl bg-slate-100 p-2 text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex max-w-384 flex-col gap-1 border-t border-slate-100 py-3 md:hidden"
        >
          <NavLink
            to="/home"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Home size={19} /> Feed
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <User size={19} /> Profile
          </NavLink>
          <NavLink
            to="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <MessageCircle size={19} /> Notifications
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Settings size={19} /> Settings
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut size={19} /> <LogoutButton/>
          </button>
        </nav>
      )}
    </header>
  );
}

