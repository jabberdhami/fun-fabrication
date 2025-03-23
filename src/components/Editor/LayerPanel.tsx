
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Copy, MoveUp, MoveDown, Layers } from 'lucide-react';
import { useEditor } from './EditorContext';
import { cn } from '@/lib/utils';

interface LayerItem {
  object: fabric.Object;
  type: string;
  name: string;
}

export const LayerPanel: React.FC = () => {
  const { 
    canvas, 
    selectedObject, 
    setSelectedObject, 
    deleteSelected, 
    duplicateSelected, 
    bringForward, 
    sendBackward, 
    bringToFront, 
    sendToBack 
  } = useEditor();
  
  const [layers, setLayers] = useState<LayerItem[]>([]);

  useEffect(() => {
    if (!canvas) return;
    
    const updateLayers = () => {
      const objects = canvas.getObjects();
      
      // Convert objects to layer items
      const layerItems = objects.map((obj) => {
        let name = '';
        
        if (obj.type === 'textbox' || obj.type === 'text') {
          name = (obj as fabric.Textbox).text?.slice(0, 15) || 'Text';
          if ((obj as fabric.Textbox).text?.length > 15) {
            name += '...';
          }
        } else if (obj.type === 'rect') {
          name = 'Rectangle';
        } else if (obj.type === 'circle') {
          name = 'Circle';
        } else if (obj.type === 'image') {
          name = 'Image';
        } else {
          name = obj.type?.charAt(0).toUpperCase() + obj.type?.slice(1) || 'Object';
        }
        
        return {
          object: obj,
          type: obj.type || 'unknown',
          name
        };
      });
      
      // Display in reverse order to match the visual stacking
      setLayers([...layerItems].reverse());
    };
    
    updateLayers();
    
    // Update layers when objects change
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    
    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  const handleLayerClick = (layer: LayerItem) => {
    if (canvas) {
      canvas.setActiveObject(layer.object);
      setSelectedObject(layer.object);
      canvas.renderAll();
    }
  };

  const handleToggleVisibility = (layer: LayerItem, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (canvas) {
      const visible = !layer.object.visible;
      layer.object.set('visible', visible);
      
      // If hiding the selected object, deselect it
      if (!visible && selectedObject === layer.object) {
        canvas.discardActiveObject();
        setSelectedObject(null);
      }
      
      canvas.renderAll();
    }
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'textbox':
      case 'text':
        return <span className="text-xs font-bold">T</span>;
      case 'rect':
        return <div className="w-3 h-3 bg-editor-accent-light rounded-sm" />;
      case 'circle':
        return <div className="w-3 h-3 bg-editor-accent-medium rounded-full" />;
      case 'image':
        return <div className="w-3 h-3 bg-editor-accent-dark rounded-sm overflow-hidden border border-white/20" />;
      default:
        return <Layers className="h-3 w-3 opacity-70" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-editor-panel-border bg-muted/30">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-medium">Layers</h3>
          <span className="text-xs text-muted-foreground">{layers.length} items</span>
        </div>
        
        {layers.length === 0 && (
          <p className="text-xs text-muted-foreground py-1">No objects on canvas</p>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {layers.map((layer, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center p-2 border-b border-editor-panel-border cursor-pointer group transition-colors",
              selectedObject === layer.object ? "bg-accent" : "hover:bg-muted/50"
            )}
            onClick={() => handleLayerClick(layer)}
          >
            <div className="flex items-center justify-center w-6 h-6 mr-2">
              {getLayerIcon(layer.type)}
            </div>
            
            <div className="flex-1 truncate">
              <span className="text-xs font-medium">{layer.name}</span>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => handleToggleVisibility(layer, e)}
              >
                {layer.object.visible !== false ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedObject && (
        <div className="p-3 border-t border-editor-panel-border bg-muted/30">
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={bringToFront}
              title="Bring to Front"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={bringForward}
              title="Bring Forward"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={sendBackward}
              title="Send Backward"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={sendToBack}
              title="Send to Back"
            >
              <Layers className="h-4 w-4 transform rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={duplicateSelected}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={deleteSelected}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
