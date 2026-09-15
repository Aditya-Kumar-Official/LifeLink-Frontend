import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field, Input, Spinner } from "../components/ui.jsx";
import Logo from "../components/Logo.jsx";

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(params.get("expired") ? "Your session expired. Sign in again." : "");
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setBusy(true);
    try {
      const user = await login(form);
      toast.success(`Signed in as ${user.name}`);
      navigate(location.state?.from || (user.role === "admin" ? "/admin" : "/dashboard"), { replace: true });
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-6 text-[28px]">Sign in</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Pick up where you left off.</p>
      </div>

      <form onSubmit={submit} noValidate className="card space-y-5 p-6">
        {formError && (
          <p role="alert" className="rounded-lg border border-urgent/25 bg-urgent-soft px-3.5 py-2.5 text-sm text-urgent">
            {formError}
          </p>
        )}

        <Field label="Email" error={errors.email} required>
          <Input name="email" type="email" value={form.email} onChange={change} error={errors.email}
            autoComplete="email" placeholder="you@example.com" />
        </Field>

        <Field label="Password" error={errors.password} required>
          <Input name="password" type="password" value={form.password} onChange={change} error={errors.password}
            autoComplete="current-password" placeholder="••••••••" />
        </Field>

        <button type="submit" disabled={busy} className="btn-primary w-full py-3">
          {busy ? <Spinner size={16} /> : <LogIn size={16} />}
          {busy ? "Signing in" : "Sign in"}
        </button>

        <p className="text-center text-sm text-ink-muted">
          New to LifeLink?{" "}
          <Link to="/register" className="font-medium text-ink underline underline-offset-4">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
