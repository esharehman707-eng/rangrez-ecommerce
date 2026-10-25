export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-28px)' } },
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        wordIn: { '0%': { opacity: 0, transform: 'translateY(40%)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        kenburns: { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.12)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float: 'float 7s ease-in-out infinite',
        fadeUp: 'fadeUp .8s ease both',
        wordIn: 'wordIn .6s ease both',
        kenburns: 'kenburns 22s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}
