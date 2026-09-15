import { useCallback, useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { adminApi } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { Input, Select, Spinner, Pagination, EmptyState } from "../../components/ui.jsx";
import { ROLES } from "../../utils/constants.js";
import { formatDate } from "../../utils/format.js";

const AdminUsers = () => {
  const { user: me } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [data, setData] = useState({ users: [], pages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        setData(await adminApi.users({ ...(search && { search }), ...(role && { role }), page, limit: 15 }));
      } finally {
        setLoading(false);
      }
    },
    [search, role]
  );

  useEffect(() => {
    const id = setTimeout(() => load(1), 300);
    return () => clearTimeout(id);
  }, [load]);

  const setUserRole = async (id, nextRole) => {
    try {
      await adminApi.setRole(id, nextRole);
      toast.success(`Role updated to ${nextRole}`);
      await load(data.page);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await adminApi.removeUser(confirm._id);
      toast.success("User deleted");
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
        <div className="relative flex-1 min-w-[15rem]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className="pl-9" />
        </div>
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="w-auto">
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-ink-muted"><Spinner size={22} /></div>
      ) : data.users.length === 0 ? (
        <EmptyState icon={Search} title="No users match" description="Try a different name, email or role." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="w-full">
              <thead className="bg-paper">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Email</th>
                  <th className="th">Phone</th>
                  <th className="th">Group</th>
                  <th className="th">City</th>
                  <th className="th">Role</th>
                  <th className="th">Joined</th>
                  <th className="th sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u._id}>
                    <td className="td font-medium">{u.name}</td>
                    <td className="td text-ink-muted">{u.email}</td>
                    <td className="td text-ink-muted">{u.phone}</td>
                    <td className="td">{u.bloodGroup || "—"}</td>
                    <td className="td text-ink-muted">{u.location || "—"}</td>
                    <td className="td">
                      <select
                        value={u.role}
                        disabled={u._id === me._id}
                        onChange={(e) => setUserRole(u._id, e.target.value)}
                        className="rounded-md border border-line bg-white px-2 py-1 text-[13px] disabled:opacity-50"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="td text-ink-muted">{formatDate(u.createdAt)}</td>
                    <td className="td">
                      <button
                        onClick={() => setConfirm(u)}
                        disabled={u._id === me._id}
                        className="btn-quiet btn-sm text-urgent disabled:opacity-40"
                        aria-label={`Delete ${u.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
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
        title="Delete this user?"
        confirmLabel="Delete user"
        message={`${confirm?.name}'s account, donor profile, requests and contacts will be removed. This cannot be undone.`}
      />
    </>
  );
};

export default AdminUsers;
