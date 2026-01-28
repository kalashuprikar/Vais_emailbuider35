import React, { useMemo } from "react";
import { HtmlBlock } from "../types";
import { compileHTML, sanitizeHTML } from "../htmlCompiler";

interface HtmlBlockComponentProps {
  block: HtmlBlock;
  isSelected: boolean;
  onContentChange: (content: string) => void;
}

export const HtmlBlockComponent: React.FC<HtmlBlockComponentProps> = ({
  block,
  isSelected,
  onContentChange,
}) => {
  const width = `${block.width}${block.widthUnit}`;

  // Compile HTML with semantic tag handling and sanitize for security
  const compiledHTML = useMemo(() => {
    if (!block.content) {
      return "<div style='color: #999; font-size: 0.875rem;'>Add your HTML here</div>";
    }

    // Sanitize the HTML first (remove scripts, event handlers, etc.)
    const sanitized = sanitizeHTML(block.content);

    // Compile the HTML to handle semantic tags with proper styling
    const compiled = compileHTML(sanitized);

    return compiled;
  }, [block.content]);

  return (
    <div
      className={`relative transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        margin: `${block.margin}px`,
        padding: `${block.padding}px`,
        width: block.widthUnit === "%" ? "100%" : "auto",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: width,
          boxSizing: "border-box",
          overflow: "hidden",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{
          __html: compiledHTML,
        }}
      />
    </div>
  );
};
