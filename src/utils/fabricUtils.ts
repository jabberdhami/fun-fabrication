
import { fabric } from 'fabric';

/**
 * Sets custom control points for better object manipulation
 */
export const setupCustomControls = (canvas: fabric.Canvas) => {
  // Make corner controls more visible
  fabric.Object.prototype.set({
    cornerColor: '#4299e1',
    cornerSize: 8,
    cornerStyle: 'circle',
    transparentCorners: false,
    borderColor: '#4299e1',
    borderScaleFactor: 2,
  });

  // Set up custom keyboard shortcuts
  canvas.on('key:down', (e: any) => {
    // e.which contains the key code
    if (e.e.code === 'Delete' || e.e.code === 'Backspace') {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
      }
    }
  });

  // Enable keyboard events
  canvas.on('mouse:down', () => {
    canvas.requestRenderAll();
  });
};

/**
 * Enhances text editing experience
 */
export const setupTextEditing = (canvas: fabric.Canvas) => {
  // Change cursor when hovering over text
  canvas.on('mouse:over', (e) => {
    if (e.target && (e.target.type === 'text' || e.target.type === 'textbox')) {
      canvas.setCursor('text');
    }
  });

  canvas.on('mouse:out', () => {
    canvas.setCursor('default');
  });

  // Double click to edit text
  canvas.on('mouse:dblclick', (e) => {
    if (e.target && (e.target.type === 'text' || e.target.type === 'textbox')) {
      (e.target as fabric.Textbox).enterEditing();
      (e.target as fabric.Textbox).selectAll();
    }
  });
};

/**
 * Helps prevent image distortion when resizing
 */
export const setupImageHandling = (canvas: fabric.Canvas) => {
  canvas.on('object:scaling', (e) => {
    const obj = e.target;
    if (obj && obj.type === 'image') {
      // Your custom scaling logic here if needed
    }
  });
};

/**
 * Resizes canvas to fit container while maintaining aspect ratio
 */
export const resizeCanvasToContainer = (
  canvas: fabric.Canvas,
  containerWidth: number,
  containerHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  padding: number = 40
) => {
  if (!canvas) return;

  const canvasRatio = canvasWidth / canvasHeight;
  const containerRatio = containerWidth / containerHeight;

  let scale = 1;
  if (canvasRatio > containerRatio) {
    // Width constrained
    scale = (containerWidth - padding) / canvasWidth;
  } else {
    // Height constrained
    scale = (containerHeight - padding) / canvasHeight;
  }

  // Don't scale up beyond original size
  scale = Math.min(scale, 1);

  // Apply scaling
  const scaledWidth = canvasWidth * scale;
  const scaledHeight = canvasHeight * scale;

  canvas.setDimensions({
    width: scaledWidth,
    height: scaledHeight
  });

  return { width: scaledWidth, height: scaledHeight, scale };
};

/**
 * Creates a snapshot of the current canvas state
 */
export const createCanvasSnapshot = (canvas: fabric.Canvas): string | null => {
  if (!canvas) return null;
  
  try {
    return JSON.stringify(canvas.toJSON(['id', 'name']));
  } catch (error) {
    console.error('Failed to create canvas snapshot:', error);
    return null;
  }
};

/**
 * Restores canvas from a snapshot
 */
export const restoreCanvasFromSnapshot = (
  canvas: fabric.Canvas,
  snapshot: string,
  callback?: () => void
): boolean => {
  if (!canvas || !snapshot) return false;
  
  try {
    canvas.loadFromJSON(JSON.parse(snapshot), () => {
      canvas.renderAll();
      if (callback) callback();
    });
    return true;
  } catch (error) {
    console.error('Failed to restore canvas from snapshot:', error);
    return false;
  }
};
