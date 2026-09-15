import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell,
} from "recharts";
import { adminApi } from "../../api/endpoints.js";
import { PageLoader, EmptyState } from "../../components/ui.jsx";
import { BarChart3 } from "lucide-react";

const Stat = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-sm text-ink-muted">{label}</p>
    <p className="mt-2 font-display text-3xl">{value.toLocaleString("en-IN")}</p>
  </div>
);

const levelColor = { Low: "#C3D0D0", Medium: "#B8730E", High: "#C21B2E", Critical: "#8E1120" };

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.analytics().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <EmptyState icon={BarChart3} title="Couldn't load analytics" description={error} />;
  if (!data) return <PageLoader label="Crunching the numbers" />;

  const { totals, donorsByBloodGroup, requestsPerDay, requestsByLevel, requestsByStatus } = data;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total users" value={totals.totalUsers} />
        <Stat label="Donors" value={totals.totalDonors} />
        <Stat label="Hospitals" value={totals.totalHospitals} />
        <Stat label="Active requests" value={totals.activeRequests} />
        <Stat label="Completed" value={totals.completedRequests} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-lg">Donors by blood group</h2>
          <p className="mt-1 text-sm text-ink-muted">Where the register is thin is where shortages start.</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donorsByBloodGroup}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEFEF" vertical={false} />
                <XAxis dataKey="bloodGroup" tick={{ fontSize: 12, fill: "#5C6B70" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#5C6B70" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "#F5F7F7" }} contentStyle={{ borderRadius: 12, border: "1px solid #DCE4E4", fontSize: 13 }} />
                <Bar dataKey="count" fill="#0E3339" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg">Requests raised, last 14 days</h2>
          <p className="mt-1 text-sm text-ink-muted">Spikes usually track accidents and festival weekends.</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={requestsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEFEF" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5C6B70" }} axisLine={false} tickLine={false}
                  tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 12, fill: "#5C6B70" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #DCE4E4", fontSize: 13 }} />
                <Line type="monotone" dataKey="count" stroke="#C21B2E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg">Requests by urgency</h2>
          <div className="mt-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByLevel} layout="vertical">
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis type="category" dataKey="level" width={70} tick={{ fontSize: 12, fill: "#5C6B70" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#F5F7F7" }} contentStyle={{ borderRadius: 12, border: "1px solid #DCE4E4", fontSize: 13 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {requestsByLevel.map((r) => <Cell key={r.level} fill={levelColor[r.level] || "#0E3339"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg">Requests by status</h2>
          <ul className="mt-5 divide-y divide-line">
            {requestsByStatus.map((s) => (
              <li key={s.status} className="flex items-center justify-between py-3">
                <span className="text-sm">{s.status}</span>
                <span className="font-display text-xl">{s.count}</span>
              </li>
            ))}
            {requestsByStatus.length === 0 && <li className="py-6 text-center text-sm text-ink-muted">No requests yet.</li>}
          </ul>
        </section>
      </div>
    </>
  );
};

export default AdminOverview;
