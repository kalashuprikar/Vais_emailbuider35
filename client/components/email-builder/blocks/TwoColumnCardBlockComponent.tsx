import React, { useState, useRef, useEffect } from "react";
import { TwoColumnCardBlock } from "../types";
import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TwoColumnCardBlockComponentProps {
  block: TwoColumnCardBlock;
  isSelected: boolean;
  onUpdate: (block: TwoColumnCardBlock) => void;
}

export const TwoColumnCardBlockComponent: React.FC<
  TwoColumnCardBlockComponentProps
> = ({ block, isSelected, onUpdate }) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [resizingCardId, setResizingCardId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: string
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
            : card
        );
        onUpdate({ ...block, cards: updatedCards });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (cardId: string) => {
    const updatedCards = block.cards.map((card) =>
      card.id === cardId
        ? { ...card, image: "", imageAlt: "", imageWidth: undefined, imageHeight: undefined }
        : card
    );
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    cardId: string,
    handle: string
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
          : card
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
  }, [isResizing, resizeHandle, startX, startY, startWidth, startHeight, block, onUpdate, resizingCardId]);

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
            className="flex-1 rounded-lg overflow-hidden"
            style={{
              backgroundColor: card.backgroundColor,
              margin: `${card.margin}px`,
              borderRadius: `${card.borderRadius}px`,
            }}
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            {/* Image Section */}
            <div className="relative" style={{ borderRadius: `${card.borderRadius}px ${card.borderRadius}px 0 0` }}>
              {card.image ? (
                <>
                  <img
                    src={card.image}
                    alt={card.imageAlt || "Card image"}
                    style={{
                      width: card.imageWidth ? `${card.imageWidth}px` : "auto",
                      height: card.imageHeight ? `${card.imageHeight}px` : "auto",
                      maxWidth: "100%",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />

                  {/* Image Overlay */}
                  {hoveredCardId === card.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-t">
                      <div className="flex gap-3 items-center">
                        <label className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all">
                          <Upload className="w-6 h-6 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, card.id)}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(card.id);
                          }}
                          className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all"
                          title="Delete image"
                        >
                          <Trash2 className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resize Handles */}
                  {hoveredCardId === card.id && (
                    <>
                      {[
                        { pos: "nw", cursor: "nw-resize", top: "-4px", left: "-4px" },
                        { pos: "ne", cursor: "ne-resize", top: "-4px", right: "-4px" },
                        { pos: "sw", cursor: "sw-resize", bottom: "-4px", left: "-4px" },
                        { pos: "se", cursor: "se-resize", bottom: "-4px", right: "-4px" },
                      ].map((handle) => (
                        <div
                          key={handle.pos}
                          onMouseDown={(e) =>
                            handleResizeStart(e, card.id, handle.pos)
                          }
                          style={{
                            position: "absolute",
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#FF6B35",
                            border: "2px solid white",
                            borderRadius: "2px",
                            cursor: handle.cursor,
                            zIndex: 40,
                            ...(handle as any).top ? { top: (handle as any).top } : {},
                            ...(handle as any).bottom
                              ? { bottom: (handle as any).bottom }
                              : {},
                            ...(handle as any).left ? { left: (handle as any).left } : {},
                            ...(handle as any).right
                              ? { right: (handle as any).right }
                              : {},
                          }}
                          title={`Drag to resize (${handle.pos})`}
                        />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload</p>
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
            <div style={{ padding: `${card.padding}px`, color: card.textColor }}>
              <h3 className="font-bold text-lg mb-3">{card.title}</h3>
              <p className="text-sm leading-relaxed">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
