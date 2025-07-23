module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
        fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      }
      },
    },
  },
  plugins: [],
}