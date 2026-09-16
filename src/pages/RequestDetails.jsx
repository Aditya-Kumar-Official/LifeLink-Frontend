import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, CalendarDays, Users, Ban, CheckCheck, MessageSquare } from "lucide-react";
import { requestApi } from "../api/endpoints.js";
import { useToast } from "../context/ToastContext.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { EmptyState, PageLoader } from "../components/ui.jsx";
import { formatDate, formatDateTime, timeAgo } from "../utils/format.js";
import { LEVEL_STYLE, STATUS_STYLE } from "../utils/constants.js";

const Row = ({ Icon, label, children }) => (
  <div className="flex gap-3 py-3">
    <Icon size={17} className="mt-0.5 shrink-0 text-ink-muted" />
    <div className="min-w-0">
      <p className="text-[13px] text-ink-muted">{label}</p>
      <p className="mt-0.5 break-words">{children}</p>
    </div>
  </div>
);

const RequestDetails = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, request: null, isOwner: false, error: "" });
  const [matches, setMatches] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    requestApi
      .byId(id)
      .then(({ request, isOwner }) => {
        setState({ loading: false, request, isOwner, error: "" });
        if (isOwner) requestApi.matches(id).then(({ donors }) => setMatches(donors)).catch(() => setMatches([]));
      })
      .catch((e) => setState({ loading: false, request: null, isOwner: false, error: e.message }));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const changeStatus = async () => {
    setBusy(true);
    try {
      await requestApi.setStatus(id, confirm.next);
      toast.success(`Request marked ${confirm.next.toLowerCase()}`);
      setConfirm(null);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (state.loading) return <PageLoader label="Loading request" />;
  if (state.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <EmptyState
          icon={Users}
          title="Request unavailable"
          description={state.error}
          action={<button onClick={() => navigate(-1)} className="btn-ghost mt-1">Go back</button>}
        />
      </div>
    );
  }

  const { request, isOwner } = state;
  const accepted = (request.responses || []).filter(
  (r) => r.action === "Accepted"
);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/requests" className="btn-quiet btn-sm -ml-3 mb-4"><ArrowLeft size={15} /> All requests</Link>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`chip ${LEVEL_STYLE[request.emergencyLevel]}`}>{request.emergencyLevel}</span>
              <span className={`chip ${STATUS_STYLE[request.status]}`}>{request.status}</span>
              <span className="text-[13px] text-ink-muted">raised {timeAgo(request.createdAt)}</span>
            </div>
            <h1 className="mt-3 text-2xl">{request.patientName}</h1>
            <p className="mt-1 text-ink-muted">
              {request.unitsRequired} unit{request.unitsRequired > 1 ? "s" : ""} of {request.bloodGroup} needed
            </p>
          </div>
          <span className="grid h-16 w-16 place-items-center rounded-xl2 bg-urgent-soft font-display text-2xl font-semibold text-urgent">
            {request.bloodGroup}
          </span>
        </div>

        <div className="divide-y divide-line px-6 py-2">
          <Row Icon={MapPin} label="Hospital">{request.hospitalName} — {request.hospitalLocation}</Row>
          <Row Icon={CalendarDays} label="Required by">{formatDate(request.requiredDate)}</Row>
          <Row Icon={Phone} label="Contact">
            <a href={`tel:${request.contactNumber}`} className="underline underline-offset-4">{request.contactNumber}</a>
          </Row>
          {request.additionalMessage && (
            <Row Icon={MessageSquare} label="Message from the family">{request.additionalMessage}</Row>
          )}
        </div>

        {isOwner && ["Pending", "Accepted"].includes(request.status) && (
          <div className="flex flex-wrap gap-2 border-t border-line bg-paper px-6 py-4">
            <button className="btn-primary btn-sm" onClick={() => setConfirm({ next: "Completed" })}>
              <CheckCheck size={15} /> Mark completed
            </button>
            <button className="btn-ghost btn-sm text-urgent" onClick={() => setConfirm({ next: "Cancelled" })}>
              <Ban size={15} /> Cancel request
            </button>
          </div>
        )}
      </div>

      {/* Donor responses */}
      <h2 className="mt-10 text-xl">Donor responses</h2>
      {request.responses.length === 0 ? (
        <p className="mt-3 rounded-xl2 border border-dashed border-line px-5 py-8 text-center text-sm text-ink-muted">
          No responses yet. Donors who match this group were notified.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl2 border border-line bg-white">
          {request.responses.map((r, i) => (
            <li key={i} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-paper-sunken font-display text-sm font-semibold">
                {r.donor?.bloodGroup || "—"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{r.donor?.name || "Donor"}</p>
                <p className="text-sm text-ink-muted">
                  {r.action === "Accepted" ? "Accepted" : "Declined"} · {formatDateTime(r.respondedAt)}
                  {r.note && ` · ${r.note}`}
                </p>
              </div>
              {isOwner && r.action === "Accepted" && r.donor?.phone && (
                <a href={`tel:${r.donor.phone}`} className="btn-ghost btn-sm"><Phone size={15} /> Call</a>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Matching donors, owner only */}
      {isOwner && (
        <>
          <h2 className="mt-10 text-xl">Donors we matched</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Eligible donors with a compatible group near {request.hospitalLocation.split(",")[0]}.
          </p>
          {matches === null ? (
            <p className="mt-3 text-sm text-ink-muted">Finding matches…</p>
          ) : matches.length === 0 ? (
            <p className="mt-3 rounded-xl2 border border-dashed border-line px-5 py-8 text-center text-sm text-ink-muted">
              No eligible donor matches that group and city yet. Try the{" "}
              <Link to="/donors" className="underline underline-offset-4">full donor search</Link>.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {matches.map((d) => (
                <li key={d._id} className="card flex items-center gap-3 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-urgent-soft font-display text-sm font-semibold text-urgent">
                    {d.bloodGroup}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{d.name}</p>
                    <p className="truncate text-sm text-ink-muted">{d.city}</p>
                  </div>
                  <a href={`tel:${d.phone}`} className="btn-ghost btn-sm"><Phone size={15} /></a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {accepted.length > 0 && isOwner && (
        <p className="mt-8 rounded-lg border border-vital/25 bg-vital-soft px-4 py-3 text-sm text-vital">
          {accepted.length} donor{accepted.length > 1 ? "s have" : " has"} accepted. Call to confirm the timing before
          marking this request complete.
        </p>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={busy}
        danger={confirm?.next === "Cancelled"}
        onClose={() => !busy && setConfirm(null)}
        onConfirm={changeStatus}
        title={confirm?.next === "Cancelled" ? "Cancel this request?" : "Mark this request complete?"}
        confirmLabel={confirm?.next === "Cancelled" ? "Cancel request" : "Mark complete"}
        message={
          confirm?.next === "Cancelled"
            ? "Donors will stop seeing it. You can raise a new request any time."
            : "This records a donation for the accepted donor and closes the request."
        }
      />
    </div>
  );
};

export default RequestDetails;
