import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Search, Trash2, X } from "lucide-react";
import { adminApi } from "../../api/endpoints.js";
import { useToast } from "../../context/ToastContext.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { Input, Select, Spinner, Pagination, EmptyState } from "../../components/ui.jsx";
import { formatDate } from "../../utils/format.js";

const AdminDonors = () => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [verified, setVerified] = useState("");
  const [data, setData] = useState({ donors: [], pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        setData(await adminApi.donors({ ...(search && { search }), ...(verified !== "" && { verified }), page, limit: 15 }));
      } finally {
        setLoading(false);
      }
    },
    [search, verified]
  );

  useEffect(() => {
    const id = setTimeout(() => load(1), 300);
    return () => clearTimeout(id);
  }, [load]);

  const toggleVerify = async (donor) => {
    try {
      await adminApi.verifyDonor(donor._id, !donor.verified);
      toast.success(donor.verified ? "Verification removed" : "Donor verified");
      await load(data.page);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await adminApi.removeDonor(confirm._id);
      toast.success("Donor record removed");
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
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or city" className="pl-9" />
        </div>
        <Select value={verified} onChange={(e) => setVerified(e.target.value)} className="w-auto">
          <option value="">All donors</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-ink-muted"><Spinner size={22} /></div>
      ) : data.donors.length === 0 ? (
        <EmptyState icon={Search} title="No donors match" description="Try a different name, city or verification state." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="w-full">
              <thead className="bg-paper">
                <tr>
                  <th className="th">Donor</th>
                  <th className="th">Group</th>
                  <th className="th">City</th>
                  <th className="th">Availability</th>
                  <th className="th">Last donation</th>
                  <th className="th">Donations</th>
                  <th className="th">Verified</th>
                  <th className="th sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.donors.map((d) => (
                  <tr key={d._id}>
                    <td className="td">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-[13px] text-ink-muted">{d.userId?.email}</p>
                    </td>
                    <td className="td font-display font-semibold text-urgent">{d.bloodGroup}</td>
                    <td className="td text-ink-muted">{d.city}</td>
                    <td className="td">{d.availability}</td>
                    <td className="td text-ink-muted">{formatDate(d.lastDonationDate)}</td>
                    <td className="td">{d.donationCount}</td>
                    <td className="td">
                      {d.verified ? (
                        <span className="chip bg-vital-soft text-vital"><BadgeCheck size={13} /> Verified</span>
                      ) : (
                        <span className="chip bg-paper-sunken text-ink-muted">Not verified</span>
                      )}
                    </td>
                    <td className="td">
                      <div className="flex gap-1">
                        <button onClick={() => toggleVerify(d)} className="btn-quiet btn-sm" aria-label={d.verified ? "Remove verification" : "Verify donor"}>
                          {d.verified ? <X size={15} /> : <BadgeCheck size={15} />}
                        </button>
                        <button onClick={() => setConfirm(d)} className="btn-quiet btn-sm text-urgent" aria-label={`Remove ${d.name}`}>
                          <Trash2 size={15} />
                        </button>
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
        title="Remove this donor record?"
        confirmLabel="Remove donor"
        message={`${confirm?.name} will stop appearing in donor search and their account reverts to a regular user.`}
      />
    </>
  );
};

export default AdminDonors;
