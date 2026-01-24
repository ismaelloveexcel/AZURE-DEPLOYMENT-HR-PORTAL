import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',   // Very light gray
          100: '#f1f5f9',  // Light gray
          200: '#e2e8f0',  // Subtle gray
          600: '#475569',  // Dark blue-gray
          700: '#334155',  // Darker blue-gray
          800: '#1e293b',  // Very dark blue-gray
          900: '#0f172a',  // Almost black blue-gray
        },
        accent: {
          green: '#10b981',    // Emerald for success/positive
          red: '#ef4444',      // Red for errors/danger
          amber: '#f59e0b',    // Amber for warnings
          gray: '#6b7280',     // Gray for neutral
        }
      }
    },
  },
  plugins: [],
} satisfies Config
