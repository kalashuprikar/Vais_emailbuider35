import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VAISFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ratingColors = [
  { num: 1, color: "#d32f2f", label: "Very unsatisfied" },
  { num: 2, color: "#e64a19" },
  { num: 3, color: "#f57c00" },
  { num: 4, color: "#fb8c00" },
  { num: 5, color: "#fbc02d" },
  { num: 6, color: "#9ccc65" },
  { num: 7, color: "#7cb342" },
  { num: 8, color: "#689f38" },
  { num: 9, color: "#26a69a" },
  { num: 10, color: "#00bcd4", label: "Totally satisfied" },
];

export function VAISFeedbackModal({
  open,
  onOpenChange,
}: VAISFeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSendFeedback = () => {
    if (!rating || !comment.trim()) {
      alert("Please provide a rating and comment");
      return;
    }

    console.log("VAIS Feedback submitted:", { rating, comment });
    setRating(null);
    setComment("");
    onOpenChange(false);

    toast({
      title: "Thank you for your feedback!",
      description:
        "We appreciate your input and will use it to improve our service.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-0 w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Rate your experience! 👋
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Main Text */}
          <div className="space-y-2 text-center">
            <p className="text-lg font-bold text-gray-900 leading-relaxed">
              We love to hear from you! How's your experience with the{" "}
              <span className="text-valasys-orange">
                Valasys AI Score
              </span>
              ?
            </p>

            <p className="text-sm text-gray-600 leading-relaxed">
              Your feedback helps us improve our service.
              <br />
              Please share your thoughts and suggestions below.
            </p>

            {/* 1-10 Rating Scale */}
            <div className="flex justify-center gap-1.5 py-4">
              {ratingColors.map(({ num, color }) => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  onMouseEnter={() => setHoveredRating(num)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className={cn(
                    "w-10 h-10 rounded font-bold text-white text-sm transition-all duration-200 hover:scale-110 border-2",
                    rating === num ? "border-gray-800 shadow-lg scale-110" : "border-transparent",
                  )}
                  style={{
                    backgroundColor: color,
                    opacity: hoveredRating !== null && num > hoveredRating ? 0.5 : 1,
                  }}
                  type="button"
                  title={`Rating ${num}`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Rating Labels */}
            <div className="flex justify-between text-xs text-gray-500 px-2 mt-2">
              <span>Very unsatisfied</span>
              <span>Totally satisfied</span>
            </div>
          </div>

          {/* Comment Input */}
          <textarea
            placeholder="Any comment for us?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent min-h-28"
          />

          {/* Submit Button */}
          <Button
            onClick={handleSendFeedback}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-base"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
