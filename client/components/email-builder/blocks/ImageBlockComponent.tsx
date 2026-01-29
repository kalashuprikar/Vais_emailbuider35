import React from "react";
import { ImageBlock } from "../types";
import { Upload } from "lucide-react";

interface ImageBlockComponentProps {
  block: ImageBlock;
  isSelected: boolean;
  onSrcChange: (src: string) => void;
  onDimensionChange: (width: number, height: number) => void;
}

export const ImageBlockComponent: React.FC<ImageBlockComponentProps> = ({
  block,
  isSelected,
  onSrcChange,
  onDimensionChange,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (warn if > 1MB)
      if (file.size > 1024 * 1024) {
        console.warn(
          "⚠️ Large image detected! File size: " +
            (file.size / 1024 / 1024).toFixed(2) +
            "MB. Consider using a smaller image to avoid storage issues.",
        );
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onSrcChange(result);
        }
      };
      reader.onerror = () => {
        console.error("❌ Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`relative p-4 transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{ textAlign: block.alignment as any }}
    >
      {block.src ? (
        <div style={{ textAlign: block.alignment as any, overflow: "hidden" }}>
          <img
            src={block.src}
            alt={block.alt || "Image"}
            crossOrigin="anonymous"
            style={{
              width: `${block.width}${block.widthUnit}`,
              height:
                block.heightUnit === "%"
                  ? `${block.height}${block.heightUnit}`
                  : `${block.height}px`,
              display: block.alignment === "center" ? "block" : "inline",
              margin: block.alignment === "center" ? "0 auto" : "0",
              maxWidth: "100%",
              objectFit: "contain",
              boxSizing: "border-box",
            }}
            onError={(e) => {
              console.error("Image failed to load:", block.src);
              (e.target as HTMLImageElement).style.border = "2px solid red";
            }}
          />
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload image</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
