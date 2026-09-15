import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Siren, Hospital, Contact, Droplet, Inbox, ArrowUpRight } from "lucide-react";
import { userApi } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PageLoader, EmptyState } from "../components/ui.jsx";
import { formatDate, timeAgo } from "../utils/format.js";
import { LEVEL_STYLE, STATUS_STYLE } from "../utils/constants.js";

const actions = [
  { to: "/donors", Icon: Search, title: "Find a blood donor", body: "Search by group, city and availability." },
  { to: "/request-blood", Icon: Siren, title: "Request blood", body: "Alert every compatible donor nearby." },
  { to: "/hospitals", Icon: Hospital, title: "Find a hospital", body: "Emergency wards and blood banks." },
  { to: "/contacts", Icon: Contact, title: "Emergency contacts", body: "Keep key numbers in one place." },
];

const Stat = ({ label, value, tone = "" }) => (
  <div className="card p-5">
    <p className="text-sm text-ink-muted">{label}</p>
    <p className={`mt-2 font-display text-3xl ${tone}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const { user, donorProfile } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    userApi.dashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <EmptyState icon={Inbox} title="Couldn't load your dashboard" description={error} />
      </div>
    );
  }
  if (!data) return <PageLoader label="Loading your dashboard" />;

  const { stats, recentRequests } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px]">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-ink-muted">
            {stats.activeRequests > 0
              ? `You have ${stats.activeRequests} request${stats.activeRequests > 1 ? "s" : ""} in progress.`
              : "Nothing urgent on your account right now."}
          </p>
        </div>
        {user.role === "donor" && (
          <Link to="/donor/requests" className="btn-ghost">
            <Droplet size={16} /> Requests for my blood group
          </Link>
        )}
      </div>

      {/* Emergency call to action */}
      <Link
        to="/request-blood"
        className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-xl2 border border-urgent/25 bg-urgent-soft px-6 py-5 transition-colors hover:bg-urgent/10"
      >
        <div className="flex items-start gap-3">
          <Siren size={22} className="mt-0.5 shrink-0 text-urgent" />
          <div>
            <p className="text-lg text-urgent-deep">Need blood urgently?</p>
            <p className="mt-0.5 text-sm text-urgent-deep/75">
              Raise a request now — compatible donors in that city are notified immediately.
            </p>
          </div>
        </div>
        <span className="btn-urgent">Start a request</span>
      </Link>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ to, Icon, title, body }) => (
          <Link key={to} to={to} className="card group flex flex-col p-5 transition-colors hover:border-line-strong">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-paper-sunken text-ink-soft">
              <Icon size={18} />
            </span>
            <h2 className="mt-4 flex items-center gap-1.5 text-base font-medium">
              {title} <ArrowUpRight size={15} className="text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{body}</p>
          </Link>
        ))}
      </div>

      {/* Numbers */}
      <h2 className="mt-12 text-xl">Your activity</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active requests" value={stats.activeRequests} tone={stats.activeRequests ? "text-urgent" : ""} />
        <Stat label="Completed requests" value={stats.completedRequests} />
        <Stat label="Saved contacts" value={stats.savedContacts} />
        <div className="card p-5">
          <p className="text-sm text-ink-muted">Donor status</p>
          <p className="mt-2 font-display text-2xl">{stats.donorStatus}</p>
          {donorProfile ? (
            <p className="mt-1 text-[13px] text-ink-muted">
              {stats.donorEligible ? "Eligible to donate today" : `Next eligible ${formatDate(donorProfile.nextEligibleDate)}`}
            </p>
          ) : (
            <Link to="/become-donor" className="mt-1 inline-block text-[13px] font-medium text-ink underline underline-offset-4">
              Register as a donor
            </Link>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-12 flex items-end justify-between">
        <h2 className="text-xl">Recent requests</h2>
        <Link to="/requests" className="text-sm text-ink-muted hover:text-ink">See all</Link>
      </div>

      {recentRequests.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={Inbox}
            title="No requests yet"
            description="When you raise a blood request it will show up here with its live status."
            action={<Link to="/request-blood" className="btn-primary mt-1">Raise a request</Link>}
          />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl2 border border-line bg-white">
          {recentRequests.map((r) => (
            <li key={r._id}>
              <Link to={`/requests/${r._id}`} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-paper">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-urgent-soft font-display text-sm font-semibold text-urgent">
                  {r.bloodGroup}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.patientName}</p>
                  <p className="truncate text-sm text-ink-muted">
                    {r.hospitalName} · {r.unitsRequired} unit{r.unitsRequired > 1 ? "s" : ""} · {timeAgo(r.createdAt)}
                  </p>
                </div>
                <span className={`chip ${LEVEL_STYLE[r.emergencyLevel]}`}>{r.emergencyLevel}</span>
                <span className={`chip ${STATUS_STYLE[r.status]}`}>{r.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
