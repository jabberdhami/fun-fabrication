
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditor } from './EditorContext';
import { ColorPicker } from './ColorPicker';
import { fabric } from 'fabric';

export const ShapeControls: React.FC = () => {
  const { selectedObject, updateObjectProps } = useEditor();

  if (!selectedObject || (selectedObject.type !== 'rect' && selectedObject.type !== 'circle')) {
    return null;
  }

  // Shape properties
  const fill = selectedObject.fill as string || '#cccccc';
  const stroke = selectedObject.stroke as string || '#000000';
  const strokeWidth = selectedObject.strokeWidth || 0;
  const rx = selectedObject.type === 'rect' ? (selectedObject as fabric.Rect).rx || 0 : 0;
  const ry = selectedObject.type === 'rect' ? (selectedObject as fabric.Rect).ry || 0 : 0;

  const handleFillChange = (color: string) => {
    updateObjectProps({ fill: color });
  };

  const handleStrokeChange = (color: string) => {
    updateObjectProps({ stroke: color });
  };

  const handleStrokeWidthChange = (value: number[]) => {
    updateObjectProps({ strokeWidth: value[0] });
  };

  const handleCornerRadiusChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      if (selectedObject.type === 'rect') {
        // For rect objects, we need to set rx and ry as custom properties
        const rectObj = selectedObject as fabric.Rect;
        rectObj.set({
          rx: numValue,
          ry: numValue
        });
        selectedObject.canvas?.renderAll();
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Fill Color */}
      <ColorPicker 
        color={fill} 
        onChange={handleFillChange} 
        label="Fill Color" 
      />

      {/* Stroke Color */}
      <ColorPicker 
        color={stroke || '#000000'} 
        onChange={handleStrokeChange} 
        label="Border Color" 
      />

      {/* Stroke Width */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label className="text-xs">Border Width</Label>
          <span className="text-xs text-muted-foreground">{strokeWidth}px</span>
        </div>
        <Slider
          value={[strokeWidth]}
          min={0}
          max={20}
          step={1}
          onValueChange={handleStrokeWidthChange}
        />
      </div>

      {/* Corner Radius (for rectangles) */}
      {selectedObject.type === 'rect' && (
        <div className="space-y-1">
          <Label className="text-xs">Corner Radius</Label>
          <Input
            type="number"
            value={rx.toString()}
            onChange={(e) => handleCornerRadiusChange(e.target.value)}
            className="h-8 text-xs"
            min="0"
          />
        </div>
      )}
    </div>
  );
};
