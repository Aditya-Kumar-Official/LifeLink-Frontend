import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field, Input, Select, Spinner } from "../components/ui.jsx";
import Logo from "../components/Logo.jsx";
import { BLOOD_GROUPS } from "../utils/constants.js";

const roles = [
  { value: "user", label: "Patient or general user" },
  { value: "donor", label: "Blood donor" },
  { value: "hospital", label: "Hospital staff" },
];

const empty = {
  name: "", email: "", phone: "", password: "", confirmPassword: "",
  bloodGroup: "", location: "", role: "user",
};

const Register = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (!/^[0-9+\-\s()]{10,15}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    if (form.password.length < 6) next.password = "Use at least 6 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    if (form.role === "donor" && !form.bloodGroup) next.bloodGroup = "Donors need a blood group";
    if (!form.location.trim()) next.location = "Enter your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setBusy(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to LifeLink, ${user.name.split(" ")[0]}`);
      navigate(form.role === "donor" ? "/become-donor" : "/dashboard", { replace: true });
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-6 text-[28px]">Create your account</h1>
        <p className="mt-1.5 text-sm text-ink-muted">One account covers requests, donations and contacts.</p>
      </div>

      <form onSubmit={submit} noValidate className="card space-y-5 p-6">
        {formError && (
          <p role="alert" className="rounded-lg border border-urgent/25 bg-urgent-soft px-3.5 py-2.5 text-sm text-urgent">
            {formError}
          </p>
        )}

        <Field label="Full name" error={errors.name} required>
          <Input name="name" value={form.name} onChange={change} error={errors.name} autoComplete="name" placeholder="Aditya Sharma" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" error={errors.email} required>
            <Input name="email" type="email" value={form.email} onChange={change} error={errors.email}
              autoComplete="email" placeholder="you@example.com" />
          </Field>
          <Field label="Phone number" error={errors.phone} required>
            <Input name="phone" value={form.phone} onChange={change} error={errors.phone}
              autoComplete="tel" placeholder="9876543210" inputMode="tel" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Password" error={errors.password} hint="At least 6 characters" required>
            <Input name="password" type="password" value={form.password} onChange={change} error={errors.password} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password" error={errors.confirmPassword} required>
            <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={change}
              error={errors.confirmPassword} autoComplete="new-password" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Blood group" error={errors.bloodGroup} hint={form.role === "donor" ? undefined : "Optional, but it speeds up matching"}>
            <Select name="bloodGroup" value={form.bloodGroup} onChange={change} error={errors.bloodGroup}>
              <option value="">Not sure yet</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="City" error={errors.location} required>
            <Input name="location" value={form.location} onChange={change} error={errors.location} placeholder="Digha" />
          </Field>
        </div>

        <Field label="Account type" required>
          <Select name="role" value={form.role} onChange={change}>
            {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </Select>
        </Field>

        <button type="submit" disabled={busy} className="btn-primary w-full py-3">
          {busy ? <Spinner size={16} /> : <UserPlus size={16} />}
          {busy ? "Creating account" : "Create account"}
        </button>

        <p className="text-center text-sm text-ink-muted">
          Already registered? <Link to="/login" className="font-medium text-ink underline underline-offset-4">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
