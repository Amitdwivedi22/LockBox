/* eslint-disable no-undef */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-3d': 'float-3d 8s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'bounce-gentle': 'bounce 3s infinite ease-in-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-down': 'slide-down 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'morph': 'morph 8s ease-in-out infinite',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      keyframes: {
        'float-3d': {
          '0%, 100%': { transform: 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg) translateZ(0px)' },
          '25%': { transform: 'translate(-50%, -50%) rotateX(5deg) rotateY(90deg) translateZ(20px)' },
          '50%': { transform: 'translate(-50%, -50%) rotateX(0deg) rotateY(180deg) translateZ(40px)' },
          '75%': { transform: 'translate(-50%, -50%) rotateX(-5deg) rotateY(270deg) translateZ(20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // ...existing animations converted to Tailwind format
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
