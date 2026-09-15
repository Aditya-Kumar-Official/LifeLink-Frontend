import { Link } from "react-router-dom";
import { MapPin, Phone, BadgeCheck, CalendarClock, Droplet } from "lucide-react";
import { formatDate } from "../utils/format.js";

const availabilityTone = {
  Available: "bg-vital-soft text-vital",
  Unavailable: "bg-paper-sunken text-ink-muted",
  "Temporarily Unavailable": "bg-amberish-soft text-amberish",
};

const DonorCard = ({ donor, canContact }) => (
  <article className="card flex flex-col p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-lg leading-tight">{donor.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin size={14} /> {donor.city}
        </p>
      </div>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-urgent-soft font-display text-[17px] font-semibold text-urgent">
        {donor.bloodGroup}
      </span>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <span className={`chip ${availabilityTone[donor.availability]}`}>{donor.availability}</span>
      {donor.verified && (
        <span className="chip bg-paper-sunken text-ink-soft">
          <BadgeCheck size={13} /> Verified
        </span>
      )}
      {donor.eligible ? (
        <span className="chip bg-vital-soft text-vital">
          <Droplet size={13} /> Eligible now
        </span>
      ) : (
        <span className="chip bg-paper-sunken text-ink-muted">
          <CalendarClock size={13} /> Eligible {formatDate(donor.nextEligibleDate)}
        </span>
      )}
    </div>

    {donor.lastDonationDate && (
      <p className="mt-3 text-[13px] text-ink-muted">Last donated {formatDate(donor.lastDonationDate)}</p>
    )}

    <div className="mt-5 flex gap-2 border-t border-line pt-4">
      {canContact && donor.phone ? (
        <a href={`tel:${donor.phone}`} className="btn-ghost btn-sm flex-1">
          <Phone size={15} /> Call
        </a>
      ) : (
        <Link to="/login" className="btn-ghost btn-sm flex-1">
          Sign in to contact
        </Link>
      )}
      <Link to={`/request-blood?bloodGroup=${encodeURIComponent(donor.bloodGroup)}&city=${encodeURIComponent(donor.city)}`} className="btn-primary btn-sm flex-1">
        Request blood
      </Link>
    </div>
  </article>
);

export default DonorCard;
