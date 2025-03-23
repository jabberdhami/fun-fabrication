
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditor } from './EditorContext';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    setCanvas, 
    canvas, 
    backgroundColor, 
    currentCanvasSize, 
    saveToHistory,
    isSidebarOpen 
  } = useEditor();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: currentCanvasSize.width,
      height: currentCanvasSize.height,
      backgroundColor: backgroundColor,
      preserveObjectStacking: true,
      selection: true,
      renderOnAddRemove: true,
    });

    setCanvas(fabricCanvas);

    // Save initial state to history
    setTimeout(() => {
      saveToHistory();
    }, 100);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Update canvas size when currentCanvasSize changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.setWidth(currentCanvasSize.width);
    canvas.setHeight(currentCanvasSize.height);
    canvas.centerObject(new fabric.Object()); // Center viewpoint
    canvas.renderAll();
    
    // Resize canvas container to fit the editor area
    resizeCanvasContainer();
  }, [canvas, currentCanvasSize]);

  // Update background color
  useEffect(() => {
    if (!canvas) return;
    
    canvas.backgroundColor = backgroundColor;
    canvas.renderAll();
  }, [canvas, backgroundColor]);

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', resizeCanvasContainer);
    return () => {
      window.removeEventListener('resize', resizeCanvasContainer);
    };
  }, [canvas, isSidebarOpen]);

  // Resize canvas container on sidebar toggle
  useEffect(() => {
    resizeCanvasContainer();
  }, [isSidebarOpen]);

  // Function to resize canvas container
  const resizeCanvasContainer = () => {
    if (!canvas || !containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const canvasRatio = currentCanvasSize.width / currentCanvasSize.height;
    const containerRatio = containerWidth / containerHeight;
    
    let scale = 1;
    let canvasDisplayWidth = currentCanvasSize.width;
    let canvasDisplayHeight = currentCanvasSize.height;

    // Calculate scaling factor to fit canvas in container
    const padding = 60; // Padding around canvas
    if (canvasRatio > containerRatio) {
      // Width constrained
      scale = (containerWidth - padding) / currentCanvasSize.width;
    } else {
      // Height constrained
      scale = (containerHeight - padding) / currentCanvasSize.height;
    }
    
    // Don't scale up beyond original size
    scale = Math.min(scale, 1);
    
    // Apply scaling
    canvasDisplayWidth = currentCanvasSize.width * scale;
    canvasDisplayHeight = currentCanvasSize.height * scale;
    
    canvas.setZoom(scale);
    canvas.setDimensions({
      width: canvasDisplayWidth,
      height: canvasDisplayHeight
    });
    
    // Set container style
    if (containerRef.current) {
      containerRef.current.style.width = `${canvasDisplayWidth}px`;
      containerRef.current.style.height = `${canvasDisplayHeight}px`;
    }
  };

  return (
    <div 
      className="flex-1 overflow-hidden flex items-center justify-center bg-muted/30 p-8"
      data-testid="canvas-container"
    >
      <div 
        ref={containerRef} 
        className="canvas-container relative shadow-glass-lg rounded-lg transition-all duration-300 ease-in-out animate-scale-in"
      >
        <canvas 
          ref={canvasRef} 
          className="rounded-lg"
        />
      </div>
    </div>
  );
};
