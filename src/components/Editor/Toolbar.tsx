
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CanvasSizeSelector } from './CanvasSizeSelector';
import { ColorPicker } from './ColorPicker';
import { StickerDialog } from './StickerDialog';
import { useEditor } from './EditorContext';
import { 
  Undo2, 
  Redo2, 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon,
  Trash2, 
  Download, 
  Copy, 
  MoveUp, 
  MoveDown, 
  Layers 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export const Toolbar: React.FC = () => {
  const { 
    undo, 
    redo, 
    addText, 
    addRect, 
    addCircle, 
    addImage, 
    deleteSelected, 
    duplicateSelected, 
    bringForward, 
    sendBackward, 
    bringToFront, 
    sendToBack, 
    downloadCanvas, 
    clearCanvas, 
    backgroundColor, 
    setBackgroundColor, 
    selectedObject, 
    history 
  } = useEditor();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        addImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input value so the same file can be uploaded again
    e.target.value = '';
  };

  const ToolbarButton = ({ 
    icon, 
    label, 
    onClick, 
    disabled = false,
    active = false
  }: { 
    icon: React.ReactNode; 
    label: string; 
    onClick: () => void; 
    disabled?: boolean;
    active?: boolean;
  }) => (
    <div className="has-tooltip">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "h-9 w-9 rounded-md", 
          active && "bg-accent text-accent-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {icon}
      </Button>
      <span className="tooltip bottom-full left-1/2 transform -translate-x-1/2 mb-1">{label}</span>
    </div>
  );

  return (
    <div className="bg-background border-b border-editor-toolbar-border p-2 flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Undo2 className="h-4 w-4" />}
          label="Undo"
          onClick={undo}
          disabled={history.past.length === 0}
        />
        <ToolbarButton
          icon={<Redo2 className="h-4 w-4" />}
          label="Redo"
          onClick={redo}
          disabled={history.future.length === 0}
        />
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <ToolbarButton
          icon={<Type className="h-4 w-4" />}
          label="Add Text"
          onClick={addText}
        />
        <ToolbarButton
          icon={<Square className="h-4 w-4" />}
          label="Add Rectangle"
          onClick={addRect}
        />
        <ToolbarButton
          icon={<Circle className="h-4 w-4" />}
          label="Add Circle"
          onClick={addCircle}
        />
        
        <StickerDialog />
        
        <div className="has-tooltip">
          <label className="cursor-pointer">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md"
              tabIndex={-1}
              asChild
            >
              <div>
                <ImageIcon className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </Button>
          </label>
          <span className="tooltip bottom-full left-1/2 transform -translate-x-1/2 mb-1">Add Image</span>
        </div>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <ToolbarButton
          icon={<Copy className="h-4 w-4" />}
          label="Duplicate"
          onClick={duplicateSelected}
          disabled={!selectedObject}
        />
        <ToolbarButton
          icon={<Trash2 className="h-4 w-4" />}
          label="Delete"
          onClick={deleteSelected}
          disabled={!selectedObject}
        />
        
        <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
        
        <div className="hidden sm:flex items-center gap-1">
          <ToolbarButton
            icon={<MoveUp className="h-4 w-4" />}
            label="Bring Forward"
            onClick={bringForward}
            disabled={!selectedObject}
          />
          <ToolbarButton
            icon={<MoveDown className="h-4 w-4" />}
            label="Send Backward"
            onClick={sendBackward}
            disabled={!selectedObject}
          />
          <ToolbarButton
            icon={<Layers className="h-4 w-4" />}
            label="Bring to Front"
            onClick={bringToFront}
            disabled={!selectedObject}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <ColorPicker
            color={backgroundColor}
            onChange={setBackgroundColor}
            label="Background"
          />
        </div>
        
        <CanvasSizeSelector />
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => downloadCanvas('png')}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
