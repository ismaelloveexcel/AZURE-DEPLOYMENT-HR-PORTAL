import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',   // Very light gray - backgrounds
          100: '#f1f5f9',  // Light gray - alternating rows
          200: '#e2e8f0',  // Border gray - dividers
          300: '#cbd5e1',  // Slightly darker for hover
          600: '#475569',  // Dark blue-gray - secondary text
          700: '#334155',  // Darker blue-gray
          800: '#1e293b',  // Very dark blue-gray - main text
          900: '#0f172a',  // Almost black - headers
        },
        accent: {
          green: '#10b981',    // Emerald for success/positive/icons
          red: '#ef4444',      // Red for errors/danger
          amber: '#f59e0b',    // Amber for warnings
          gray: '#6b7280',     // Gray for neutral/secondary
        },
        // Design System specific aliases
        'ds-white': '#FFFFFF',
        'ds-text': '#1e3a5f',
        'ds-icon': '#10b981',
        'ds-border': '#e2e8f0',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'input': '8px',   // For inputs
        'card': '12px',   // For cards
        'button': '8px',  // For buttons
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
    },
  },
  plugins: [],
} satisfies Config
