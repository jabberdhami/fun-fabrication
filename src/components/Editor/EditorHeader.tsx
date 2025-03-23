
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileDown, Share2 } from 'lucide-react';
import { useEditor } from './EditorContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';

export const EditorHeader: React.FC = () => {
  const { downloadCanvas } = useEditor();

  const handleExport = (format: 'png' | 'jpeg') => {
    downloadCanvas(format);
  };

  const handleShare = () => {
    toast({
      description: "Sharing functionality will be available in a future update."
    });
  };

  return (
    <header className="flex items-center justify-between p-3 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/94f49e39-8cf7-49bc-908e-c4636d942df2.png" 
          alt="ITSSS Logo" 
          className="h-8"
        />
        <h1 className="text-lg font-medium">ITSSS Canvas</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="gap-1"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline-block">Share</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" className="gap-1">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline-block">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('png')}>
              <Download className="h-4 w-4 mr-2" />
              Download as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('jpeg')}>
              <Download className="h-4 w-4 mr-2" />
              Download as JPEG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
