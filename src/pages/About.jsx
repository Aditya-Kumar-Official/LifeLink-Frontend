import { Link } from "react-router-dom";

const problems = [
  ["Phone calls", "One number at a time, with no idea who is eligible."],
  ["Social media posts", "Reach is random and old posts keep circulating after the need is met."],
  ["Personal contacts", "Limited to whoever you already know."],
  ["Manual hospital inquiries", "Repeating the same question at every desk."],
  ["Scattered donor lists", "Spreadsheets nobody keeps up to date."],
];

const About = () => (
  <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
    <h1 className="font-display text-[40px] leading-tight">Why LifeLink exists</h1>
    <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">
      When someone needs blood urgently, the search usually starts from zero. Families call whoever they can think
      of, post in groups, and travel between hospitals asking the same question. It costs hours that patients often
      don't have.
    </p>
    <div className="mt-12 rounded-xl border border-line bg-surface p-6">
  <h2 className="text-xl font-semibold">Important Disclaimer</h2>
  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
    LifeLink is a student-developed academic project prototype created for
    educational and demonstration purposes. This platform is not a replacement
    for professional medical advice, diagnosis, treatment, or emergency
    healthcare services.
  </p>
  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
    Information displayed on this platform may be simulated, incomplete, or
    inaccurate. Users should verify all critical healthcare information through
    authorized medical professionals, hospitals, blood banks, or official
    emergency services.
  </p>
</div>

    <h2 className="mt-12 text-2xl">What people rely on today</h2>
    <dl className="mt-5 divide-y divide-line border-y border-line">
      {problems.map(([term, detail]) => (
        <div key={term} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
          <dt className="font-medium">{term}</dt>
          <dd className="text-sm text-ink-muted">{detail}</dd>
        </div>
      ))}
    </dl>

    <h2 className="mt-12 text-2xl">What LifeLink does instead</h2>
    <p className="mt-4 leading-relaxed text-ink-muted">
      LifeLink keeps donors, requests and hospitals in one place. A request records the blood group, the units
      needed, the hospital and how urgent it is. The system works out which blood groups are compatible, finds
      donors in that city who are available and past their 90-day donation gap, and notifies them. Donors accept or
      decline in one tap, and the request status updates for the family watching it.
    </p>

    <h2 className="mt-12 text-2xl">Who it's for</h2>
    <ul className="mt-4 space-y-2.5 text-ink-muted">
      <li><span className="font-medium text-ink">Patients and families</span> raising requests and tracking responses.</li>
      <li><span className="font-medium text-ink">Donors</span> who want to be reachable without publishing their number.</li>
      <li><span className="font-medium text-ink">Hospitals</span> listing their emergency and blood bank services.</li>
      <li><span className="font-medium text-ink">Administrators</span> verifying donors and removing fraudulent requests.</li>
    </ul>

    <div className="mt-12 flex flex-wrap gap-3">
      <Link to="/register" className="btn-primary">Create an account</Link>
      <Link to="/donors" className="btn-ghost">Browse donors</Link>
    </div>
  </div>
);

export default About;
