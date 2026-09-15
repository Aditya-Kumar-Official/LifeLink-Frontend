export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const AVAILABILITY = ["Available", "Unavailable", "Temporarily Unavailable"];
export const EMERGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];
export const REQUEST_STATUS = ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"];
export const RELATIONSHIPS = ["Parent", "Sibling", "Spouse", "Child", "Friend", "Guardian", "Doctor", "Other"];
export const ROLES = ["user", "donor", "hospital", "admin"];

// Donor groups that can safely give to each recipient group.
export const COMPATIBLE_DONORS = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": BLOOD_GROUPS,
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

export const STATUS_STYLE = {
  Pending: "bg-amberish-soft text-amberish",
  Accepted: "bg-vital-soft text-vital",
  Completed: "bg-vital-soft text-vital",
  Rejected: "bg-paper-sunken text-ink-muted",
  Cancelled: "bg-paper-sunken text-ink-muted",
};

export const LEVEL_STYLE = {
  Low: "bg-paper-sunken text-ink-muted",
  Medium: "bg-amberish-soft text-amberish",
  High: "bg-urgent-soft text-urgent",
  Critical: "bg-urgent text-white",
};
