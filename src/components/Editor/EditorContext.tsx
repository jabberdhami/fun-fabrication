import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { fabric } from 'fabric';
import { toast } from '@/hooks/use-toast';

export interface CanvasSize {
  name: string;
  width: number;
  height: number;
  icon?: React.ReactNode;
}

export const CANVAS_SIZES: CanvasSize[] = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Custom', width: 800, height: 600 },
];

interface EditorContextProps {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  selectedObject: fabric.Object | null;
  setSelectedObject: (object: fabric.Object | null) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  currentCanvasSize: CanvasSize;
  setCurrentCanvasSize: (size: CanvasSize) => void;
  canvasSizes: CanvasSize[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  history: { past: string[], future: string[] };
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  addText: () => void;
  addRect: () => void;
  addCircle: () => void;
  addImage: (url: string) => Promise<void>;
  addSticker: (url: string) => Promise<void>;
  deleteSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  duplicateSelected: () => void;
  downloadCanvas: (format: 'png' | 'jpeg') => void;
  clearCanvas: () => void;
  updateObjectProps: (props: Partial<fabric.IObjectOptions>) => void;
}

export const EditorContext = createContext<EditorContextProps>({} as EditorContextProps);

export const useEditor = () => useContext(EditorContext);

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [currentCanvasSize, setCurrentCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [history, setHistory] = useState<{ past: string[], future: string[] }>({ past: [], future: [] });

  useEffect(() => {
    if (!canvas) return;

    canvas.backgroundColor = backgroundColor;
    canvas.renderAll();
  }, [backgroundColor, canvas]);

  useEffect(() => {
    if (!canvas) return;

    const handleSelectionUpdated = () => {
      const selected = canvas.getActiveObject();
      setSelectedObject(selected || null);
    };

    canvas.on('selection:created', handleSelectionUpdated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionUpdated);

    return () => {
      canvas.off('selection:created', handleSelectionUpdated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionUpdated);
    };
  }, [canvas]);

  // History management
  const saveToHistory = useCallback(() => {
    if (!canvas) return;
    
    try {
      const json = JSON.stringify(canvas.toJSON(['id', 'name']));
      setHistory(prev => ({
        past: [...prev.past, json],
        future: []
      }));
    } catch (error) {
      console.error('Failed to save canvas state to history:', error);
    }
  }, [canvas]);

  const undo = useCallback(() => {
    if (!canvas || history.past.length === 0) return;
    
    try {
      const current = JSON.stringify(canvas.toJSON(['id', 'name']));
      const previous = history.past[history.past.length - 1];
      
      setHistory(prev => ({
        past: prev.past.slice(0, -1),
        future: [...prev.future, current]
      }));
      
      canvas.loadFromJSON(JSON.parse(previous), () => {
        canvas.renderAll();
        setSelectedObject(null);
      });
    } catch (error) {
      console.error('Failed to undo:', error);
      toast({
        title: 'Error',
        description: 'Failed to undo the last action',
        variant: 'destructive'
      });
    }
  }, [canvas, history]);

  const redo = useCallback(() => {
    if (!canvas || history.future.length === 0) return;
    
    try {
      const current = JSON.stringify(canvas.toJSON(['id', 'name']));
      const next = history.future[history.future.length - 1];
      
      setHistory(prev => ({
        past: [...prev.past, current],
        future: prev.future.slice(0, -1)
      }));
      
      canvas.loadFromJSON(JSON.parse(next), () => {
        canvas.renderAll();
        setSelectedObject(null);
      });
    } catch (error) {
      console.error('Failed to redo:', error);
      toast({
        title: 'Error',
        description: 'Failed to redo the last action',
        variant: 'destructive'
      });
    }
  }, [canvas, history]);

  // Object manipulation
  const addText = useCallback(() => {
    if (!canvas) return;
    
    const text = new fabric.Textbox('Edit this text', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontFamily: 'Inter',
      fill: '#333333',
      fontSize: 30,
      padding: 10,
      originX: 'center',
      originY: 'center'
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    canvas.renderAll();
    saveToHistory();
  }, [canvas, saveToHistory]);

  const addRect = useCallback(() => {
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fill: '#4299e1',
      width: 100,
      height: 100,
      originX: 'center',
      originY: 'center',
      rx: 8,
      ry: 8,
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, saveToHistory]);

  const addCircle = useCallback(() => {
    if (!canvas) return;
    
    const circle = new fabric.Circle({
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fill: '#ed8936',
      radius: 50,
      originX: 'center',
      originY: 'center'
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, saveToHistory]);

  const addImage = useCallback(async (url: string) => {
    if (!canvas) return;
    
    try {
      fabric.Image.fromURL(url, (img) => {
        // Scale down if image is too large
        const maxDimension = Math.min(canvas.width!, canvas.height!) * 0.8;
        const scale = img.width && img.height 
          ? img.width > img.height 
            ? maxDimension / img.width 
            : maxDimension / img.height
          : 1;
        
        img.scale(scale);
        img.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center'
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveToHistory();
      }, { crossOrigin: 'anonymous' });
    } catch (error) {
      console.error('Failed to add image:', error);
      toast({
        title: 'Error',
        description: 'Failed to add the image to canvas',
        variant: 'destructive'
      });
    }
  }, [canvas, saveToHistory]);

  // Add sticker function - similar to addImage but optimized for stickers
  const addSticker = useCallback(async (url: string) => {
    if (!canvas) return;
    
    try {
      fabric.Image.fromURL(url, (img) => {
        // Scale down if sticker is too large, but keep it a bit bigger than normal images
        const maxDimension = Math.min(canvas.width!, canvas.height!) * 0.3;
        const scale = img.width && img.height 
          ? img.width > img.height 
            ? maxDimension / img.width 
            : maxDimension / img.height
          : 0.3;
        
        img.scale(scale);
        img.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center'
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveToHistory();
      }, { crossOrigin: 'anonymous' });
    } catch (error) {
      console.error('Failed to add sticker:', error);
      toast({
        title: 'Error',
        description: 'Failed to add the sticker to canvas',
        variant: 'destructive'
      });
    }
  }, [canvas, saveToHistory]);

  const deleteSelected = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    canvas.remove(selectedObject);
    setSelectedObject(null);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const duplicateSelected = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    try {
      selectedObject.clone((cloned: fabric.Object) => {
        cloned.set({
          left: selectedObject.left! + 20,
          top: selectedObject.top! + 20,
          evented: true,
        });
        
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
        saveToHistory();
      });
    } catch (error) {
      console.error('Failed to duplicate object:', error);
      toast({
        title: 'Error',
        description: 'Failed to duplicate the selected object',
        variant: 'destructive'
      });
    }
  }, [canvas, selectedObject, saveToHistory]);

  // Layer management
  const bringForward = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    canvas.bringForward(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const sendBackward = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    canvas.sendBackwards(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const bringToFront = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    canvas.bringToFront(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const sendToBack = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    canvas.sendToBack(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  // Update object properties
  const updateObjectProps = useCallback((props: Partial<fabric.IObjectOptions>) => {
    if (!canvas || !selectedObject) return;
    
    selectedObject.set(props);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  // Canvas actions
  const downloadCanvas = useCallback((format: 'png' | 'jpeg' = 'png') => {
    if (!canvas) return;
    
    try {
      const fileName = `canvas-design.${format}`;
      const dataURL = canvas.toDataURL({
        format: format,
        quality: 1,
        enableRetinaScaling: true
      });
      
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Success',
        description: `Your design has been downloaded as ${fileName}`,
      });
    } catch (error) {
      console.error('Failed to download canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to download your design',
        variant: 'destructive'
      });
    }
  }, [canvas]);

  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    canvas.clear();
    canvas.backgroundColor = backgroundColor;
    canvas.renderAll();
    saveToHistory();
    toast({
      description: 'Canvas cleared',
    });
  }, [canvas, backgroundColor, saveToHistory]);

  const value = {
    canvas,
    setCanvas,
    selectedObject,
    setSelectedObject,
    backgroundColor,
    setBackgroundColor,
    currentCanvasSize,
    setCurrentCanvasSize,
    canvasSizes: CANVAS_SIZES,
    isSidebarOpen,
    setIsSidebarOpen,
    history,
    undo,
    redo,
    saveToHistory,
    addText,
    addRect,
    addCircle,
    addImage,
    addSticker,
    deleteSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    duplicateSelected,
    downloadCanvas,
    clearCanvas,
    updateObjectProps,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
