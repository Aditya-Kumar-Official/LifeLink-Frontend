import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, User, Shield } from "lucide-react";
import Logo from "./Logo.jsx";
import NotificationBell from "./NotificationBell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { initials } from "../utils/format.js";

const publicLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/donors", label: "Find donor" },
  { to: "/hospitals", label: "Hospitals" },
];

const Navbar = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [location.pathname]);

  const signOut = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm transition-colors ${
      isActive ? "text-ink font-medium" : "text-ink-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center lg:flex">
          {publicLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <>
              <NavLink to="/requests" className={linkClass}>My requests</NavLink>
              <NavLink to="/contacts" className={linkClass}>Contacts</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/request-blood" className="btn-urgent btn-sm hidden sm:inline-flex">
            Request blood
          </Link>

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setMenu((v) => !v)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white"
                  aria-label="Account menu"
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    initials(user.name)
                  )}
                </button>
                {menu && (
                  <div
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl2 border border-line bg-white py-1 shadow-lift"
                    onMouseLeave={() => setMenu(false)}
                  >
                    <div className="border-b border-line px-4 py-3">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-ink-muted">{user.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-paper">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-paper">
                      <User size={16} /> Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-paper">
                        <Shield size={16} /> Admin
                      </Link>
                    )}
                    <button onClick={signOut} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-urgent hover:bg-urgent-soft">
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/login" className="btn-quiet btn-sm">Sign in</Link>
              <Link to="/register" className="btn-primary btn-sm">Create account</Link>
            </div>
          )}

          <button onClick={() => setOpen((v) => !v)} className="btn-quiet p-2 lg:hidden" aria-label="Menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            {publicLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="block rounded-md px-2 py-2.5 text-[15px] hover:bg-paper">
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="block rounded-md px-2 py-2.5 text-[15px] hover:bg-paper">Dashboard</NavLink>
                <NavLink to="/requests" className="block rounded-md px-2 py-2.5 text-[15px] hover:bg-paper">My requests</NavLink>
                <NavLink to="/contacts" className="block rounded-md px-2 py-2.5 text-[15px] hover:bg-paper">Emergency contacts</NavLink>
                <NavLink to="/profile" className="block rounded-md px-2 py-2.5 text-[15px] hover:bg-paper">Profile</NavLink>
                {isAdmin && <NavLink to="/admin" className="block rounded-md px-2 py-2.5 text-[15px] hover:bg-paper">Admin</NavLink>}
                <button onClick={signOut} className="block w-full rounded-md px-2 py-2.5 text-left text-[15px] text-urgent hover:bg-urgent-soft">
                  Sign out
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-ghost">Sign in</Link>
                <Link to="/register" className="btn-primary">Create account</Link>
              </div>
            )}
            <Link to="/request-blood" className="btn-urgent mt-2 w-full sm:hidden">Request blood</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
