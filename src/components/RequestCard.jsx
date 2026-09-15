import { Link } from "react-router-dom";
import { MapPin, CalendarDays, Users } from "lucide-react";
import { formatDate, timeAgo } from "../utils/format.js";
import { LEVEL_STYLE, STATUS_STYLE } from "../utils/constants.js";

const RequestCard = ({ request, actions }) => (
  <article className="card p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip ${LEVEL_STYLE[request.emergencyLevel]}`}>{request.emergencyLevel}</span>
          <span className={`chip ${STATUS_STYLE[request.status]}`}>{request.status}</span>
        </div>
        <h3 className="mt-2.5 truncate text-lg leading-tight">{request.patientName}</h3>
        <p className="mt-1 text-sm text-ink-muted">
          {request.unitsRequired} unit{request.unitsRequired > 1 ? "s" : ""} · raised {timeAgo(request.createdAt)}
        </p>
      </div>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-urgent-soft font-display text-[17px] font-semibold text-urgent">
        {request.bloodGroup}
      </span>
    </div>

    <dl className="mt-4 space-y-2 text-sm">
      <div className="flex gap-2 text-ink-muted">
        <MapPin size={15} className="mt-0.5 shrink-0" />
        <dd className="min-w-0">
          <span className="text-ink">{request.hospitalName}</span> — {request.hospitalLocation}
        </dd>
      </div>
      <div className="flex gap-2 text-ink-muted">
        <CalendarDays size={15} className="mt-0.5 shrink-0" />
        <dd>Needed by {formatDate(request.requiredDate)}</dd>
      </div>
      {request.responses?.length > 0 && (
        <div className="flex gap-2 text-ink-muted">
          <Users size={15} className="mt-0.5 shrink-0" />
          <dd>{request.responses.length} donor response{request.responses.length > 1 ? "s" : ""}</dd>
        </div>
      )}
    </dl>

    <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
      {actions || (
        <Link to={`/requests/${request._id}`} className="btn-ghost btn-sm">
          View details
        </Link>
      )}
    </div>
  </article>
);

export default RequestCard;
