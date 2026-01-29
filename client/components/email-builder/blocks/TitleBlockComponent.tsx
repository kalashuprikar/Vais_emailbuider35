import React from "react";
import { TitleBlock } from "../types";
import { Edit2 } from "lucide-react";

interface TitleBlockComponentProps {
  block: TitleBlock;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onEditingChange?: (id: string | null) => void;
  onContentChange: (content: string) => void;
}

export const TitleBlockComponent: React.FC<TitleBlockComponentProps> = ({
  block,
  isSelected,
  isEditing,
  onEdit,
  onEditingChange,
  onContentChange,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected && onEditingChange) {
      onEditingChange(block.id);
    }
  };

  const handleEditIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditingChange) {
      onEditingChange(block.id);
    }
  };

  const containerStyle = {
    userSelect: "none" as const,
    width: block.width ? `${block.width}${block.widthUnit || "%"}` : "100%",
    margin: `${block.margin || 0}px`,
    marginLeft: isNaN(block.marginLeft as any)
      ? block.margin || 0
      : block.marginLeft,
    marginRight: isNaN(block.marginRight as any)
      ? block.margin || 0
      : block.marginRight,
    marginTop: isNaN(block.marginTop as any)
      ? block.margin || 0
      : block.marginTop,
    marginBottom: isNaN(block.marginBottom as any)
      ? block.margin || 0
      : block.marginBottom,
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
  };

  const textStyle = {
    fontSize: `${block.fontSize}px`,
    color: block.fontColor,
    backgroundColor: block.backgroundColor,
    textAlign: block.alignment as any,
    fontWeight: block.fontWeight as any,
    margin: 0,
    padding: `${block.paddingTop || block.padding || 8}px ${block.paddingRight || block.padding || 8}px ${block.paddingBottom || block.padding || 8}px ${block.paddingLeft || block.padding || 8}px`,
    userSelect: "none" as const,
    borderRadius: block.borderRadius ? `${block.borderRadius}px` : undefined,
    border: block.borderWidth
      ? `${block.borderWidth}px solid ${block.borderColor}`
      : undefined,
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
    wordWrap: "break-word" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "normal" as const,
  };

  return (
    <div
      className={`relative transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={containerStyle}
    >
      {isEditing ? (
        <textarea
          value={block.content}
          onChange={(e) => onContentChange(e.target.value)}
          onBlur={() => onEditingChange?.(null)}
          autoFocus
          className="w-full border border-valasys-orange rounded px-2 py-1 font-serif"
          style={textStyle}
        />
      ) : (
        <h1 style={textStyle}>{block.content}</h1>
      )}
      {isSelected && !isEditing && (
        <div
          onClick={handleEditIconClick}
          className="absolute top-1 right-1 bg-valasys-orange text-white p-1 rounded cursor-pointer hover:bg-valasys-orange/90 transition-colors"
        >
          <Edit2 className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};
