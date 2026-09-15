import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { hospitalApi } from "../../api/endpoints.js";
import { useToast } from "../../context/ToastContext.jsx";
import Modal from "../../components/Modal.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { EmptyState, Field, Input, Spinner, Pagination, Textarea } from "../../components/ui.jsx";

const empty = {
  name: "", address: "", city: "", phone: "", email: "",
  emergencyAvailable: false, bloodBankAvailable: false, facilities: "", operatingHours: "24 x 7",
};

const AdminHospitals = () => {
  const toast = useToast();
  const [data, setData] = useState({ hospitals: [], pages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      setData(await hospitalApi.search({ page, limit: 15 }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1); }, [load]);

  const openNew = () => { setForm(empty); setErrors({}); setEditing("new"); };
  const openEdit = (h) => {
    setForm({ ...h, facilities: (h.facilities || []).join(", "), email: h.email || "" });
    setErrors({});
    setEditing(h);
  };

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const save = async () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter the hospital name";
    if (!form.address.trim()) next.address = "Enter the address";
    if (!form.city.trim()) next.city = "Enter the city";
    if (!/^[0-9+\-\s()]{10,15}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      ...form,
      facilities: form.facilities.split(",").map((s) => s.trim()).filter(Boolean),
    };
    setBusy(true);
    try {
      if (editing === "new") await hospitalApi.create(payload);
      else await hospitalApi.update(editing._id, payload);
      toast.success(editing === "new" ? "Hospital added" : "Hospital updated");
      setEditing(null);
      await load(data.page);
    } catch (e) {
      setErrors(e.errors || {});
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await hospitalApi.remove(confirm._id);
      toast.success("Hospital removed");
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
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-muted">{data.total} hospital{data.total === 1 ? "" : "s"} listed</p>
        <button onClick={openNew} className="btn-primary btn-sm"><Plus size={15} /> Add hospital</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-ink-muted"><Spinner size={22} /></div>
      ) : data.hospitals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hospitals listed"
          description="Add the hospitals in your area so patients can find their blood banks."
          action={<button onClick={openNew} className="btn-primary mt-1"><Plus size={15} /> Add hospital</button>}
        />
      ) : (
        <>
          <div className="table-wrap">
            <table className="w-full">
              <thead className="bg-paper">
                <tr>
                  <th className="th">Hospital</th>
                  <th className="th">City</th>
                  <th className="th">Phone</th>
                  <th className="th">Emergency</th>
                  <th className="th">Blood bank</th>
                  <th className="th">Hours</th>
                  <th className="th sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.hospitals.map((h) => (
                  <tr key={h._id}>
                    <td className="td">
                      <p className="font-medium">{h.name}</p>
                      <p className="max-w-xs truncate text-[13px] text-ink-muted">{h.address}</p>
                    </td>
                    <td className="td text-ink-muted">{h.city}</td>
                    <td className="td text-ink-muted">{h.phone}</td>
                    <td className="td">{h.emergencyAvailable ? "Yes" : "No"}</td>
                    <td className="td">{h.bloodBankAvailable ? "Yes" : "No"}</td>
                    <td className="td text-ink-muted">{h.operatingHours}</td>
                    <td className="td">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(h)} className="btn-quiet btn-sm" aria-label={`Edit ${h.name}`}><Pencil size={15} /></button>
                        <button onClick={() => setConfirm(h)} className="btn-quiet btn-sm text-urgent" aria-label={`Delete ${h.name}`}><Trash2 size={15} /></button>
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

      <Modal
        open={Boolean(editing)}
        onClose={() => !busy && setEditing(null)}
        title={editing === "new" ? "Add hospital" : "Edit hospital"}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)} disabled={busy}>Discard</button>
            <button className="btn-primary" onClick={save} disabled={busy}>{busy && <Spinner size={15} />} Save hospital</button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Hospital name" error={errors.name} required>
            <Input name="name" value={form.name} onChange={change} error={errors.name} />
          </Field>
          <Field label="Address" error={errors.address} required>
            <Textarea name="address" rows={2} value={form.address} onChange={change} error={errors.address} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" error={errors.city} required>
              <Input name="city" value={form.city} onChange={change} error={errors.city} />
            </Field>
            <Field label="Phone" error={errors.phone} required>
              <Input name="phone" value={form.phone} onChange={change} error={errors.phone} inputMode="tel" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" error={errors.email}>
              <Input name="email" type="email" value={form.email} onChange={change} error={errors.email} />
            </Field>
            <Field label="Operating hours">
              <Input name="operatingHours" value={form.operatingHours} onChange={change} placeholder="24 x 7" />
            </Field>
          </div>
          <Field label="Facilities" hint="Separate with commas, e.g. Emergency, ICU, Blood Bank">
            <Input name="facilities" value={form.facilities} onChange={change} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm">
              <input type="checkbox" name="emergencyAvailable" checked={form.emergencyAvailable} onChange={change} className="h-4 w-4 accent-[#C21B2E]" />
              Emergency services
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm">
              <input type="checkbox" name="bloodBankAvailable" checked={form.bloodBankAvailable} onChange={change} className="h-4 w-4 accent-[#1F7A66]" />
              Blood bank on site
            </label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={busy}
        danger
        onClose={() => !busy && setConfirm(null)}
        onConfirm={remove}
        title="Delete this hospital?"
        confirmLabel="Delete hospital"
        message={`${confirm?.name} will be removed from the public directory.`}
      />
    </>
  );
};

export default AdminHospitals;
