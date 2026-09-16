import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo.jsx";

const socials = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "X" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Linkedin, label: "LinkedIn" },
];

const Footer = () => (
  <footer className="mt-20 border-t border-line bg-ink text-white/80">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
      <div className="md:col-span-1">
        <Logo tone="light" />
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
          A shared record of who can give blood, who needs it, and which hospital can take them — so nobody
          has to start from a phone tree.
        </p>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-semibold text-white">Quick links</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/donors" className="hover:text-white">Find a donor</Link></li>
          <li><Link to="/request-blood" className="hover:text-white">Request blood</Link></li>
          <li><Link to="/hospitals" className="hover:text-white">Hospital directory</Link></li>
          <li><Link to="/become-donor" className="hover:text-white">Become a donor</Link></li>
          <li><Link to="/about" className="hover:text-white">About LifeLink</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-semibold text-white">Contact</h3>
        <ul className="space-y-2.5 text-sm">
          <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0" /> +91 **********</li>
          <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0" /> help@lifelink.app</li>
          <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> Bhubaneswar, Odisha, India</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-semibold text-white">In an emergency</h3>
        <p className="text-sm text-white/60">
          LifeLink does not replace emergency services. For an ambulance, call <span className="font-semibold text-white">108</span>.
        </p>
        <div className="mt-4 flex gap-2">
          {socials.map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 hover:border-white/40 hover:text-white"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} LifeLink. Built for faster emergency response.</p>
        <p>Privacy · Terms · Donor safety guidelines</p>
      </div>
    </div>
  </footer>
);

export default Footer;
