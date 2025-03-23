
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

export const StickerDialog: React.FC = () => {
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
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-xl font-bold">Add Sticker</DialogTitle>
        </DialogHeader>
        <StickerSelector />
      </DialogContent>
    </Dialog>
  );
};
