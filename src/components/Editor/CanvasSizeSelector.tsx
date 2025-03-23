
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Maximize2 
} from 'lucide-react';
import { useEditor, CanvasSize } from './EditorContext';
import { toast } from '@/hooks/use-toast';

export const CanvasSizeSelector: React.FC = () => {
  const { currentCanvasSize, setCurrentCanvasSize, canvasSizes } = useEditor();
  const [customWidth, setCustomWidth] = useState<string>(currentCanvasSize.width.toString());
  const [customHeight, setCustomHeight] = useState<string>(currentCanvasSize.height.toString());
  const [open, setOpen] = useState(false);

  // Map size names to icons
  const getIconForSize = (name: string) => {
    switch (name) {
      case 'Instagram Post':
        return <Instagram className="h-4 w-4" />;
      case 'Instagram Story':
        return <Instagram className="h-4 w-4" />;
      case 'Facebook Post':
        return <Facebook className="h-4 w-4" />;
      case 'Twitter Post':
        return <Twitter className="h-4 w-4" />;
      case 'YouTube Thumbnail':
        return <Youtube className="h-4 w-4" />;
      case 'Custom':
        return <Maximize2 className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const handleSelectSize = (size: CanvasSize) => {
    setCurrentCanvasSize(size);
    setOpen(false);
    
    // Update custom size inputs to match selected size
    setCustomWidth(size.width.toString());
    setCustomHeight(size.height.toString());
    
    toast({
      description: `Canvas size changed to ${size.name}`,
    });
  };

  const handleApplyCustomSize = () => {
    const width = parseInt(customWidth, 10);
    const height = parseInt(customHeight, 10);
    
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      toast({
        title: 'Invalid dimensions',
        description: 'Please enter valid positive numbers for width and height',
        variant: 'destructive',
      });
      return;
    }
    
    // Apply a reasonable limit
    const MAX_DIMENSION = 4000;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      toast({
        title: 'Dimensions too large',
        description: `Maximum allowed dimension is ${MAX_DIMENSION}px`,
        variant: 'destructive',
      });
      return;
    }
    
    setCurrentCanvasSize({
      name: 'Custom',
      width,
      height,
    });
    
    setOpen(false);
    
    toast({
      description: `Canvas size changed to ${width}×${height}px`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 px-2 text-xs flex items-center gap-1">
          <span className="hidden sm:inline-block">{currentCanvasSize.name}</span>
          <span className="inline-block sm:hidden">Size</span>
          <span className="text-xs text-muted-foreground ml-1">
            {currentCanvasSize.width} × {currentCanvasSize.height}px
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Canvas Size</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {canvasSizes.map((size) => (
              <button
                key={size.name}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border gap-2 transition-all duration-200 hover:bg-accent ${
                  currentCanvasSize.name === size.name 
                    ? 'bg-accent text-accent-foreground border-primary/30' 
                    : 'text-muted-foreground border-border hover:text-foreground'
                }`}
                onClick={() => handleSelectSize(size)}
              >
                <div className="h-8 w-8 flex items-center justify-center text-primary">
                  {getIconForSize(size.name)}
                </div>
                <div className="text-xs font-medium">{size.name}</div>
                <div className="text-xs text-muted-foreground">
                  {size.width} × {size.height}px
                </div>
              </button>
            ))}
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center">
              <Maximize2 className="h-4 w-4 mr-2 text-primary" />
              <h4 className="text-sm font-medium">Custom Size</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="width" className="text-xs">Width (px)</Label>
                <Input
                  id="width"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="h-8 text-sm"
                  type="number"
                  min="1"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="height" className="text-xs">Height (px)</Label>
                <Input
                  id="height"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="h-8 text-sm"
                  type="number"
                  min="1"
                />
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full mt-2" 
              onClick={handleApplyCustomSize}
            >
              Apply Custom Size
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
