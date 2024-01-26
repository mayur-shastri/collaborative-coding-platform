import { fontFamily } from 'tailwindcss/defaultTheme';
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'm-plus-rounded': ['"M PLUS Rounded 1c"', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#2196f3',
          '50': '#E3F2FD',  
          '100': '#BBDEFB',
          '200': '#90CAF9',
          '300': '#64B5F6',
          '400': '#42A5F5',
          '500': '#2196F3',
          '600': '#1E88E5',
          '700': '#1976D2',
          '800': '#1565C0',
          '900': '#0D47A1',
        },
        success: {
          DEFAULT: '#4caf50',
          '50': '#E8F5E9',
          '100': '#C8E6C9',
          '200': '#A5D6A7',
          '300': '#81C784',
          '400': '#66BB6A',
          '500': '#4CAF50',
          '600': '#43A047',
          '700': '#388E3C',
          '800': '#2E7D32',
          '900': '#1B5E20',
        },
        danger: {
          DEFAULT: '#f44336',
          '50': '#FFEBEE',
          '100': '#FFCDD2',
          '200': '#EF9A9A',
          '300': '#E57373',
          '400': '#EF5350',
          '500': '#F44336',
          '600': '#E53935',
          '700': '#D32F2F',
          '800': '#C62828',
          '900': '#B71C1C',
        },
      },
    },
  },
  plugins: [],
}