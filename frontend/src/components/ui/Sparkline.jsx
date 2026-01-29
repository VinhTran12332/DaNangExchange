export const Sparkline = ({ color = "#00E599" }) => (
    <svg width="100%" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 35 L10 32 L20 36 L30 25 L40 28 L50 15 L60 20 L70 10 L80 18 L90 5 L100 12 L110 8 L120 2" stroke={color} strokeWidth="2" fill="none" />
        <path d="M0 35 L10 32 L20 36 L30 25 L40 28 L50 15 L60 20 L70 10 L80 18 L90 5 L100 12 L110 8 L120 2 V 40 H 0 Z" fill={color} fillOpacity="0.1" />
    </svg>
);
