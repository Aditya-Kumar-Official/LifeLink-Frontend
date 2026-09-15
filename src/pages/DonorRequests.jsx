import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Check, X, Droplet } from "lucide-react";
import { requestApi } from "../api/endpoints.js";
import { useToast } from "../context/ToastContext.jsx";
import RequestCard from "../components/RequestCard.jsx";
import Modal from "../components/Modal.jsx";
import { EmptyState, PageLoader, SectionHeading, Spinner, Textarea, Field } from "../components/ui.jsx";
import { formatDate } from "../utils/format.js";

const DonorRequests = () => {
  const toast = useToast();
  const [state, setState] = useState({ loading: true, requests: [], donor: null, error: "" });
  const [target, setTarget] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    requestApi
      .feed()
      .then(({ requests, donor }) => setState({ loading: false, requests, donor, error: "" }))
      .catch((e) => setState({ loading: false, requests: [], donor: null, error: e.message }));

  useEffect(() => { load(); }, []);

  const respond = async (action) => {
    setBusy(true);
    try {
      await requestApi.respond(target._id, { action, note });
      toast.success(action === "Accepted" ? "You accepted this request. The family has been notified." : "Response recorded.");
      setTarget(null);
      setNote("");
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (state.loading) return <PageLoader label="Finding requests for your blood group" />;

  if (state.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          icon={Droplet}
          title="No donor profile yet"
          description={state.error}
          action={<Link to="/become-donor" className="btn-primary mt-1">Register as a donor</Link>}
        />
      </div>
    );
  }

  const { donor, requests } = state;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Requests you can help with"
        description={`Open requests from patients who can receive ${donor.bloodGroup} blood.`}
        action={<Link to="/become-donor" className="btn-ghost btn-sm">Edit donor profile</Link>}
      />

      {!donor.eligible && (
        <p className="mb-6 rounded-lg border border-amberish/25 bg-amberish-soft px-4 py-3 text-sm text-amberish">
          You can browse these requests, but accepting is disabled until{" "}
          {donor.lastDonationDate ? formatDate(donor.nextEligibleDate) : "your availability is set to Available"}.
        </p>
      )}

      {requests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No open requests right now"
          description="We'll notify you the moment someone nearby needs a group you can give to."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              actions={
                <>
                  <button className="btn-primary btn-sm" disabled={!donor.eligible} onClick={() => setTarget(r)}>
                    <Check size={15} /> Respond
                  </button>
                  <Link to={`/requests/${r._id}`} className="btn-ghost btn-sm">Details</Link>
                </>
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(target)}
        onClose={() => !busy && setTarget(null)}
        title="Respond to this request"
        description={target ? `${target.patientName} · ${target.bloodGroup} · ${target.hospitalName}` : ""}
        footer={
          <>
            <button className="btn-ghost" disabled={busy} onClick={() => respond("Rejected")}>
              <X size={15} /> Can't help
            </button>
            <button className="btn-primary" disabled={busy} onClick={() => respond("Accepted")}>
              {busy ? <Spinner size={15} /> : <Check size={15} />} I can donate
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Accepting shares your name and phone number with the person who raised this request so they can call you.
        </p>
        <div className="mt-4">
          <Field label="Message (optional)" hint="For example, when you can reach the hospital.">
            <Textarea rows={3} value={note} maxLength={300} onChange={(e) => setNote(e.target.value)}
              placeholder="I can reach the hospital by 7pm today." />
          </Field>
        </div>
      </Modal>
    </div>
  );
};

export default DonorRequests;
