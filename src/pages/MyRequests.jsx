import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Plus, Ban, CheckCheck } from "lucide-react";
import { requestApi } from "../api/endpoints.js";
import { useToast } from "../context/ToastContext.jsx";
import RequestCard from "../components/RequestCard.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { EmptyState, PageLoader, SectionHeading } from "../components/ui.jsx";
import { REQUEST_STATUS } from "../utils/constants.js";

const MyRequests = () => {
  const toast = useToast();
  const [requests, setRequests] = useState(null);
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = (nextStatus = status) =>
    requestApi.mine(nextStatus ? { status: nextStatus } : {}).then(({ requests: list }) => setRequests(list));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  const changeStatus = async () => {
    setBusy(true);
    try {
      await requestApi.setStatus(confirm.id, confirm.next);
      toast.success(`Request marked ${confirm.next.toLowerCase()}`);
      setConfirm(null);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!requests) return <PageLoader label="Loading your requests" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="My blood requests"
        description="Everything you've raised, with its current status and donor responses."
        action={<Link to="/request-blood" className="btn-primary"><Plus size={16} /> New request</Link>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {["", ...REQUEST_STATUS].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              status === s ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-muted hover:border-line-strong"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={status ? `No ${status.toLowerCase()} requests` : "You haven't raised a request yet"}
          description="When you do, donors with a compatible group in that city are notified straight away."
          action={<Link to="/request-blood" className="btn-primary mt-1">Raise a request</Link>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              actions={
                <>
                  <Link to={`/requests/${r._id}`} className="btn-ghost btn-sm">View details</Link>
                  {["Pending", "Accepted"].includes(r.status) && (
                    <>
                      <button className="btn-quiet btn-sm" onClick={() => setConfirm({ id: r._id, next: "Completed", name: r.patientName })}>
                        <CheckCheck size={15} /> Complete
                      </button>
                      <button className="btn-quiet btn-sm text-urgent" onClick={() => setConfirm({ id: r._id, next: "Cancelled", name: r.patientName })}>
                        <Ban size={15} /> Cancel
                      </button>
                    </>
                  )}
                </>
              }
            />
          ))}
        </div>
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
            ? `Donors will stop seeing the request for ${confirm?.name}. You can raise a new one any time.`
            : `This records a donation for the accepted donor and closes the request for ${confirm?.name}.`
        }
      />
    </div>
  );
};

export default MyRequests;
