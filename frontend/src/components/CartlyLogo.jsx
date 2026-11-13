export default function CartlyLogo({ size = 26, dark = false }) {
  const body = dark ? '#fff' : '#09090B';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="Cartly"
      style={{ flexShrink: 0 }}
    >
      {/* Cart base */}
      <rect x="5" y="13" width="19" height="11" rx="3.5" fill={body} />
      {/* Handle arc */}
      <path
        d="M3 7h3.2l2.8 17h13l2.8-17H28"
        stroke={body}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wheels */}
      <circle cx="10.5" cy="27" r="2.2" fill={body} />
      <circle cx="20.5" cy="27" r="2.2" fill={body} />
      {/* Lime bolt */}
      <path
        d="M17.8 14.5L14 19.5h3.6L14.2 25l6-7h-3.8l1.4-3.5Z"
        fill="#B7F36B"
      />
    </svg>
  );
}
