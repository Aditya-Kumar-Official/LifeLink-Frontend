import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
    <p className="font-display text-6xl text-line-strong">404</p>
    <h1 className="mt-4 text-2xl">That page isn't here</h1>
    <p className="mt-2 text-ink-muted">The link may be out of date. Everything still works from the dashboard.</p>
    <div className="mt-7 flex gap-3">
      <Link to="/" className="btn-ghost">Back home</Link>
      <Link to="/dashboard" className="btn-primary">Go to dashboard</Link>
    </div>
  </div>
);

export default NotFound;
