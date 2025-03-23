
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  '#000000', '#FFFFFF', '#F44336', '#E91E63', '#9C27B0', 
  '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', 
  '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', 
  '#607D8B'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange, 
  label,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={pickerRef}>
      {label && (
        <div className="text-xs font-medium mb-1 text-muted-foreground">{label}</div>
      )}
      <div className="flex items-center">
        <button
          type="button"
          className="h-6 w-6 rounded-md border border-input shadow-sm transition-all hover:shadow-md"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select color"
        />
        <div className="ml-2 text-xs font-mono">{color.toUpperCase()}</div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 p-2 bg-white rounded-md shadow-glass-md border border-border animate-fade-in">
          <div className="grid grid-cols-7 gap-1">
            {DEFAULT_COLORS.map((c) => (
              <button
                key={c}
                className={cn(
                  "h-5 w-5 rounded-sm border transition-transform hover:scale-110",
                  color === c ? "ring-2 ring-offset-1 ring-primary" : "border-input"
                )}
                style={{ backgroundColor: c }}
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                }}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
          <div className="mt-2 border-t pt-2">
            <label className="text-xs text-muted-foreground mb-1 block">Custom color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-6 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
