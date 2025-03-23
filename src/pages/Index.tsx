
import React from 'react';
import { EditorProvider } from '@/components/Editor/EditorContext';
import { Canvas } from '@/components/Editor/Canvas';
import { Toolbar } from '@/components/Editor/Toolbar';
import { Sidebar } from '@/components/Editor/Sidebar';
import { EditorHeader } from '@/components/Editor/EditorHeader';

const Index = () => {
  return (
    <EditorProvider>
      <div className="min-h-screen flex flex-col bg-background overflow-hidden">
        <EditorHeader />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />
          
          <div className="flex-1 flex overflow-hidden relative">
            <Canvas />
            <Sidebar />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default Index;
