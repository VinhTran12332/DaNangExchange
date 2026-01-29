/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds - Deep Fintech Navy
                bg: {
                    main: '#0A0F1C',    // Darker, deeper navy
                    card: '#111827',    // Slightly lighter for cards
                    hover: '#1F2937',   // Hover state
                    glass: 'rgba(17, 24, 39, 0.7)', // Glassmorphism
                },
                // Primary Brand - Trust & Growth (Emerald)
                primary: {
                    DEFAULT: '#10B981', // Standard Emerald
                    glow: '#34D399',     // Neon glow for charts/actives
                    dim: 'rgba(16, 185, 129, 0.1)' // Background tint
                },
                // Secondary - Premium (Gold)
                accent: {
                    gold: '#F59E0B',     // Gold for VIP/Premium features
                    blue: '#3B82F6',     // Trust blue for standard links
                },
                // Text Hierachy
                text: {
                    main: '#F9FAFB',     // White-ish
                    muted: '#9CA3AF',    // Gray-400
                    subtle: '#6B7280',   // Gray-500
                },
                border: {
                    subtle: '#374151',   // Gray-700
                    highlight: '#10B981' // Primary border
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'], // Professional Heading Font
                body: ['Inter', 'sans-serif'], // Readable Body Font
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to right bottom, #0A0F1C, #111827, #064E3B)', // Subtle gradient
            }
        },
    },
    plugins: [],
}
