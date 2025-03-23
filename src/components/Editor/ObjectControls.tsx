
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditor } from './EditorContext';
import { ColorPicker } from './ColorPicker';

export const ObjectControls: React.FC = () => {
  const { selectedObject, updateObjectProps } = useEditor();

  if (!selectedObject) return null;

  const handlePositionChange = (axis: 'left' | 'top', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateObjectProps({ [axis]: numValue });
    }
  };

  const handleSizeChange = (dimension: 'width' | 'height' | 'radius', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateObjectProps({ [dimension]: numValue });
    }
  };

  const handleOpacityChange = (value: number[]) => {
    updateObjectProps({ opacity: value[0] });
  };

  const handleRotationChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateObjectProps({ angle: numValue });
    }
  };

  // Get object properties with fallbacks for unset values
  const left = selectedObject.left?.toFixed(0) || '0';
  const top = selectedObject.top?.toFixed(0) || '0';
  const width = (selectedObject.width || 0).toFixed(0);
  const height = (selectedObject.height || 0).toFixed(0);
  const radius = (selectedObject as any).radius?.toFixed(0) || '0';
  const opacity = selectedObject.opacity || 1;
  const angle = selectedObject.angle?.toFixed(0) || '0';
  
  // Check if object has these properties to determine what inputs to show
  const hasWidth = typeof selectedObject.width !== 'undefined';
  const hasHeight = typeof selectedObject.height !== 'undefined';
  const hasRadius = typeof (selectedObject as any).radius !== 'undefined';

  return (
    <div className="space-y-3">
      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">X Position</Label>
          <Input
            type="number"
            value={left}
            onChange={(e) => handlePositionChange('left', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Y Position</Label>
          <Input
            type="number"
            value={top}
            onChange={(e) => handlePositionChange('top', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Size */}
      {(hasWidth || hasHeight) && (
        <div className="grid grid-cols-2 gap-2">
          {hasWidth && (
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="h-8 text-xs"
                min="1"
              />
            </div>
          )}
          {hasHeight && (
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="h-8 text-xs"
                min="1"
              />
            </div>
          )}
        </div>
      )}

      {/* Radius for circle */}
      {hasRadius && (
        <div className="space-y-1">
          <Label className="text-xs">Radius</Label>
          <Input
            type="number"
            value={radius}
            onChange={(e) => handleSizeChange('radius', e.target.value)}
            className="h-8 text-xs"
            min="1"
          />
        </div>
      )}

      {/* Rotation */}
      <div className="space-y-1">
        <Label className="text-xs">Rotation (degrees)</Label>
        <Input
          type="number"
          value={angle}
          onChange={(e) => handleRotationChange(e.target.value)}
          className="h-8 text-xs"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label className="text-xs">Opacity</Label>
          <span className="text-xs text-muted-foreground">{Math.round(opacity * 100)}%</span>
        </div>
        <Slider
          value={[opacity]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleOpacityChange}
        />
      </div>
    </div>
  );
};
