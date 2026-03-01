import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Anchor,
  Calendar,
  Copy,
  DollarSign,
  GripVertical,
  Hotel,
  Image,
  Plus,
  Star,
  Tag,
  Trash2,
  Type,
} from "lucide-react";
import { useRef, useState } from "react";
import type { ContentBlock } from "../../lib/packageStore";

const BLOCK_TYPES: {
  type: ContentBlock["type"];
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    type: "text",
    label: "Text Block",
    icon: Type,
    color: "bg-blue-100 text-blue-700",
  },
  {
    type: "image",
    label: "Image",
    icon: Image,
    color: "bg-purple-100 text-purple-700",
  },
  {
    type: "hotel",
    label: "Hotel Details",
    icon: Hotel,
    color: "bg-amber-100 text-amber-700",
  },
  {
    type: "events",
    label: "Events",
    icon: Calendar,
    color: "bg-green-100 text-green-700",
  },
  {
    type: "rates",
    label: "Rate Table",
    icon: DollarSign,
    color: "bg-teal/10 text-teal",
  },
  {
    type: "offers",
    label: "Offers",
    icon: Tag,
    color: "bg-red-100 text-red-700",
  },
  {
    type: "highlights",
    label: "Highlights",
    icon: Star,
    color: "bg-gold/10 text-gold-dark",
  },
  {
    type: "boating",
    label: "Boating",
    icon: Anchor,
    color: "bg-cyan-100 text-cyan-700",
  },
];

interface Props {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function DragDropEditor({ blocks, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [clipboard, setClipboard] = useState<ContentBlock | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      title: BLOCK_TYPES.find((b) => b.type === type)?.label || type,
      content: "",
    };
    onChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const copyBlock = (block: ContentBlock) => {
    setClipboard({ ...block, id: `block-${Date.now()}` });
  };

  const pasteBlock = () => {
    if (clipboard) {
      onChange([...blocks, { ...clipboard, id: `block-${Date.now()}` }]);
    }
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndex.current = index;
  };

  const handleDrop = () => {
    if (dragIndex === null || dragOverIndex.current === null) return;
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dragOverIndex.current, 0, removed);
    onChange(newBlocks);
    setDragIndex(null);
    dragOverIndex.current = null;
  };

  const handleImageUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateBlock(id, { imageUrl: url, content: file.name });
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-lg text-foreground">
            Content Blocks
          </CardTitle>
          {clipboard && (
            <Button
              size="sm"
              variant="outline"
              onClick={pasteBlock}
              className="font-sans text-xs"
            >
              Paste Block
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Block Buttons */}
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-sans font-medium ${color} hover:opacity-80 transition-opacity`}
            >
              <Icon className="w-3 h-3" />
              <Plus className="w-2.5 h-2.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Blocks List */}
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-sans text-sm border-2 border-dashed border-border rounded-lg">
            Add content blocks above to build your package
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, index) => {
              const blockType = BLOCK_TYPES.find((b) => b.type === block.type);
              const Icon = blockType?.icon || Type;
              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  className={`border border-border rounded-lg bg-card transition-opacity ${
                    dragIndex === index ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-2 p-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${blockType?.color || ""}`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === block.id ? (
                        <Input
                          value={block.title}
                          onChange={(e) =>
                            updateBlock(block.id, { title: e.target.value })
                          }
                          onBlur={() => setEditingId(null)}
                          autoFocus
                          className="h-6 text-xs font-sans py-0"
                        />
                      ) : (
                        <button
                          type="button"
                          className="text-sm font-sans font-medium truncate cursor-pointer hover:text-teal text-left w-full"
                          onClick={() => setEditingId(block.id)}
                        >
                          {block.title}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyBlock(block)}
                        className="p-1 hover:text-teal transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="p-1 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content Editor */}
                  <div className="px-3 pb-3">
                    {block.type === "image" ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handleImageUpload(block.id, e)}
                          className="text-xs font-sans w-full"
                        />
                        {block.imageUrl && (
                          <img
                            src={block.imageUrl}
                            alt="preview"
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                      </div>
                    ) : (
                      <Textarea
                        value={block.content}
                        onChange={(e) =>
                          updateBlock(block.id, { content: e.target.value })
                        }
                        placeholder={`Enter ${block.title.toLowerCase()} content...`}
                        rows={2}
                        className="text-xs font-sans resize-none"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
