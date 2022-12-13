/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: '"Roboto", Helvetica, Arial, sans-serif '
    },  
    fontSize: {
      xsm: '1.16rem',
      sm: ['1.4rem', '1.4rem'],
      md: '2.03rem'
    },
    colors: {
      background: '#F5F7FA',
      black: "#000",
      white: "#fff",
      text: '#404e67',
      grayPrint: '#f5f6fa',
      border: '#ebe9f1',
      primary: '#5FA8AB',
      primaryHover: '#549DA0',
      gray: '#f3f2f7',
      grayHover: '#dedce6'
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
    }
  },
  plugins: [],
}