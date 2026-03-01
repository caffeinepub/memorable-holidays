import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Review } from "../backend.d.ts";
import {
  useAddReview,
  useDeleteReview,
  useGetReviews,
  useUpdateReview,
} from "../hooks/useQueries";

const defaultForm = {
  guestName: "",
  rating: "5",
  comment: "",
  destination: "",
  travelDate: "",
};

function StarRating({
  rating,
  size = "sm",
}: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? "text-gold fill-gold" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function StarSelector({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${star <= (hover || value) ? "text-gold fill-gold" : "text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { data: reviews = [], isLoading } = useGetReviews();
  const { mutateAsync: addReview, isPending: isAdding } = useAddReview();
  const { mutateAsync: updateReview } = useUpdateReview();
  const { mutateAsync: deleteReview } = useDeleteReview();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [ratingVal, setRatingVal] = useState(5);
  const [publishFilter, setPublishFilter] = useState<
    "all" | "published" | "unpublished"
  >("all");

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    if (!form.guestName.trim() || !form.comment.trim()) {
      toast.error("Guest name and comment required");
      return;
    }
    try {
      await addReview({
        guestName: form.guestName,
        rating: BigInt(ratingVal),
        comment: form.comment,
        destination: form.destination,
        travelDate: form.travelDate,
      });
      toast.success("Review added!");
      setShowModal(false);
      setForm(defaultForm);
      setRatingVal(5);
    } catch {
      toast.error("Failed to add review");
    }
  };

  const handleTogglePublish = async (review: Review) => {
    try {
      await updateReview({ ...review, isPublished: !review.isPublished });
      toast.success(
        review.isPublished ? "Review unpublished" : "Review published!",
      );
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteReview(id);
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
        ).toFixed(1)
      : "–";

  const filteredReviews = reviews.filter((r) => {
    if (publishFilter === "published") return r.isPublished;
    if (publishFilter === "unpublished") return !r.isPublished;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-sidebar border-b border-border px-4 py-5">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              <span className="text-gradient-gold">Reviews</span>
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground font-sans">
                {reviews.length} reviews
              </span>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span className="text-sm font-mono font-semibold text-gold">
                    {avgRating}
                  </span>
                  <span className="text-xs text-muted-foreground font-sans">
                    avg rating
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              {(["all", "published", "unpublished"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setPublishFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-sans font-medium capitalize transition-all ${publishFilter === f ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="gradient-gold text-sidebar font-display font-bold shadow-gold"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Review
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card className="premium-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Star className="w-14 h-14 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-sans">
                {reviews.length === 0
                  ? "No reviews yet."
                  : `No ${publishFilter} reviews.`}
              </p>
              {reviews.length === 0 && (
                <Button
                  onClick={() => setShowModal(true)}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-gold/40 text-gold hover:bg-gold/10 font-sans"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add first review
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReviews.map((review) => (
              <Card
                key={String(review.id)}
                className={`premium-card hover:border-gold/30 transition-all group ${!review.isPublished ? "opacity-70" : ""}`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display font-bold text-foreground">
                        {review.guestName}
                      </p>
                      {review.destination && (
                        <p className="text-xs text-muted-foreground font-sans">
                          {review.destination}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(review)}
                        className={`transition-colors ${review.isPublished ? "text-green-400 hover:text-muted-foreground" : "text-muted-foreground hover:text-green-400"}`}
                        title={review.isPublished ? "Unpublish" : "Publish"}
                      >
                        {review.isPublished ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <StarRating rating={Number(review.rating)} size="md" />

                  <p className="text-sm font-sans text-foreground line-clamp-4">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    {review.travelDate && (
                      <span className="text-xs text-muted-foreground font-sans">
                        {review.travelDate}
                      </span>
                    )}
                    <Badge
                      className={`text-xs border ml-auto ${review.isPublished ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
                    >
                      {review.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Add Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs font-sans">Guest Name *</Label>
              <Input
                value={form.guestName}
                onChange={(e) => update("guestName", e.target.value)}
                placeholder="Priya Sharma"
                className="font-sans text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Rating *</Label>
              <StarSelector value={ratingVal} onChange={setRatingVal} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-sans">Comment *</Label>
              <Textarea
                value={form.comment}
                onChange={(e) => update("comment", e.target.value)}
                placeholder="Write the guest's review here..."
                rows={3}
                className="font-sans text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-sans">Destination</Label>
                <Input
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value)}
                  placeholder="Goa, India"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-sans">Travel Date</Label>
                <Input
                  value={form.travelDate}
                  onChange={(e) => update("travelDate", e.target.value)}
                  placeholder="Jan 2026"
                  className="font-sans text-sm"
                />
              </div>
            </div>
            <Button
              onClick={handleCreate}
              disabled={isAdding}
              className="w-full gradient-gold text-sidebar font-display font-bold"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Star className="w-4 h-4 mr-2" />
              )}
              Add Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
