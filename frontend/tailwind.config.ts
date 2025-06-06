import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#3b82f6',
        'primary-dark': '#2563eb',
        'secondary': '#6366f1',
        'secondary-dark': '#4f46e5',
      },
      textColor: {
        'primary': '#3b82f6',
        'primary-dark': '#2563eb',
        'secondary': '#6366f1',
        'secondary-dark': '#4f46e5',
      },
      borderColor: {
        'primary': '#3b82f6',
        'primary-dark': '#2563eb',
        'secondary': '#6366f1',
        'secondary-dark': '#4f46e5',
      },
      ringColor: {
        'primary': '#3b82f6',
        'secondary': '#6366f1',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config; 