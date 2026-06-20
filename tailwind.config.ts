import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F0F',
        surface: '#1A1A1A',
        text: '#F5F5F0',
        muted: '#888888',
        accent: '#4A9EFF',
        border: '#2D2D2D',
        paper: '#E8E0D0',
      },
    },
  },
  plugins: [],
}

export default config
