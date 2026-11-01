/** @type {import('tailwindcss').Config} */
// One theme for the whole site: cream paper, deep indigo ink, saffron, India green.
// The legacy token names (primary / secondary / accent / dark / light) are kept so existing pages
// pick up the new palette without per-file edits.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#1B1740',
        saffron: { DEFAULT: '#FF9933', deep: '#C2610A' },
        india: '#138808',
        paper: { DEFAULT: '#FBF7F0', line: '#E8DFCF' },

        // primary = indigo
        primary: {
          DEFAULT: '#1B1740',
          50: '#F3F1FF', 100: '#E4E0F7', 200: '#C9C2EA', 300: '#9F95D4',
          400: '#6A5FB0', 500: '#1B1740', 600: '#17133A', 700: '#120F30', 800: '#0E0B26', 900: '#0A081C',
        },
        // secondary = India green
        secondary: {
          DEFAULT: '#138808',
          50: '#E9F6E7', 100: '#CDEBC9', 200: '#9CD697', 300: '#6AC063',
          400: '#2E9E22', 500: '#138808', 600: '#0F6F06', 700: '#0B5605', 800: '#083D03', 900: '#052702',
        },
        // accent = deep saffron (legible as text on paper)
        accent: {
          DEFAULT: '#C2610A',
          50: '#FFF3E6', 100: '#FFE0BF', 200: '#FFC88C', 300: '#FFAE57',
          400: '#FF9933', 500: '#C2610A', 600: '#9E4F08', 700: '#7A3D06', 800: '#562B05', 900: '#331A03',
        },
        // "dark" tokens now resolve to paper surfaces
        dark: {
          bg: '#FBF7F0',
          surface: '#F5EFE3',
          card: '#FFFFFF',
          border: '#E8DFCF',
          muted: '#9A917F',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F5EFE3',
          card: '#FFFFFF',
          border: '#E8DFCF',
          muted: '#6B6480',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradientX 5s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-primary': '0 1px 2px rgba(27, 23, 64, 0.08)',
        'glow-secondary': '0 1px 2px rgba(19, 136, 8, 0.12)',
        'glow-accent': '0 1px 2px rgba(194, 97, 10, 0.12)',
        'card-dark': '0 1px 3px rgba(27, 23, 64, 0.08), 0 8px 24px rgba(27, 23, 64, 0.05)',
        'card-hover': '0 2px 4px rgba(27, 23, 64, 0.08), 0 14px 32px rgba(27, 23, 64, 0.10)',
      },
    },
  },
  plugins: [],
}
