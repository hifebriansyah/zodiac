/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cosmos: {
          950: '#07080D',
          900: '#0C0E17',
          800: '#131726',
          700: '#1C2237',
        },
        parchment: {
          50: '#FAF7F0',
          100: '#F4EFE4',
          200: '#E6DEC8',
          300: '#CFC2A3',
        },
        gold: {
          300: '#F0D7A3',
          400: '#DFC082',
          500: '#C8A45D',
          600: '#9F7E3B',
        },
      },
      animation: {
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 28s linear infinite',
      },
    },
  },
  plugins: [],
};
