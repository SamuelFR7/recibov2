/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: '"Roboto", Helvetica, Arial, sans-serif '
    },
    fontSize: {
      xs: '1.3rem',
      sm: '1.4rem',
      md: "1.6rem",
      lg: ["2.2rem", '1.3'],
      "2xl": ["3rem"],
      "5xl": ["8rem", 1]
    },
    colors: {
      background: '#F5F7FA',
      black: "#000",
      white: "#fff",
      text: '#404e67',
      'gray-text': "#bbbbbb",
      border: '#ebe9f1',
      primary: '#5FA8AB',
      primaryHover: '#549DA0',
      gray: '#f3f2f7',
      grayHover: '#dedce6',
      warn: '#FF686B',
      warnHover: '#fc5d61',
      modalBg: 'rgba(0, 0, 0, 0.44)'
    },
    boxShadow: {
      'header': '0 4px 24px #22292f1a'
    },
    spacing: {
      0: "0",
      1: "0.4rem",
      2: "0.8rem",
      3: "1.2rem",
      4: "1.6rem",
      5: "2rem",
      6: "2.4rem",
      7: "2.8rem",
      8: "3.2rem",
      9: "3.6rem",
      10: "4rem",
      11: "4.4rem",
      12: "4.8rem",
    },
    keyframes: {
      "fade-in": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      "fade-out": {
        "0%": { opacity: 1 },
        "100%": { opacity: 0 },
      },
    },
    animation: {
      "fade-out": "fade-out 200ms ease-out",
      "fade-in": "fade-in 200ms ease-out"
    },
  },
  plugins: [],
}