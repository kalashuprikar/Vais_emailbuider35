import React from "react";
import { SocialBlock } from "../types";

interface SocialBlockComponentProps {
  block: SocialBlock;
  isSelected: boolean;
}

const getSocialIconColor = (platform: string): string => {
  const colors: { [key: string]: string } = {
    facebook: "#4267B2",
    twitter: "#000000",
    x: "#000000",
    linkedin: "#0A66C2",
    instagram: "#E4405F",
    pinterest: "#E60023",
    youtube: "#FF0000",
    tiktok: "#000000",
    github: "#333333",
  };
  return colors[platform.toLowerCase()] || "#666666";
};

const getShapeStyle = (shape: string, size: number): string => {
  if (shape === "circle") return "50%";
  if (shape === "rounded") return "6px";
  return "2px";
};

const getSocialIcon = (platform: string, size: number) => {
  const platformLower = platform.toLowerCase();

  const icons: { [key: string]: JSX.Element } = {
    facebook: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    twitter: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M23.953 4.57a10 10 0 002.856-9.58v-1.06h-3.64a10 10 0 00-19.54 0H0v1.06a10 10 0 002.856 9.58M2.5 15.5A7.5 7.5 0 0010 8a7.5 7.5 0 017.5 7.5M21 10.667c-.667 1.333-2 2-3.5 2S16.667 11.333 16 10" />
      </svg>
    ),
    x: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z" />
      </svg>
    ),
    linkedin: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.428-.103.25-.129.599-.129.948v5.429h-3.554s.047-8.814 0-9.752h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.61zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.715 0-.955.77-1.715 1.958-1.715 1.187 0 1.927.76 1.927 1.715 0 .954-.74 1.715-1.97 1.715zm1.946 11.597H3.392V9.956h3.891v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
    instagram: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.52c-1.887 1.887-4.401 2.928-7.074 2.928-2.672 0-5.186-1.04-7.074-2.928-1.887-1.887-2.928-4.401-2.928-7.074 0-2.672 1.04-5.186 2.928-7.074 1.887-1.887 4.401-2.928 7.074-2.928 2.672 0 5.186 1.04 7.074 2.928 1.887 1.887 2.928 4.401 2.928 7.074 0 2.672-1.04 5.186-2.928 7.074z" />
      </svg>
    ),
    youtube: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };

  return icons[platformLower] || null;
};

export const SocialBlockComponent: React.FC<SocialBlockComponentProps> = ({
  block,
  isSelected,
}) => {
  const iconSize =
    block.size === "small" ? 20 : block.size === "medium" ? 32 : 48;

  const padding = iconSize + 12;

  const justifyClass =
    block.alignment === "left"
      ? "justify-start"
      : block.alignment === "right"
        ? "justify-end"
        : "justify-center";

  const width =
    block.widthUnit === "%"
      ? `${block.width}%`
      : `${block.width}px`;

  const borderRadius = getShapeStyle(block.shape, iconSize);

  const getIconBackgroundColor = (platformName: string) => {
    if (block.theme === "colored") {
      return getSocialIconColor(platformName);
    } else if (block.theme === "outlined") {
      return "transparent";
    }
    return "#f0f0f0";
  };

  const getIconColor = (platformName: string) => {
    if (block.theme === "colored") {
      return "#ffffff";
    }
    return getSocialIconColor(platformName);
  };

  return (
    <div
      className={`relative transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        width: width,
        padding: `${block.padding}px`,
        margin: `${block.margin}px`,
      }}
    >
      <div className={`flex gap-${block.spacing} ${justifyClass}`} style={{ gap: `${block.spacing}px` }}>
        {block.platforms.map((platform) => {
          const icon = getSocialIcon(platform.name, iconSize);
          const bgColor = getIconBackgroundColor(platform.name);
          const iconColor = getIconColor(platform.name);
          const borderColor = block.theme === "outlined" ? getSocialIconColor(platform.name) : "transparent";

          return (
            <a
              key={platform.name}
              href={platform.url}
              title={platform.name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: padding,
                height: padding,
                backgroundColor: bgColor,
                borderRadius: borderRadius,
                textDecoration: "none",
                color: iconColor,
                transition: "transform 0.2s",
                border: block.theme === "outlined" ? `2px solid ${borderColor}` : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {icon}
            </a>
          );
        })}
      </div>
    </div>
  );
};
