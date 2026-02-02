import React, { useState, useRef, useEffect } from "react";
import { TwoColumnCardBlock } from "../types";
import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TwoColumnCardBlockComponentProps {
  block: TwoColumnCardBlock;
  isSelected: boolean;
  onUpdate: (block: TwoColumnCardBlock) => void;
}

interface FieldToolbarProps {
  cardId: string;
  fieldName: string;
  fieldValue: string;
  onCopy: (value: string, fieldName: string) => void;
  onDelete: (cardId: string, fieldName: string) => void;
}

const FieldToolbar: React.FC<FieldToolbarProps> = ({
  cardId,
  fieldName,
  fieldValue,
  onCopy,
  onDelete,
}) => {
  return (
    <div className="absolute top-1 right-1 flex gap-1 bg-white rounded shadow-lg p-1 z-50">
      <button
        onClick={() => onCopy(fieldValue, fieldName)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Copy"
      >
        <span className="text-xs">📋</span>
      </button>
      <button
        onClick={() => onDelete(cardId, fieldName)}
        className="p-1 hover:bg-red-100 rounded transition-colors"
        title="Delete"
      >
        <span className="text-xs">🗑️</span>
      </button>
    </div>
  );
};

export const TwoColumnCardBlockComponent: React.FC<
  TwoColumnCardBlockComponentProps
> = ({ block, isSelected, onUpdate }) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [resizingCardId, setResizingCardId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedCards = block.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                image: event.target?.result as string,
                imageAlt: file.name,
              }
            : card,
        );
        onUpdate({ ...block, cards: updatedCards });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (cardId: string) => {
    const updatedCards = block.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            image: "",
            imageAlt: "",
            imageWidth: undefined,
            imageHeight: undefined,
          }
        : card,
    );
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleStartEditingField = (cardId: string, fieldName: string) => {
    const card = block.cards.find((c) => c.id === cardId);
    if (card) {
      const value = fieldName === "title" ? card.title : card.description;
      setEditingField(`${cardId}-${fieldName}`);
      setEditingValue(value);
    }
  };

  const handleSaveEdit = (cardId: string, fieldName: string) => {
    const updatedCards = block.cards.map((card) =>
      card.id === cardId
        ? { ...card, [fieldName]: editingValue }
        : card,
    );
    onUpdate({ ...block, cards: updatedCards });
    setEditingField(null);
    setEditingValue("");
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    cardId: string,
    fieldName: string,
  ) => {
    if (e.key === "Enter" && fieldName === "title") {
      handleSaveEdit(cardId, fieldName);
    }
    if (e.key === "Escape") {
      setEditingField(null);
      setEditingValue("");
    }
  };

  const handleCopyStyledTitle = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleCopyStyledDescription = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleDeleteField = (cardId: string, fieldName: string) => {
    const updatedCards = block.cards.map((card) =>
      card.id === cardId
        ? { ...card, [fieldName]: "" }
        : card,
    );
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    cardId: string,
    handle: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingCardId(cardId);
    setResizeHandle(handle);
    setStartX(e.clientX);
    setStartY(e.clientY);

    const card = block.cards.find((c) => c.id === cardId);
    setStartWidth(card?.imageWidth || 300);
    setStartHeight(card?.imageHeight || 200);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeHandle || !resizingCardId) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (resizeHandle) {
        case "se":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "sw":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "ne":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "nw":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "e":
          newWidth = Math.max(100, startWidth + deltaX);
          break;
        case "w":
          newWidth = Math.max(100, startWidth - deltaX);
          break;
        case "n":
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "s":
          newHeight = Math.max(100, startHeight + deltaY);
          break;
      }

      const updatedCards = block.cards.map((card) =>
        card.id === resizingCardId
          ? { ...card, imageWidth: newWidth, imageHeight: newHeight }
          : card,
      );
      onUpdate({ ...block, cards: updatedCards });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      setResizingCardId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    resizeHandle,
    startX,
    startY,
    startWidth,
    startHeight,
    block,
    onUpdate,
    resizingCardId,
  ]);

  return (
    <div
      className={`w-full rounded-lg overflow-hidden ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        width: `${block.width}${block.widthUnit}`,
      }}
    >
      <div className="flex gap-5">
        {block.cards.map((card, index) => (
          <div
            key={card.id}
            className="flex-1 rounded-lg overflow-hidden content-section-hover"
            style={{
              backgroundColor: card.backgroundColor,
              margin: `${card.margin}px`,
              borderRadius: `${card.borderRadius}px`,
            }}
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            {/* Image Section */}
            <div
              className="relative"
              style={{
                borderRadius: `${card.borderRadius}px ${card.borderRadius}px 0 0`,
              }}
            >
              {card.image ? (
                <>
                  <div style={{ padding: "12px" }}>
                    {card.imageLink ? (
                      <a
                        href={
                          card.imageLinkType === "email"
                            ? `mailto:${card.imageLink}`
                            : card.imageLink.startsWith("http")
                              ? card.imageLink
                              : `https://${card.imageLink}`
                        }
                        target={
                          card.imageLinkType === "email" ? undefined : "_blank"
                        }
                        rel={
                          card.imageLinkType === "email"
                            ? undefined
                            : "noopener noreferrer"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        style={{
                          textDecoration: "none",
                          display: "block",
                          width: "100%",
                        }}
                      >
                        <img
                          src={card.image}
                          alt={card.imageAlt || "Card image"}
                          style={{
                            width: card.imageWidth
                              ? `${card.imageWidth}px`
                              : "100%",
                            height: card.imageHeight
                              ? `${card.imageHeight}px`
                              : "auto",
                            maxWidth: "100%",
                            display: "block",
                            objectFit: "cover",
                            borderRadius: `${card.borderRadius}px`,
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    ) : (
                      <img
                        src={card.image}
                        alt={card.imageAlt || "Card image"}
                        style={{
                          width: card.imageWidth
                            ? `${card.imageWidth}px`
                            : "100%",
                          height: card.imageHeight
                            ? `${card.imageHeight}px`
                            : "auto",
                          maxWidth: "100%",
                          display: "block",
                          objectFit: "cover",
                          borderRadius: `${card.borderRadius}px`,
                        }}
                      />
                    )}
                  </div>
                </>
              ) : (
                <label className="flex items-center justify-center w-full h-40 bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors rounded">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, card.id)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Content Section */}
            <div
              style={{
                padding: `${Math.max(12, card.padding)}px`,
                color: card.textColor,
                margin: 0,
                border: "none",
              }}
              className="relative"
            >
              {editingField === `${card.id}-title` ? (
                <>
                  <input
                    type="text"
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => handleSaveEdit(card.id, "title")}
                    onKeyPress={(e) => handleKeyPress(e, card.id, "title")}
                    className="w-full font-bold text-base mb-2 m-0 p-1 border-2 border-valasys-orange rounded"
                    style={{
                      color: card.textColor,
                      backgroundColor: "transparent",
                    }}
                  />
                  <FieldToolbar
                    cardId={card.id}
                    fieldName="title"
                    fieldValue={editingValue}
                    onCopy={(value, fieldName) =>
                      fieldName === "title"
                        ? handleCopyStyledTitle(value)
                        : handleCopyStyledDescription(value)
                    }
                    onDelete={handleDeleteField}
                  />
                </>
              ) : card.title ? (
                <div
                  onMouseEnter={() => setHoveredField(`${card.id}-title`)}
                  onMouseLeave={() => setHoveredField(null)}
                  className="relative"
                >
                  <h3
                    className="font-bold text-base mb-2 m-0 cursor-pointer px-2 py-1 rounded transition-all"
                    style={{
                      color: card.textColor,
                      border:
                        focusedField === `${card.id}-title`
                          ? "2px solid rgb(255, 106, 0)"
                          : hoveredField === `${card.id}-title`
                            ? "2px dotted rgb(255, 106, 0)"
                            : "2px solid transparent",
                    }}
                    onClick={() => setFocusedField(`${card.id}-title`)}
                    onDoubleClick={() =>
                      handleStartEditingField(card.id, "title")
                    }
                    title="Double-click to edit"
                  >
                    {card.title}
                  </h3>
                  {focusedField === `${card.id}-title` && (
                    <FieldToolbar
                      cardId={card.id}
                      fieldName="title"
                      fieldValue={card.title}
                      onCopy={(value, fieldName) =>
                        fieldName === "title"
                          ? handleCopyStyledTitle(value)
                          : handleCopyStyledDescription(value)
                      }
                      onDelete={handleDeleteField}
                    />
                  )}
                </div>
              ) : null}
              {editingField === `${card.id}-description` ? (
                <>
                  <textarea
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => handleSaveEdit(card.id, "description")}
                    onKeyPress={(e) => {
                      if (e.key === "Escape") {
                        setEditingField(null);
                        setEditingValue("");
                      }
                    }}
                    className="w-full text-xs leading-snug m-0 p-1 border-2 border-valasys-orange rounded"
                    style={{
                      color: card.textColor,
                      backgroundColor: "transparent",
                    }}
                    rows={3}
                  />
                  <FieldToolbar
                    cardId={card.id}
                    fieldName="description"
                    fieldValue={editingValue}
                    onCopy={(value, fieldName) =>
                      fieldName === "title"
                        ? handleCopyStyledTitle(value)
                        : handleCopyStyledDescription(value)
                    }
                    onDelete={handleDeleteField}
                  />
                </>
              ) : card.description ? (
                <div
                  onMouseEnter={() => setHoveredField(`${card.id}-description`)}
                  onMouseLeave={() => setHoveredField(null)}
                  className="relative"
                >
                  <p
                    className="text-xs leading-snug m-0 cursor-pointer px-2 py-1 rounded transition-all"
                    style={{
                      color: card.textColor,
                      border:
                        focusedField === `${card.id}-description`
                          ? "2px solid rgb(255, 106, 0)"
                          : hoveredField === `${card.id}-description`
                            ? "2px dotted rgb(255, 106, 0)"
                            : "2px solid transparent",
                    }}
                    onClick={() => setFocusedField(`${card.id}-description`)}
                    onDoubleClick={() =>
                      handleStartEditingField(card.id, "description")
                    }
                    title="Double-click to edit"
                  >
                    {card.description}
                  </p>
                  {focusedField === `${card.id}-description` && (
                    <FieldToolbar
                      cardId={card.id}
                      fieldName="description"
                      fieldValue={card.description}
                      onCopy={(value, fieldName) =>
                        fieldName === "title"
                          ? handleCopyStyledTitle(value)
                          : handleCopyStyledDescription(value)
                      }
                      onDelete={handleDeleteField}
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
