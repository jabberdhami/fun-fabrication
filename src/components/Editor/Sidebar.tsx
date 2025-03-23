
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Layers, Palette, Settings } from 'lucide-react';
import { useEditor } from './EditorContext';
import { ObjectControls } from './ObjectControls';
import { TextControls } from './TextControls';
import { ShapeControls } from './ShapeControls';
import { ImageControls } from './ImageControls';
import { LayerPanel } from './LayerPanel';
import { ColorPicker } from './ColorPicker';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const { 
    selectedObject, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    backgroundColor, 
    setBackgroundColor,
    clearCanvas
  } = useEditor();

  const getSelectedObjectType = () => {
    if (!selectedObject) return null;
    
    if (selectedObject.type === 'textbox' || selectedObject.type === 'text') {
      return 'text';
    } else if (selectedObject.type === 'rect') {
      return 'rect';
    } else if (selectedObject.type === 'circle') {
      return 'circle';
    } else if (selectedObject.type === 'image') {
      return 'image';
    }
    
    return 'object';
  };

  const objectType = getSelectedObjectType();

  return (
    <div 
      className={cn(
        "fixed right-0 top-0 h-full bg-white z-40 flex flex-col border-l border-editor-panel-border shadow-lg transition-all duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}
      style={{ width: '280px' }}
    >
      <div className="p-4 border-b border-editor-panel-border flex items-center justify-between">
        <h2 className="text-sm font-medium">Properties</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="properties" className="flex-1 overflow-hidden">
        <TabsList className="w-full h-12 bg-muted/50 rounded-none border-b">
          <TabsTrigger value="properties" className="flex-1 data-[state=active]:bg-transparent">
            <Settings className="h-4 w-4 mr-1" />
            <span>Properties</span>
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex-1 data-[state=active]:bg-transparent">
            <Layers className="h-4 w-4 mr-1" />
            <span>Layers</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="properties" 
          className="flex-1 overflow-y-auto p-0 data-[state=active]:flex data-[state=active]:flex-col"
        >
          <div className="p-4 space-y-4">
            {/* Canvas Background */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">Canvas</h3>
              <ColorPicker 
                color={backgroundColor} 
                onChange={setBackgroundColor} 
                label="Background Color" 
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 text-xs h-8" 
                onClick={clearCanvas}
              >
                Clear Canvas
              </Button>
            </div>
            
            <Separator />
            
            {/* Selected Object Properties */}
            {selectedObject ? (
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-muted-foreground">Selected Object</h3>
                
                <ObjectControls />
                
                {objectType === 'text' && <TextControls />}
                {(objectType === 'rect' || objectType === 'circle') && <ShapeControls />}
                {objectType === 'image' && <ImageControls />}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Palette className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Select an object to edit its properties</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent 
          value="layers" 
          className="flex-1 overflow-y-auto p-0 data-[state=active]:flex data-[state=active]:flex-col"
        >
          <LayerPanel />
        </TabsContent>
      </Tabs>
      
      {!isSidebarOpen && (
        <Button 
          variant="secondary"
          size="icon"
          className="absolute -left-10 top-4 animate-fade-in shadow-glass-sm"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
