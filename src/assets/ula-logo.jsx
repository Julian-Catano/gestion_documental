export function ULALogo({ className }) {
  return (
    <div className={`text-white font-bold ${className || ""}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="none" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="40"
          fill="currentColor"
        >
          ULA
        </text>
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );
}
