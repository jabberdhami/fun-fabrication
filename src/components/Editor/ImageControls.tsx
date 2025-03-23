
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEditor } from './EditorContext';
import { Crop, RefreshCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fabric } from 'fabric';

export const ImageControls: React.FC = () => {
  const { selectedObject, updateObjectProps } = useEditor();

  if (!selectedObject || selectedObject.type !== 'image') {
    return null;
  }

  const imageObject = selectedObject as fabric.Image;
  
  // Image properties
  const flipX = imageObject.flipX || false;
  const flipY = imageObject.flipY || false;
  const scaleX = imageObject.scaleX || 1;
  const scaleY = imageObject.scaleY || 1;
  const angle = imageObject.angle || 0;

  const handleFlipX = () => {
    updateObjectProps({ flipX: !flipX });
  };

  const handleFlipY = () => {
    updateObjectProps({ flipY: !flipY });
  };

  const handleResetRotation = () => {
    updateObjectProps({ angle: 0 });
  };

  const handleRotate90 = () => {
    const newAngle = ((angle + 90) % 360);
    updateObjectProps({ angle: newAngle });
  };

  const handleFilterChange = (filter: string) => {
    try {
      let filters = [];
      
      switch (filter) {
        case 'grayscale':
          filters = [new fabric.Image.filters.Grayscale()];
          break;
        case 'sepia':
          filters = [new fabric.Image.filters.Sepia()];
          break;
        case 'invert':
          filters = [new fabric.Image.filters.Invert()];
          break;
        case 'brightness':
          filters = [new fabric.Image.filters.Brightness({ brightness: 0.1 })];
          break;
        case 'contrast':
          filters = [new fabric.Image.filters.Contrast({ contrast: 0.2 })];
          break;
        case 'none':
        default:
          filters = [];
          break;
      }
      
      imageObject.filters = filters;
      imageObject.applyFilters();
      updateObjectProps({});
      
    } catch (error) {
      console.error('Failed to apply filter:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply image filter',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Transformations */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleFlipX}
        >
          <FlipHorizontal className="h-3.5 w-3.5 mr-1" />
          Flip Horizontal
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleFlipY}
        >
          <FlipVertical className="h-3.5 w-3.5 mr-1" />
          Flip Vertical
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleResetRotation}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Reset Rotation
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleRotate90}
        >
          <Crop className="h-3.5 w-3.5 mr-1" />
          Rotate 90°
        </Button>
      </div>

      {/* Image filters */}
      <div className="space-y-1">
        <Label className="text-xs">Image Filter</Label>
        <div className="grid grid-cols-3 gap-1">
          {['none', 'grayscale', 'sepia', 'invert', 'brightness', 'contrast'].map((filter) => (
            <Button 
              key={filter}
              variant="outline" 
              size="sm" 
              className="h-7 text-xs capitalize"
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
