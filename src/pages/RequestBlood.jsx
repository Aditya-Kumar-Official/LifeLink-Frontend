import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Siren, Info } from "lucide-react";
import { requestApi } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field, Input, Select, Textarea, SectionHeading, Spinner } from "../components/ui.jsx";
import { BLOOD_GROUPS, COMPATIBLE_DONORS, EMERGENCY_LEVELS } from "../utils/constants.js";
import { todayISO } from "../utils/format.js";

const levelHelp = {
  Low: "Planned transfusion, several days of notice.",
  Medium: "Needed within a few days.",
  High: "Needed within 24 hours.",
  Critical: "Needed immediately — donors are alerted first.",
};

const RequestBlood = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: params.get("bloodGroup") || user?.bloodGroup || "",
    unitsRequired: 1,
    hospitalName: params.get("hospital") || "",
    hospitalLocation: params.get("city") || user?.location || "",
    contactNumber: user?.phone || "",
    emergencyLevel: "High",
    requiredDate: todayISO(),
    additionalMessage: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <Siren size={26} className="mx-auto text-urgent" />
        <h1 className="mt-4 text-2xl">Sign in to raise a request</h1>
        <p className="mt-2 text-ink-muted">
          A request carries your contact details to donors, so it needs an account. It takes a minute to create one.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/login" state={{ from: "/request-blood" }} className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-primary">Create account</Link>
        </div>
      </div>
    );
  }

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.patientName.trim().length < 2) next.patientName = "Enter the patient's name";
    if (!BLOOD_GROUPS.includes(form.bloodGroup)) next.bloodGroup = "Choose the blood group needed";
    if (!(form.unitsRequired >= 1 && form.unitsRequired <= 20)) next.unitsRequired = "Enter between 1 and 20 units";
    if (!form.hospitalName.trim()) next.hospitalName = "Enter the hospital name";
    if (!form.hospitalLocation.trim()) next.hospitalLocation = "Enter the hospital's city or address";
    if (!/^[0-9+\-\s()]{10,15}$/.test(form.contactNumber)) next.contactNumber = "Enter a valid contact number";
    if (!form.requiredDate) next.requiredDate = "Pick the date the blood is needed";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const { request, matchedDonors } = await requestApi.create({ ...form, unitsRequired: Number(form.unitsRequired) });
      toast.success(
        matchedDonors > 0
          ? `Request live. ${matchedDonors} matching donor${matchedDonors > 1 ? "s were" : " was"} notified.`
          : "Request live. No eligible donor matched yet — we'll notify you when one registers."
      );
      navigate(`/requests/${request._id}`);
    } catch (err) {
      setErrors(err.errors || {});
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const compatible = COMPATIBLE_DONORS[form.bloodGroup];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Request emergency blood"
        description="Everything here is shared with donors who can help, so keep it accurate."
      />

      <form onSubmit={submit} noValidate className="card space-y-5 p-6">
        <Field label="Patient name" error={errors.patientName} required>
          <Input name="patientName" value={form.patientName} onChange={change} error={errors.patientName} placeholder="Full name of the patient" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Blood group required" error={errors.bloodGroup} required>
            <Select name="bloodGroup" value={form.bloodGroup} onChange={change} error={errors.bloodGroup}>
              <option value="">Select a group</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Units required" error={errors.unitsRequired} required>
            <Input type="number" name="unitsRequired" min={1} max={20} value={form.unitsRequired}
              onChange={change} error={errors.unitsRequired} />
          </Field>
        </div>

        {compatible && (
          <p className="flex gap-2 rounded-lg bg-paper px-3.5 py-3 text-[13px] text-ink-muted">
            <Info size={15} className="mt-0.5 shrink-0" />
            We'll also alert donors with compatible groups: {compatible.join(", ")}.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Hospital name" error={errors.hospitalName} required>
            <Input name="hospitalName" value={form.hospitalName} onChange={change} error={errors.hospitalName} placeholder="SSKM Hospital" />
          </Field>
          <Field label="Hospital location" error={errors.hospitalLocation} hint="City first — it's used to find nearby donors." required>
            <Input name="hospitalLocation" value={form.hospitalLocation} onChange={change} error={errors.hospitalLocation} placeholder="Kolkata, AJC Bose Road" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Contact number" error={errors.contactNumber} hint="Donors will call this number." required>
            <Input name="contactNumber" value={form.contactNumber} onChange={change} error={errors.contactNumber} inputMode="tel" />
          </Field>
          <Field label="Required by" error={errors.requiredDate} required>
            <Input type="date" name="requiredDate" value={form.requiredDate} onChange={change} error={errors.requiredDate} min={todayISO()} />
          </Field>
        </div>

        <Field label="Emergency level" hint={levelHelp[form.emergencyLevel]} required>
          <div className="grid grid-cols-4 gap-2">
            {EMERGENCY_LEVELS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => setForm({ ...form, emergencyLevel: l })}
                aria-pressed={form.emergencyLevel === l}
                className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  form.emergencyLevel === l
                    ? l === "Critical"
                      ? "border-urgent bg-urgent text-white"
                      : "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-muted hover:border-line-strong"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Additional message" hint="Ward number, visiting hours, anything a donor should know.">
          <Textarea name="additionalMessage" rows={3} maxLength={500} value={form.additionalMessage} onChange={change}
            placeholder="Patient is in the emergency ward, bed 12. Please call before coming." />
        </Field>

        <button type="submit" disabled={busy} className="btn-urgent w-full py-3">
          {busy ? <Spinner size={16} /> : <Siren size={16} />}
          {busy ? "Sending to donors" : "Submit request"}
        </button>
      </form>
    </div>
  );
};

export default RequestBlood;
