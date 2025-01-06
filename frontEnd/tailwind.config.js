/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#16b91a',
        btnColor: '#81c784',
        btnColorHover: '#81c745',
        TextColor: '#ffff',
        textInput: '#000',
        deleteColor: '#ef4444',
        deleteColorHover: '#ef4422',
      },
    },
  },
  plugins: [],
};