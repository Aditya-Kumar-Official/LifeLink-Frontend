import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, Save, CalendarClock, BadgeCheck } from "lucide-react";
import { donorApi } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field, Input, Select, Textarea, SectionHeading, Spinner, PageLoader } from "../components/ui.jsx";
import { AVAILABILITY, BLOOD_GROUPS } from "../utils/constants.js";
import { formatDate } from "../utils/format.js";

const BecomeDonor = () => {
  const { user, updateUser, refreshDonorProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: user?.name || "", bloodGroup: user?.bloodGroup || "", phone: user?.phone || "",
    city: user?.location || "", address: "", lastDonationDate: "", availability: "Available",
  });

  useEffect(() => {
    donorApi
      .mine()
      .then(({ donor }) => {
        if (donor) {
          setExisting(donor);
          setForm({
            name: donor.name, bloodGroup: donor.bloodGroup, phone: donor.phone, city: donor.city,
            address: donor.address || "",
            lastDonationDate: donor.lastDonationDate ? donor.lastDonationDate.split("T")[0] : "",
            availability: donor.availability,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!BLOOD_GROUPS.includes(form.bloodGroup)) next.bloodGroup = "Choose your blood group";
    if (!/^[0-9+\-\s()]{10,15}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    if (!form.city.trim()) next.city = "Enter the city you can donate in";
    if (form.lastDonationDate && new Date(form.lastDonationDate) > new Date()) {
      next.lastDonationDate = "That date is in the future";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const { donor } = await donorApi.register({ ...form, lastDonationDate: form.lastDonationDate || null });
      setExisting(donor);
      updateUser({ role: "donor", bloodGroup: donor.bloodGroup, location: donor.city });
      await refreshDonorProfile();
      toast.success(existing ? "Donor profile updated" : "You're registered as a donor");
      navigate("/donor/requests");
    } catch (err) {
      setErrors(err.errors || {});
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <PageLoader label="Loading your donor profile" />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <SectionHeading
        title={existing ? "Your donor profile" : "Register as a blood donor"}
        description="Only your name, group, city and availability are public. Your number is shown to signed-in users who need your group."
      />

      {existing && (
        <div className="card mb-6 flex flex-wrap items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-urgent-soft font-display text-lg font-semibold text-urgent">
            {existing.bloodGroup}
          </span>
          <div className="flex-1">
            <p className="flex items-center gap-2 font-medium">
              {existing.eligible ? "Eligible to donate today" : "Not eligible yet"}
              {existing.verified && <span className="chip bg-paper-sunken text-ink-soft"><BadgeCheck size={13} /> Verified</span>}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
              <CalendarClock size={14} />
              {existing.lastDonationDate
                ? `Last donated ${formatDate(existing.lastDonationDate)} · next eligible ${formatDate(existing.nextEligibleDate)}`
                : "No donation recorded yet"}
            </p>
          </div>
          <p className="text-sm text-ink-muted">{existing.donationCount} donation{existing.donationCount === 1 ? "" : "s"} logged</p>
        </div>
      )}

      <form onSubmit={submit} noValidate className="card space-y-5 p-6">
        <Field label="Full name" error={errors.name} required>
          <Input name="name" value={form.name} onChange={change} error={errors.name} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Blood group" error={errors.bloodGroup} required>
            <Select name="bloodGroup" value={form.bloodGroup} onChange={change} error={errors.bloodGroup}>
              <option value="">Select a group</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Phone number" error={errors.phone} required>
            <Input name="phone" value={form.phone} onChange={change} error={errors.phone} inputMode="tel" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="City" error={errors.city} required>
            <Input name="city" value={form.city} onChange={change} error={errors.city} placeholder="Kolkata" />
          </Field>
          <Field label="Availability" required>
            <Select name="availability" value={form.availability} onChange={change}>
              {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
            </Select>
          </Field>
        </div>

        <Field label="Address" hint="Kept private — only used to suggest nearby requests.">
          <Textarea name="address" rows={2} value={form.address} onChange={change} placeholder="Area, landmark, PIN" />
        </Field>

        <Field
          label="Last donation date"
          error={errors.lastDonationDate}
          hint="Leave blank if you've never donated. We use this to apply the 90-day gap."
        >
          <Input type="date" name="lastDonationDate" value={form.lastDonationDate} onChange={change}
            error={errors.lastDonationDate} max={new Date().toISOString().split("T")[0]} />
        </Field>

        <button type="submit" disabled={busy} className="btn-primary w-full py-3">
          {busy ? <Spinner size={16} /> : existing ? <Save size={16} /> : <Droplet size={16} />}
          {busy ? "Saving" : existing ? "Save changes" : "Register as donor"}
        </button>
      </form>
    </div>
  );
};

export default BecomeDonor;
