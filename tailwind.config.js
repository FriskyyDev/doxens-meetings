/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0a0a',
        },
        gray: {
          850: '#1e1e1e',
          950: '#0a0a0a',
        }
      },
      backgroundColor: {
        'primary-dark': '#121212',
        'secondary-dark': '#1e1e1e',
        'card-dark': '#2d2d2d',
      },
      textColor: {
        'primary-dark': '#ffffff',
        'secondary-dark': '#b3b3b3',
      },
      borderColor: {
        'dark': '#333333',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}

