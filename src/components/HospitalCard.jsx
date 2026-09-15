import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Ambulance, Droplets } from "lucide-react";

const HospitalCard = ({ hospital }) => (
  <article className="card flex flex-col p-5">
    <h3 className="text-lg leading-tight">{hospital.name}</h3>
    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-ink-muted">
      <MapPin size={14} className="mt-0.5 shrink-0" />
      {hospital.address}, {hospital.city}
    </p>

    <div className="mt-3 flex flex-wrap gap-2">
      {hospital.emergencyAvailable && (
        <span className="chip bg-urgent-soft text-urgent"><Ambulance size={13} /> Emergency</span>
      )}
      {hospital.bloodBankAvailable && (
        <span className="chip bg-vital-soft text-vital"><Droplets size={13} /> Blood bank</span>
      )}
      <span className="chip bg-paper-sunken text-ink-muted"><Clock size={13} /> {hospital.operatingHours}</span>
    </div>

    {hospital.facilities?.length > 0 && (
      <p className="mt-3 text-[13px] text-ink-muted">{hospital.facilities.slice(0, 4).join(" · ")}</p>
    )}

    <div className="mt-auto flex gap-2 border-t border-line pt-4">
      <a href={`tel:${hospital.phone}`} className="btn-ghost btn-sm flex-1">
        <Phone size={15} /> Call
      </a>
      <Link to={`/hospitals/${hospital._id}`} className="btn-primary btn-sm flex-1">
        Details
      </Link>
    </div>
  </article>
);

export default HospitalCard;
