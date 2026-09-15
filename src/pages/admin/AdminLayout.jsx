import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Users, Droplet, Siren, Building2 } from "lucide-react";

const tabs = [
  { to: "/admin", label: "Overview", Icon: BarChart3, end: true },
  { to: "/admin/users", label: "Users", Icon: Users },
  { to: "/admin/donors", label: "Donors", Icon: Droplet },
  { to: "/admin/requests", label: "Requests", Icon: Siren },
  { to: "/admin/hospitals", label: "Hospitals", Icon: Building2 },
];

const AdminLayout = () => (
  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <h1 className="text-[30px]">Administration</h1>
    <p className="mt-1 text-ink-muted">Manage accounts, verify donors and keep requests clean.</p>

    <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-line pb-px">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm transition-colors ${
              isActive ? "border-ink font-medium text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`
          }
        >
          <Icon size={16} /> {label}
        </NavLink>
      ))}
    </nav>

    <div className="pt-8">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
