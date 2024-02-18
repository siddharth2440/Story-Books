// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs','./views/layouts/*.ejs','./views/partials/*.ejs','./views/dashboard/*.ejs'],
  theme: {
    extend: {
      fontFamily:{
        dashBoardFont:["Fredoka","sans-serif"]
      }
    },
  },
  plugins: [],
}