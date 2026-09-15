import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Mail, Clock, Ambulance, Droplets, Map, Siren } from "lucide-react";
import { hospitalApi } from "../api/endpoints.js";
import { EmptyState, PageLoader } from "../components/ui.jsx";

const HospitalDetails = () => {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, hospital: null, error: "" });

  useEffect(() => {
    hospitalApi
      .byId(id)
      .then(({ hospital }) => setState({ loading: false, hospital, error: "" }))
      .catch((e) => setState({ loading: false, hospital: null, error: e.message }));
  }, [id]);

  if (state.loading) return <PageLoader label="Loading hospital" />;
  if (state.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <EmptyState
          icon={MapPin}
          title="Hospital not found"
          description={state.error}
          action={<Link to="/hospitals" className="btn-ghost mt-1">Back to directory</Link>}
        />
      </div>
    );
  }

  const h = state.hospital;
  const mapQuery = encodeURIComponent(`${h.name}, ${h.address}, ${h.city}`);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/hospitals" className="btn-quiet btn-sm -ml-3 mb-4"><ArrowLeft size={15} /> Hospital directory</Link>

      <div className="card overflow-hidden">
        <div className="border-b border-line px-6 py-6">
          <h1 className="text-[28px] leading-tight">{h.name}</h1>
          <p className="mt-2 flex items-start gap-2 text-ink-muted">
            <MapPin size={16} className="mt-1 shrink-0" />
            {h.address}, {h.city}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {h.emergencyAvailable ? (
              <span className="chip bg-urgent-soft text-urgent"><Ambulance size={13} /> Emergency services</span>
            ) : (
              <span className="chip bg-paper-sunken text-ink-muted">No emergency ward</span>
            )}
            {h.bloodBankAvailable ? (
              <span className="chip bg-vital-soft text-vital"><Droplets size={13} /> Blood bank on site</span>
            ) : (
              <span className="chip bg-paper-sunken text-ink-muted">No blood bank</span>
            )}
            <span className="chip bg-paper-sunken text-ink-muted"><Clock size={13} /> {h.operatingHours}</span>
          </div>
        </div>

        <dl className="grid gap-px bg-line sm:grid-cols-2">
          <div className="bg-white px-6 py-5">
            <dt className="text-[13px] text-ink-muted">Phone</dt>
            <dd className="mt-1"><a href={`tel:${h.phone}`} className="underline underline-offset-4">{h.phone}</a></dd>
          </div>
          <div className="bg-white px-6 py-5">
            <dt className="text-[13px] text-ink-muted">Email</dt>
            <dd className="mt-1 break-words">
              {h.email ? <a href={`mailto:${h.email}`} className="underline underline-offset-4">{h.email}</a> : "Not listed"}
            </dd>
          </div>
        </dl>

        {h.facilities?.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <h2 className="font-sans text-sm font-semibold text-ink-soft">Facilities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {h.facilities.map((f) => <span key={f} className="chip bg-paper-sunken text-ink-soft">{f}</span>)}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-line bg-paper px-6 py-4">
          <a href={`tel:${h.phone}`} className="btn-primary btn-sm"><Phone size={15} /> Call hospital</a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
            <Map size={15} /> View location
          </a>
          <Link
            to={`/request-blood?hospital=${encodeURIComponent(h.name)}&city=${encodeURIComponent(h.city)}`}
            className="btn-ghost btn-sm text-urgent"
          >
            <Siren size={15} /> Request assistance
          </Link>
          {h.email && <a href={`mailto:${h.email}`} className="btn-quiet btn-sm"><Mail size={15} /> Email</a>}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;
