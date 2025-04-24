import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C9F31D',
          dark: '#A5CC17',
          light: '#D4F542',
        },
        background: {
          dark: '#000000',
          light: '#161D26',
          card: '#0B0E12',
        },
        border: {
          DEFAULT: '#333333',
          hover: '#4d4d4d',
          active: '#C9F31D',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, #C9F31DAB 0%, transparent 70%)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, #C9F31D 0%, transparent 70%)',
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      keyframes: {
        pulse: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(1.1)', opacity: '1' },
          '50%': { transform: 'scale(0.7)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'pulse-custom': 'pulse 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.primary.DEFAULT"), 0 0 20px rgba(201, 243, 29, 0.2)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'inner-glow': 'inset 0 0 15px rgba(201, 243, 29, 0.15)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
};
export default config;
