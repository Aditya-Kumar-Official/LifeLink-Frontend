import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink, Siren } from "lucide-react";
import { adminApi, requestApi } from "../../api/endpoints.js";
import { useToast } from "../../context/ToastContext.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { Select, Spinner, Pagination, EmptyState } from "../../components/ui.jsx";
import { BLOOD_GROUPS, EMERGENCY_LEVELS, LEVEL_STYLE, REQUEST_STATUS } from "../../utils/constants.js";
import { formatDate } from "../../utils/format.js";

const AdminRequests = () => {
  const toast = useToast();
  const [filters, setFilters] = useState({ status: "", bloodGroup: "", emergencyLevel: "" });
  const [data, setData] = useState({ requests: [], pages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        setData(await requestApi.all({ ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)), page, limit: 15 }));
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => { load(1); }, [load]);

  const change = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const setStatus = async (id, status) => {
    try {
      await requestApi.setStatus(id, status);
      toast.success(`Request marked ${status.toLowerCase()}`);
      await load(data.page);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await requestApi.remove(confirm._id);
      toast.success("Request deleted");
      setConfirm(null);
      await load(data.page);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-3">
        <Select name="status" value={filters.status} onChange={change} className="w-auto">
          <option value="">All statuses</option>
          {REQUEST_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select name="bloodGroup" value={filters.bloodGroup} onChange={change} className="w-auto">
          <option value="">All groups</option>
          {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </Select>
        <Select name="emergencyLevel" value={filters.emergencyLevel} onChange={change} className="w-auto">
          <option value="">All urgency levels</option>
          {EMERGENCY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-ink-muted"><Spinner size={22} /></div>
      ) : data.requests.length === 0 ? (
        <EmptyState icon={Siren} title="No requests match" description="Clear a filter to see more." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="w-full">
              <thead className="bg-paper">
                <tr>
                  <th className="th">Patient</th>
                  <th className="th">Group</th>
                  <th className="th">Units</th>
                  <th className="th">Hospital</th>
                  <th className="th">Urgency</th>
                  <th className="th">Needed by</th>
                  <th className="th">Status</th>
                  <th className="th sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.requests.map((r) => (
                  <tr key={r._id}>
                    <td className="td">
                      <p className="font-medium">{r.patientName}</p>
                      <p className="text-[13px] text-ink-muted">by {r.patientId?.name || "deleted user"}</p>
                    </td>
                    <td className="td font-display font-semibold text-urgent">{r.bloodGroup}</td>
                    <td className="td">{r.unitsRequired}</td>
                    <td className="td text-ink-muted">{r.hospitalName}</td>
                    <td className="td"><span className={`chip ${LEVEL_STYLE[r.emergencyLevel]}`}>{r.emergencyLevel}</span></td>
                    <td className="td text-ink-muted">{formatDate(r.requiredDate)}</td>
                    <td className="td">
                      <select
                        value={r.status}
                        onChange={(e) => setStatus(r._id, e.target.value)}
                        className="rounded-md border border-line bg-white px-2 py-1 text-[13px]"
                      >
                        {REQUEST_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="td">
                      <div className="flex gap-1">
                        <Link to={`/requests/${r._id}`} className="btn-quiet btn-sm" aria-label="Open request"><ExternalLink size={15} /></Link>
                        <button onClick={() => setConfirm(r)} className="btn-quiet btn-sm text-urgent" aria-label="Delete request"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={load} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={busy}
        danger
        onClose={() => !busy && setConfirm(null)}
        onConfirm={remove}
        title="Delete this request?"
        confirmLabel="Delete request"
        message={`The request for ${confirm?.patientName} and its donor responses will be removed permanently.`}
      />
    </>
  );
};

export default AdminRequests;
