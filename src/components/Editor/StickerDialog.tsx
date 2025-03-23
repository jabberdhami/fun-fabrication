
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Sticker } from 'lucide-react';
import { StickerSelector } from './StickerSelector';
import { useIsMobile } from '@/hooks/use-mobile';

export const StickerDialog: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="has-tooltip">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md"
          >
            <Sticker className="h-4 w-4" />
          </Button>
          <span className="tooltip bottom-full left-1/2 transform -translate-x-1/2 mb-1">Add Sticker</span>
        </div>
      </DialogTrigger>
      <DialogContent 
        className={`${isMobile ? 'w-[95vw] max-w-none' : 'sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[65vw]'} max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-xl`}
      >
        <DialogHeader className="px-4 pt-4 pb-2 sticky top-0 bg-background z-10 border-b">
          <DialogTitle className="text-xl font-bold">Add Sticker</DialogTitle>
        </DialogHeader>
        <StickerSelector />
      </DialogContent>
    </Dialog>
  );
};
