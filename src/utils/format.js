export const formatDate = (value, opts = {}) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", ...opts })
    : "—";

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : "—";

export const timeAgo = (value) => {
  if (!value) return "—";
  const secs = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (secs < 60) return "just now";
  const units = [
    [60, "minute"], [24, "hour"], [7, "day"], [4.35, "week"], [12, "month"],
  ];
  let n = secs / 60;
  let label = "minute";
  for (let i = 0; i < units.length; i++) {
    if (n < units[i][0]) { label = units[i][1]; break; }
    n = n / units[i][0];
    label = units[i + 1] ? units[i + 1][1] : "year";
  }
  const rounded = Math.floor(n);
  return `${rounded} ${label}${rounded === 1 ? "" : "s"} ago`;
};

export const daysUntil = (value) => Math.ceil((new Date(value) - Date.now()) / 86400000);

export const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export const todayISO = () => new Date().toISOString().split("T")[0];
