// components/Logo.tsx
import { useTheme } from "@/lib/providers/ThemeProvider";

const Logo = ({ fillColor = "#000000", darkmode = "#ffffffff" }) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? darkmode : fillColor;

  return (
    <svg
      width="120"
      height="35"
      viewBox="0 0 120 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-24 md:w-28"
    >
      <circle cx="17" cy="17.5" r="15" fill="#90E36D" />
      <path
        d="M11 22.5V12.5L17 18L23 12.5V22.5"
        stroke="#1F2937"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="40"
        y="24"
        fontFamily="inherit"
        fontSize="20"
        fontWeight="700"
        fill={color}
      >
        MeGo
      </text>
    </svg>
  );
};

export default Logo;
