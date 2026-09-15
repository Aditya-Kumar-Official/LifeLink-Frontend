import { useRef, useState } from "react";
import { Camera, Save, KeyRound } from "lucide-react";
import { authApi, userApi } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field, Input, Select, SectionHeading, Spinner } from "../components/ui.jsx";
import { BLOOD_GROUPS } from "../utils/constants.js";
import { formatDate, initials } from "../utils/format.js";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: user.name, phone: user.phone, bloodGroup: user.bloodGroup || "", location: user.location || "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdBusy, setPwdBusy] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!/^[0-9+\-\s()]{10,15}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const { user: updated } = await userApi.updateProfile(form);
      updateUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      setErrors(err.errors || {});
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { user: updated } = await userApi.uploadImage(file);
      updateUser(updated);
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      e.target.value = "";
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const next = {};
    if (!pwd.currentPassword) next.currentPassword = "Enter your current password";
    if (pwd.newPassword.length < 6) next.newPassword = "Use at least 6 characters";
    if (pwd.newPassword !== pwd.confirmPassword) next.confirmPassword = "Passwords do not match";
    setPwdErrors(next);
    if (Object.keys(next).length) return;

    setPwdBusy(true);
    try {
      await authApi.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed");
    } catch (err) {
      setPwdErrors(err.errors || {});
      toast.error(err.message);
    } finally {
      setPwdBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <SectionHeading title="Your profile" description="Keep this current — donors and hospitals use it to reach you." />

      <div className="card mb-6 flex flex-wrap items-center gap-5 p-6">
        <div className="relative">
          {user.profileImage ? (
            <img src={user.profileImage} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-ink font-display text-2xl text-white">
              {initials(user.name)}
            </span>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border border-line bg-white shadow-card"
            aria-label="Change profile photo"
          >
            <Camera size={15} />
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={pickImage} className="hidden" />
        </div>
        <div className="min-w-0">
          <p className="text-xl">{user.name}</p>
          <p className="text-sm text-ink-muted">{user.email}</p>
          <p className="mt-1 text-[13px] text-ink-muted">
            {user.role === "user" ? "Patient account" : `${user.role[0].toUpperCase()}${user.role.slice(1)} account`} · joined {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <form onSubmit={saveProfile} noValidate className="card space-y-5 p-6">
        <h2 className="text-lg">Account details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors.name} required>
            <Input name="name" value={form.name} onChange={change} error={errors.name} />
          </Field>
          <Field label="Phone number" error={errors.phone} required>
            <Input name="phone" value={form.phone} onChange={change} error={errors.phone} inputMode="tel" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Blood group" error={errors.bloodGroup}>
            <Select name="bloodGroup" value={form.bloodGroup} onChange={change}>
              <option value="">Not set</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="City">
            <Input name="location" value={form.location} onChange={change} placeholder="Digha" />
          </Field>
        </div>
        <Field label="Email" hint="Your email is the account identifier and can't be changed here.">
          <Input value={user.email} disabled className="bg-paper-sunken text-ink-muted" />
        </Field>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? <Spinner size={16} /> : <Save size={16} />} Save changes
        </button>
      </form>

      <form onSubmit={changePassword} noValidate className="card mt-6 space-y-5 p-6">
        <h2 className="text-lg">Change password</h2>
        <Field label="Current password" error={pwdErrors.currentPassword} required>
          <Input type="password" value={pwd.currentPassword} autoComplete="current-password"
            onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} error={pwdErrors.currentPassword} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="New password" error={pwdErrors.newPassword} hint="At least 6 characters" required>
            <Input type="password" value={pwd.newPassword} autoComplete="new-password"
              onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} error={pwdErrors.newPassword} />
          </Field>
          <Field label="Confirm new password" error={pwdErrors.confirmPassword} required>
            <Input type="password" value={pwd.confirmPassword} autoComplete="new-password"
              onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })} error={pwdErrors.confirmPassword} />
          </Field>
        </div>
        <button type="submit" disabled={pwdBusy} className="btn-ghost">
          {pwdBusy ? <Spinner size={16} /> : <KeyRound size={16} />} Change password
        </button>
      </form>
    </div>
  );
};

export default Profile;
