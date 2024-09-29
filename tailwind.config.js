/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {

      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      
      width: {
        bw: '90%',
      },

      margin: {
        bm: 'auto',
      },

      backgroundImage: {
        'mycolor': 'linear-gradient(to right, #04016C, #4A16BD)',
        'mycolor1': 'linear-gradient(to right, #083f9b, #7f56d9)',
        'mycolor2': 'radial-gradient(ellipse 50% 80% at center, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 0.8) 60%, rgba(255, 255, 255, 0) 100%)',
        'mycolor3': 'linear-gradient(to right, #2E08C7 0%, #7E08C7 100%)',
      },
    },
  },
  plugins: [],
}
