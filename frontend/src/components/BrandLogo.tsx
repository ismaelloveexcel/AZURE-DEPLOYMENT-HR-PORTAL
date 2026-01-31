import { HTMLAttributes } from "react";

type BrandLogoVariant = "dark" | "light";
type BrandLogoSize = "sm" | "md" | "lg";

export interface BrandLogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  showWordmark?: boolean;
  stacked?: boolean;
}

const SIZE_MAP: Record<BrandLogoSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

export function BrandLogo({
  variant = "dark",
  size = "md",
  showWordmark = true,
  stacked = false,
  className = "",
  ...props
}: BrandLogoProps) {
  const iconSize = SIZE_MAP[size];
  const isLight = variant === "light";
  const iconFill = isLight ? "#ffffff" : "#102038";
  const accentFill = isLight ? "#92C5FF" : "#2563eb";

  return (
    <div
      className={`brand-logo ${isLight ? "brand-logo--inverted" : ""} ${stacked ? "brand-logo--stacked" : ""} ${className}`.trim()}
      {...props}
    >
      <div
        className="brand-logo__icon"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 64 64"
          role="img"
          aria-label="Baynunah HR"
          focusable="false"
        >
          <path
            d="M16.5 12.8h18.6c8.5 0 15 5.2 15 13 0 5.5-3.5 9.6-8.6 11.4 5.8 1.6 9.4 6 9.4 11.9 0 8-6.7 14.1-17.5 14.1H16.5z"
            fill={iconFill}
          />
          <path
            d="M41.7 26.3c4.1 0 7-2.4 7-6 0-3.8-3.1-6.2-7.4-6.2H22.5v12.2z"
            fill={accentFill}
            opacity={isLight ? 0.6 : 0.75}
          />
          <path
            d="M22.5 53.1h15.8c5 0 8.3-2.8 8.3-7.1 0-4.4-3.4-7.1-8.7-7.1H22.5z"
            fill={accentFill}
            opacity={isLight ? 0.4 : 0.5}
          />
        </svg>
      </div>
      {showWordmark && (
        <div className="brand-logo__wordmark">
          <span className="brand-logo__title">Baynunah HR</span>
          <span className="brand-logo__subtitle">Secure Renewals Portal</span>
        </div>
      )}
    </div>
  );
}
