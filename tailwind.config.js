/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#FF0000',
          'red-dark': '#CC0000',
          orange: '#FF8800',
          'orange-dark': '#CC6600',
          green: '#4CAF50',
          'green-dark': '#388E3C',
          'green-light': '#81C784',
          blue: '#2196F3',
          'blue-dark': '#1976D2',
          'blue-light': '#64B5F6',
          yellow: '#FFEB3B',
          'yellow-dark': '#FBC02D',
          grey: '#9E9E9E',
          'grey-dark': '#616161',
          'grey-light': '#E0E0E0',
          grass: '#7CB342',
          'grass-light': '#AED581',
          water: '#42A5F5',
          'water-light': '#90CAF9',
        },
      },
      fontFamily: {
        pokemon: ['"Press Start 2P"', 'monospace'],
        game: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'pokemon': 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)',
        'pokemon-inner': 'inset 0 2px 4px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
