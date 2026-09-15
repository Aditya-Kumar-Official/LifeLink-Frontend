/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Clinical teal carries the brand; crimson is reserved for urgency only.
        ink: { DEFAULT: "#0E3339", soft: "#1B4F57", muted: "#5C6B70" },
        paper: { DEFAULT: "#F5F7F7", raised: "#FFFFFF", sunken: "#EAEFEF" },
        line: { DEFAULT: "#DCE4E4", strong: "#C3D0D0" },
        urgent: { DEFAULT: "#C21B2E", soft: "#FBECEE", deep: "#8E1120" },
        vital: { DEFAULT: "#1F7A66", soft: "#E6F2EF" },
        amberish: { DEFAULT: "#B8730E", soft: "#FBF1E2" },
      },
      fontFamily: {
        display: ['"Newsreader"', "Georgia", "serif"],
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,51,57,.06), 0 8px 24px -16px rgba(14,51,57,.24)",
        lift: "0 2px 4px rgba(14,51,57,.06), 0 18px 40px -22px rgba(14,51,57,.35)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
