import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Siren, Hospital, Contact, ShieldCheck, ListChecks, ArrowRight, UserPlus, HeartHandshake,
} from "lucide-react";
import { userApi } from "../api/endpoints.js";
import { BLOOD_GROUPS, COMPATIBLE_DONORS } from "../utils/constants.js";

const steps = [
  { title: "Create your account", body: "Register as a patient, a donor, or a hospital. It takes a minute." },
  { title: "Search what you need", body: "Filter donors by blood group, city and availability, or look up a nearby hospital." },
  { title: "Connect directly", body: "Call a matched donor or the hospital's blood bank without going through middlemen." },
  { title: "Track the response", body: "Watch responses land on your request and mark it complete when the unit arrives." },
];

const features = [
  { Icon: Search, title: "Donor search", body: "Filter by blood group, city and current availability. Contact details stay hidden until you sign in." },
  { Icon: Siren, title: "Emergency requests", body: "Raise a request with a priority level; every compatible donor nearby is alerted at once." },
  { Icon: Hospital, title: "Hospital directory", body: "See which hospitals run a blood bank, which take emergencies, and when they're open." },
  { Icon: Contact, title: "Emergency contacts", body: "Keep the numbers you'd need at 3am in one place instead of scattered across your phone." },
  { Icon: ShieldCheck, title: "Verified accounts", body: "Passwords are hashed, sessions are token-based, and administrators verify donor profiles." },
  { Icon: ListChecks, title: "Request tracking", body: "Every request carries its own status — pending, accepted, completed or cancelled." },
];

const StatBlock = ({ value, label }) => (
  <div className="border-l border-line pl-4 first:border-l-0 first:pl-0 sm:pl-6">
    <p className="font-display text-3xl text-ink sm:text-4xl">{value?.toLocaleString?.("en-IN") ?? "—"}</p>
    <p className="mt-1 text-sm text-ink-muted">{label}</p>
  </div>
);

const Landing = () => {
  const [stats, setStats] = useState(null);
  const [recipient, setRecipient] = useState("B+");

  useEffect(() => {
    userApi.publicStats().then(({ stats: s }) => setStats(s)).catch(() => setStats(null));
  }, []);

  const matches = COMPATIBLE_DONORS[recipient];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-[13px] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-urgent" />
              Emergency blood coordination
            </p>
            <h1 className="mt-5 font-display text-[38px] leading-[1.08] sm:text-[52px]">
              Connecting Lives. Saving Lives.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-muted">
              LifeLink connects patients, blood donors, and healthcare providers to make emergency assistance
              faster and more accessible.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donors" className="btn-primary px-5 py-3">
                <Search size={17} /> Find a blood donor
              </Link>
              <Link to="/request-blood" className="btn-urgent px-5 py-3">
                <Siren size={17} /> Request emergency blood
              </Link>
            </div>
            <p className="mt-5 text-sm text-ink-muted">
              Already helping out?{" "}
              <Link to="/become-donor" className="font-medium text-ink underline underline-offset-4">
                Register as a donor
              </Link>
            </p>
          </div>

          {/* Compatibility panel — the first thing anyone looking for blood actually needs to know. */}
          <div className="card p-6">
            <h2 className="font-sans text-sm font-semibold text-ink-soft">Who can donate to this patient?</h2>
            <p className="mt-1 text-sm text-ink-muted">Pick the patient's blood group.</p>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setRecipient(g)}
                  aria-pressed={recipient === g}
                  className={`rounded-lg border py-2.5 font-display text-[17px] transition-colors ${
                    recipient === g
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink hover:border-line-strong"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-paper p-4">
              <p className="text-sm text-ink-muted">
                A patient with <span className="font-semibold text-ink">{recipient}</span> can safely receive from{" "}
                {matches.length} of 8 groups:
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {BLOOD_GROUPS.map((g) => (
                  <span
                    key={g}
                    className={`rounded-md px-2.5 py-1 text-[13px] font-medium ${
                      matches.includes(g) ? "bg-urgent text-white" : "bg-white text-ink-muted/60 line-through"
                    }`}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to={`/donors?bloodGroup=${encodeURIComponent(recipient)}`}
              className="btn-ghost mt-4 w-full justify-between"
            >
              See {recipient} donors on LifeLink <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <StatBlock value={stats?.registeredDonors} label="Registered donors" />
            <StatBlock value={stats?.hospitalsConnected} label="Hospitals connected" />
            <StatBlock value={stats?.requestsFulfilled} label="Blood requests fulfilled" />
            <StatBlock value={stats?.livesImpacted} label="Lives impacted" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-[28px]">How LifeLink works</h2>
        <p className="mt-2 max-w-xl text-ink-muted">Four steps from "we need blood" to a donor on the phone.</p>

        <ol className="mt-9 grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-white p-6">
              <span className="font-display text-sm text-ink-muted">Step {i + 1}</span>
              <h3 className="mt-2 text-lg leading-snug">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-[28px]">What you can do here</h2>
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, body }) => (
              <div key={title}>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-paper-sunken text-ink-soft">
                  <Icon size={19} />
                </span>
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card flex flex-col p-7">
            <HeartHandshake size={22} className="text-vital" />
            <h3 className="mt-4 text-xl">Give blood</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Add your blood group and city once. We'll only contact you when someone nearby needs your group and
              you're past the 90-day gap.
            </p>
            <Link to="/become-donor" className="btn-primary mt-6 self-start">
              <UserPlus size={16} /> Register as a donor
            </Link>
          </div>
          <div className="card flex flex-col border-urgent/25 bg-urgent-soft p-7">
            <Siren size={22} className="text-urgent" />
            <h3 className="mt-4 text-xl text-urgent-deep">Need blood right now?</h3>
            <p className="mt-2 text-sm leading-relaxed text-urgent-deep/80">
              Raise a request with the hospital name and priority. Every eligible, compatible donor in that city is
              notified the moment you submit.
            </p>
            <Link to="/request-blood" className="btn-urgent mt-6 self-start">
              Request emergency blood
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
