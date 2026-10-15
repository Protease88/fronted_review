/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 纸感底色：宣纸白 / 抬升面 / 下沉面 / 暖色描边
        paper: {
          DEFAULT: '#FAF8F4',
          raised: '#FFFFFF',
          sunken: '#F3EFE8',
          line: '#E7E1D7',
          'line-soft': '#F0EBE3',
        },
        // 墨色文字：正文 / 次要 / 弱化
        ink: {
          DEFAULT: '#1C1917',
          soft: '#57534E',
          faint: '#8C8579',
        },
        // 主色：深松绿
        moss: {
          50: '#EEF5F1',
          100: '#D8E9E1',
          200: '#AFCFC0',
          300: '#7FB09C',
          400: '#3D8F73',
          500: '#1F7A61',
          600: '#14654F',
          700: '#0E4B3B',
          800: '#0A3629',
        },
        // 强调色：赭石
        ochre: {
          100: '#F6E7DC',
          300: '#E0A173',
          400: '#C8703A',
          500: '#C0562F',
          600: '#A24422',
        },
        // 功能与分类色：底色 / 文字 / 色条
        tone: {
          clay: '#B4721F',
          teal: '#3D7A75',
          pine: '#14654F',
          stone: '#8C8579',
          success: '#2E7D5B',
          warning: '#B4721F',
          danger: '#B23A2E',
        },
      },
      fontFamily: {
        // 标题：西文旧式衬线 + 中文宋体系，营造编辑纸感
        display: [
          'Georgia',
          '"Times New Roman"',
          '"Songti SC"',
          '"STSong"',
          '"Noto Serif SC"',
          'SimSun',
          'serif',
        ],
        // 正文：中文优先的无衬线栈
        sans: [
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"Microsoft YaHei"',
          '"Hiragino Sans GB"',
          '"Noto Sans SC"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SFMono-Regular"',
          'Menlo',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        'display-lg': ['3.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'display-md': ['2.5rem', { lineHeight: '1.26', letterSpacing: '-0.01em' }],
        'title-md': ['1.6rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.78' }],
        nav: ['1.0625rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        card: '14px',
        ctrl: '10px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,25,23,0.04), 0 4px 16px -8px rgba(28,25,23,0.10)',
        lift: '0 2px 4px rgba(28,25,23,0.05), 0 16px 34px -14px rgba(28,25,23,0.20)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      },
      transitionTimingFunction: {
        paper: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'grow-x': {
          '0%': { width: '0' },
          '100%': { width: 'var(--grow-to, 100%)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-8px,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22,0.61,0.36,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'grow-x': 'grow-x 0.9s cubic-bezier(0.22,0.61,0.36,1) both',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
