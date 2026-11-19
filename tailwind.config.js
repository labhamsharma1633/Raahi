/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        raahi: {
          bg: '#EEF4F8',        // Pale / light-blue page background
          bgSubtle: '#E2ECF2',
          surface: '#FFFFFF',
          teal: {
            DEFAULT: '#0D3B3E',  // Dark teal hero & primary brand color
            dark: '#08282A',
            light: '#135155',
            muted: '#206368',
            surface: '#E8F3F4'
          },
          accent: {
            teal: '#0D9488',
            mint: '#14B8A6',
            amber: '#D97706',
            amberLight: '#FEF3C7',
            coral: '#E11D48'
          },
          text: {
            main: '#0F172A',
            sub: '#475569',
            muted: '#64748B',
            light: '#F8FAFC'
          },
          border: '#D8E5EE'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px'
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(13, 59, 62, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -4px rgba(15, 23, 42, 0.08)',
        'hero': '0 20px 40px -10px rgba(13, 59, 62, 0.3)'
      }
    },
  },
  plugins: [],
}
