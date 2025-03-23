
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useEditor } from './EditorContext';
import { ColorPicker } from './ColorPicker';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { fabric } from 'fabric';

const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
];

export const TextControls: React.FC = () => {
  const { selectedObject, updateObjectProps } = useEditor();

  if (!selectedObject || (selectedObject.type !== 'text' && selectedObject.type !== 'textbox')) {
    return null;
  }

  const textObject = selectedObject as fabric.Textbox;
  
  // Text properties
  const text = textObject.text || '';
  const fontFamily = textObject.fontFamily || 'Inter';
  const fontSize = textObject.fontSize || 20;
  const fontWeight = textObject.fontWeight || 'normal';
  const fontStyle = textObject.fontStyle || 'normal';
  const underline = textObject.underline || false;
  const textAlign = textObject.textAlign || 'left';
  const fill = textObject.fill as string || '#000000';
  const charSpacing = textObject.charSpacing || 0;
  const lineHeight = textObject.lineHeight || 1.2;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    textObject.set({ text: e.target.value });
    selectedObject.canvas?.renderAll();
  };

  const handleFontFamilyChange = (value: string) => {
    textObject.set({ fontFamily: value });
    selectedObject.canvas?.renderAll();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      textObject.set({ fontSize: numValue });
      selectedObject.canvas?.renderAll();
    }
  };

  const handleFontStyleChange = (value: string[]) => {
    const bold = value.includes('bold');
    const italic = value.includes('italic');
    const textUnderline = value.includes('underline');
    
    textObject.set({
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      underline: textUnderline
    });
    selectedObject.canvas?.renderAll();
  };

  const handleTextAlignChange = (value: string) => {
    textObject.set({ textAlign: value });
    selectedObject.canvas?.renderAll();
  };

  const handleFillChange = (color: string) => {
    updateObjectProps({ fill: color });
  };

  const handleCharSpacingChange = (value: number[]) => {
    textObject.set({ charSpacing: value[0] });
    selectedObject.canvas?.renderAll();
  };

  const handleLineHeightChange = (value: number[]) => {
    textObject.set({ lineHeight: value[0] });
    selectedObject.canvas?.renderAll();
  };

  // Determine which style buttons are active
  const activeStyles = [];
  if (fontWeight === 'bold') activeStyles.push('bold');
  if (fontStyle === 'italic') activeStyles.push('italic');
  if (underline) activeStyles.push('underline');

  return (
    <div className="space-y-3">
      {/* Text Content */}
      <div className="space-y-1">
        <Label className="text-xs">Text</Label>
        <Input
          value={text}
          onChange={handleTextChange}
          className="h-8 text-xs"
        />
      </div>

      {/* Font Family */}
      <div className="space-y-1">
        <Label className="text-xs">Font</Label>
        <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font} className="text-xs">
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-1">
        <Label className="text-xs">Font Size</Label>
        <Input
          type="number"
          value={fontSize.toString()}
          onChange={handleFontSizeChange}
          className="h-8 text-xs"
          min="1"
        />
      </div>

      {/* Text Color */}
      <ColorPicker 
        color={fill} 
        onChange={handleFillChange} 
        label="Text Color" 
      />

      {/* Font Style */}
      <div className="space-y-1">
        <Label className="text-xs">Style</Label>
        <ToggleGroup 
          type="multiple" 
          className="justify-start" 
          value={activeStyles}
          onValueChange={handleFontStyleChange}
        >
          <ToggleGroupItem value="bold" aria-label="Bold" className="h-8 w-8 p-0">
            <Bold className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic" className="h-8 w-8 p-0">
            <Italic className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline" className="h-8 w-8 p-0">
            <Underline className="h-3.5 w-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Text Alignment */}
      <div className="space-y-1">
        <Label className="text-xs">Alignment</Label>
        <ToggleGroup 
          type="single" 
          className="justify-start" 
          value={textAlign}
          onValueChange={handleTextAlignChange}
        >
          <ToggleGroupItem value="left" aria-label="Align left" className="h-8 w-8 p-0">
            <AlignLeft className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center" className="h-8 w-8 p-0">
            <AlignCenter className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right" className="h-8 w-8 p-0">
            <AlignRight className="h-3.5 w-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Character Spacing */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label className="text-xs">Character Spacing</Label>
          <span className="text-xs text-muted-foreground">{charSpacing}</span>
        </div>
        <Slider
          value={[charSpacing]}
          min={0}
          max={1000}
          step={10}
          onValueChange={handleCharSpacingChange}
        />
      </div>

      {/* Line Height */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label className="text-xs">Line Height</Label>
          <span className="text-xs text-muted-foreground">{lineHeight.toFixed(1)}</span>
        </div>
        <Slider
          value={[lineHeight]}
          min={0.5}
          max={3}
          step={0.1}
          onValueChange={handleLineHeightChange}
        />
      </div>
    </div>
  );
};
