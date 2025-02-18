/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{

        primaryBgColor:"#f9fafb",
        sidebar:"#fefeff",
        purple:{
          300:"#e0e7fe",
          400:"#3e38a7",
          600:"#5046e4"
        },
      },  
    },
  },
  plugins: [],
}
