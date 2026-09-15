import { Link } from "react-router-dom";

// The mark is an ECG trace that resolves into a drop — the two things LifeLink coordinates.
const Logo = ({ tone = "dark", to = "/" }) => (
  <Link to={to} className="group inline-flex items-center gap-2.5" aria-label="LifeLink home">
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill={tone === "light" ? "#FFFFFF" : "#0E3339"} />
      <path
        d="M6 17h4.2l2-4.6 3 9.2 2.4-6.1 1.5 1.5H26"
        fill="none"
        stroke="#C21B2E"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className={`font-display text-[21px] leading-none ${tone === "light" ? "text-white" : "text-ink"}`}>
      LifeLink
    </span>
  </Link>
);

export default Logo;
