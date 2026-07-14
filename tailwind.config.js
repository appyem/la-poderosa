// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta Multi-Tenant: Se inyectará dinámicamente, pero estos son los defaults de "LA PODEROSA"
        brand: {
          DEFAULT: '#E50914', // Rojo poderoso (Netflix style). Se cambiará vía CSS variables si el cliente lo requiere.
          light: '#FF3D47',
          dark: '#B20710',
        },
        dark: {
          bg: '#0A0A0A',       // Fondo principal profundo
          surface: '#141414',  // Tarjetas y módulos
          elevated: '#1F1F1F', // Elementos flotantes (menús, modales)
          border: '#2A2A2A',   // Bordes sutiles
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA', // Zinc 400
          muted: '#71717A',     // Zinc 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}