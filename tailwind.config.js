/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(230 70% 50%)',
        accent: 'hsl(170 70% 45%)',
        bg: 'hsl(220 20% 12%)',
        surface: 'hsl(220 20% 16%)',
        text: 'hsl(220 10% 92%)',
        muted: 'hsl(220 10% 60%)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.1)',
        'modal': '0 12px 32px hsla(0, 0%, 0%, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.2, 0, 0.2, 1)',
        'slide-up': 'slideUp 400ms cubic-bezier(0.2, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}