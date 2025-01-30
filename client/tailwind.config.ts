import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, #C9F31DAB 0%, transparent 70%)',
      },
      keyframes: {
        pulse: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(2.5)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Define the custom animation using the keyframes
      animation: {
        'pulse-custom': 'pulse 2s infinite', // 2 seconds duration and infinite loop
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
};
export default config;
