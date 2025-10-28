export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "bg": "rgb(var(--bg))",
        "primaryBg": "rgb(var(--primary))",
        "secondaryBg": "rgb(var(--secondary))",
        "primaryBgHover": "rgb(var(--primaryHover))",
        "primaryText": "rgb(var(--text))",
        "primaryBorder": "rgb(var(--border))",
        "primaryCard": "rgb(var(--card))",
        "primaryMuted": "rgb(var(--muted))",
        "masterTitle": 'var(--masterTitle)',
        "masterCardBg": 'var(--masterCardBg)',
        "cardtext": 'rgb(var(--cardtext))'
      },   

    },
  },
  plugins: [],
}