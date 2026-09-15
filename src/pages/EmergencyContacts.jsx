import { useEffect, useState } from "react";
import { Plus, Phone, Mail, Pencil, Trash2, Contact as ContactIcon } from "lucide-react";
import { contactApi } from "../api/endpoints.js";
import { useToast } from "../context/ToastContext.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { EmptyState, Field, Input, Select, PageLoader, SectionHeading, Spinner } from "../components/ui.jsx";
import { RELATIONSHIPS } from "../utils/constants.js";

const empty = { name: "", relationship: "Parent", phone: "", email: "" };

const EmergencyContacts = () => {
  const toast = useToast();
  const [contacts, setContacts] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | contact
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = () => contactApi.list().then(({ contacts: list }) => setContacts(list));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setErrors({}); setEditing("new"); };
  const openEdit = (c) => {
    setForm({ name: c.name, relationship: c.relationship, phone: c.phone, email: c.email || "" });
    setErrors({});
    setEditing(c);
  };

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter the contact's name";
    if (!/^[0-9+\-\s()]{10,15}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      if (editing === "new") await contactApi.create(form);
      else await contactApi.update(editing._id, form);
      toast.success(editing === "new" ? "Contact saved" : "Contact updated");
      setEditing(null);
      await load();
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
      await contactApi.remove(confirm._id);
      toast.success("Contact deleted");
      setConfirm(null);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!contacts) return <PageLoader label="Loading your contacts" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Emergency contacts"
        description="The numbers you'd want at hand at 3am, saved to your account."
        action={<button onClick={openNew} className="btn-primary"><Plus size={16} /> Add contact</button>}
      />

      {contacts.length === 0 ? (
        <EmptyState
          icon={ContactIcon}
          title="No contacts saved"
          description="Add the people you'd call first — family, your guardian, or your doctor."
          action={<button onClick={openNew} className="btn-primary mt-1"><Plus size={16} /> Add your first contact</button>}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {contacts.map((c) => (
            <li key={c._id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg leading-tight">{c.name}</h2>
                  <p className="mt-0.5 text-sm text-ink-muted">{c.relationship}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="btn-quiet p-2" aria-label={`Edit ${c.name}`}><Pencil size={15} /></button>
                  <button onClick={() => setConfirm(c)} className="btn-quiet p-2 text-urgent" aria-label={`Delete ${c.name}`}><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <a href={`tel:${c.phone}`} className="flex items-center gap-2 hover:underline"><Phone size={15} className="text-ink-muted" /> {c.phone}</a>
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 break-all hover:underline">
                    <Mail size={15} className="shrink-0 text-ink-muted" /> {c.email}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => !busy && setEditing(null)}
        title={editing === "new" ? "Add emergency contact" : "Edit contact"}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)} disabled={busy}>Discard</button>
            <button className="btn-primary" onClick={save} disabled={busy}>
              {busy && <Spinner size={15} />} Save contact
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Name" error={errors.name} required>
            <Input name="name" value={form.name} onChange={change} error={errors.name} placeholder="Sunita Sharma" />
          </Field>
          <Field label="Relationship">
            <Select name="relationship" value={form.relationship} onChange={change}>
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </Field>
          <Field label="Phone number" error={errors.phone} required>
            <Input name="phone" value={form.phone} onChange={change} error={errors.phone} inputMode="tel" placeholder="9876543210" />
          </Field>
          <Field label="Email" error={errors.email} hint="Optional">
            <Input name="email" type="email" value={form.email} onChange={change} error={errors.email} placeholder="name@example.com" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={busy}
        danger
        onClose={() => !busy && setConfirm(null)}
        onConfirm={remove}
        title="Delete this contact?"
        confirmLabel="Delete contact"
        message={`${confirm?.name} will be removed from your emergency contacts.`}
      />
    </div>
  );
};

export default EmergencyContacts;
