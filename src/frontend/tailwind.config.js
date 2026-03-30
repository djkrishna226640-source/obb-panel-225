/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        'fire-orange': 'oklch(var(--fire-orange) / <alpha-value>)',
        'fire-amber': 'oklch(var(--fire-amber) / <alpha-value>)',
        'fire-red': 'oklch(var(--fire-red) / <alpha-value>)',
        'surface': 'oklch(var(--surface) / <alpha-value>)',
        'surface-2': 'oklch(var(--surface-2) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 138, 42, 0.4), 0 0 40px rgba(255, 138, 42, 0.15)',
        'glow-orange-sm': '0 0 10px rgba(255, 138, 42, 0.35)',
        'card-dark': 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.5)',
      },
      animation: {
        'ember-float': 'ember-float 3s ease-in-out infinite',
        'ember-rise': 'ember-rise 4s ease-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'ember-float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.8' },
          '50%': { transform: 'translateY(-20px) translateX(5px) scale(0.8)', opacity: '0.4' },
        },
        'ember-rise': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '1' },
          '100%': { transform: 'translateY(-120px) translateX(20px)', opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 138, 42, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 138, 42, 0.7)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
