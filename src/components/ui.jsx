import { Loader2 } from "lucide-react";

export const Spinner = ({ size = 18, className = "" }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} aria-hidden />
);

export const PageLoader = ({ label = "Loading" }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-muted">
    <Spinner size={22} />
    <p className="text-sm">{label}</p>
  </div>
);

export const Badge = ({ children, className = "" }) => (
  <span className={`chip ${className}`}>{children}</span>
);

export const Field = ({ label, error, hint, children, required }) => (
  <div>
    <label className="label">
      {label}
      {required && <span className="ml-0.5 text-urgent">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1.5 text-[13px] text-ink-muted">{hint}</p>}
    {error && <p className="field-error">{error}</p>}
  </div>
);

export const Input = ({ error, ...props }) => (
  <input {...props} className={`input ${error ? "input-error" : ""} ${props.className || ""}`} />
);

export const Select = ({ error, children, ...props }) => (
  <select {...props} className={`input ${error ? "input-error" : ""} ${props.className || ""}`}>
    {children}
  </select>
);

export const Textarea = ({ error, ...props }) => (
  <textarea {...props} className={`input resize-y ${error ? "input-error" : ""} ${props.className || ""}`} />
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
    {Icon && (
      <span className="grid h-11 w-11 place-items-center rounded-full bg-paper-sunken text-ink-soft">
        <Icon size={20} />
      </span>
    )}
    <h3 className="text-lg">{title}</h3>
    {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
    {action}
  </div>
);

export const SectionHeading = ({ title, description, action }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-2xl sm:text-[28px]">{title}</h1>
      {description && <p className="mt-1 max-w-xl text-sm text-ink-muted">{description}</p>}
    </div>
    {action}
  </div>
);

export const Pagination = ({ page, pages, onChange }) => {
  if (!pages || pages <= 1) return null;
  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
      <button className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="px-2 text-sm text-ink-muted">
        Page {page} of {pages}
      </span>
      <button className="btn-ghost btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  );
};
