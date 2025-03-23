
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditor } from './EditorContext';
import { toast } from '@/hooks/use-toast';
import { Gift, ShoppingBag, Heart, Baby, CalendarDays } from 'lucide-react';

interface StickerCategory {
  name: string;
  path: string;
  stickers: string[];
  icon?: React.ReactNode;
}

export const StickerSelector: React.FC = () => {
  const { addSticker } = useEditor();
  const [categories, setCategories] = useState<StickerCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    // This would typically fetch from an API endpoint that returns sticker categories
    // For demo purposes, we'll hardcode some categories
    const demoCategories: StickerCategory[] = [
      {
        name: 'Emoji',
        path: '/stickers/emoji',
        stickers: Array.from({ length: 10 }, (_, i) => `/stickers/emoji/emoji-${i + 1}.png`)
      },
      {
        name: 'Animals',
        path: '/stickers/animals',
        stickers: Array.from({ length: 8 }, (_, i) => `/stickers/animals/animal-${i + 1}.png`)
      },
      {
        name: 'Shapes',
        path: '/stickers/shapes',
        stickers: Array.from({ length: 6 }, (_, i) => `/stickers/shapes/shape-${i + 1}.png`)
      },
      {
        name: 'Decorative',
        path: '/stickers/decorative',
        stickers: Array.from({ length: 12 }, (_, i) => `/stickers/decorative/deco-${i + 1}.png`)
      },
      {
        name: 'Birthday',
        path: '/stickers/birthday',
        icon: <Gift className="h-3 w-3 mr-1" />,
        stickers: Array.from({ length: 10 }, (_, i) => `/stickers/birthday/birthday-${i + 1}.png`)
      },
      {
        name: 'Promotional',
        path: '/stickers/promotional',
        icon: <ShoppingBag className="h-3 w-3 mr-1" />,
        stickers: Array.from({ length: 8 }, (_, i) => `/stickers/promotional/promo-${i + 1}.png`)
      },
      {
        name: 'Love',
        path: '/stickers/love',
        icon: <Heart className="h-3 w-3 mr-1" />,
        stickers: Array.from({ length: 10 }, (_, i) => `/stickers/love/love-${i + 1}.png`)
      },
      {
        name: 'Baby & Kids',
        path: '/stickers/baby',
        icon: <Baby className="h-3 w-3 mr-1" />,
        stickers: Array.from({ length: 8 }, (_, i) => `/stickers/baby/baby-${i + 1}.png`)
      },
      {
        name: 'Seasonal',
        path: '/stickers/seasonal',
        icon: <CalendarDays className="h-3 w-3 mr-1" />,
        stickers: Array.from({ length: 12 }, (_, i) => `/stickers/seasonal/seasonal-${i + 1}.png`)
      }
    ];

    setCategories(demoCategories);
    setActiveCategory(demoCategories[0].name);
    setIsLoading(false);
  }, []);

  const handleStickerClick = (stickerPath: string) => {
    addSticker(stickerPath);
    toast({
      description: "Sticker added to canvas",
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-6">Loading stickers...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Stickers</h3>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <ScrollArea className="w-full" type="always">
          <TabsList className="w-full h-10 bg-muted/50 flex flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.name} 
                value={category.name}
                className="text-xs whitespace-nowrap flex items-center"
              >
                {category.icon && category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        {categories.map((category) => (
          <TabsContent key={category.name} value={category.name} className="mt-2">
            <ScrollArea className="h-[400px] rounded-md border p-2">
              <div className="grid grid-cols-3 gap-2">
                {category.stickers.map((sticker, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-2 h-20 aspect-square flex items-center justify-center hover:bg-muted"
                    onClick={() => handleStickerClick(sticker)}
                  >
                    <img 
                      src={sticker} 
                      alt={`${category.name} sticker ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        // Fallback for demo purposes when sticker doesn't exist
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
