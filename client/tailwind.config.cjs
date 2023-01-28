/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      '7.5xl': ['5.25rem', '5.25rem' ],
      '4xl': ['36px', '40px'],
      '2.5xl': ['28px', '32px'],
      'sm': ['14px', '14px'],
      '5xl': ['48px', '48px'],
      'xl': ['18.92px', '18.92px']
    },
    extend: {
      backgroundColor: {
        'sky-blue': '#2F80ED',
        'banana-yellow': '#F2C94C',
      }
    },
  },
  plugins: [],
};
