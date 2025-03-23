
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditor } from './EditorContext';
import { toast } from '@/hooks/use-toast';
import { Gift, ShoppingBag, Heart, Baby, CalendarDays, Smile, Palette, Cat, Square } from 'lucide-react';

interface StickerCategory {
  name: string;
  path: string;
  stickers: string[];
  icon: React.ReactNode;
  color?: string;
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
        icon: <Smile className="h-4 w-4 mr-1.5" />,
        color: 'bg-amber-100',
        stickers: Array.from({ length: 10 }, (_, i) => `/stickers/emoji/emoji-${i + 1}.png`)
      },
      {
        name: 'Animals',
        path: '/stickers/animals',
        icon: <Cat className="h-4 w-4 mr-1.5" />,
        color: 'bg-green-100',
        stickers: Array.from({ length: 8 }, (_, i) => `/stickers/animals/animal-${i + 1}.png`)
      },
      {
        name: 'Shapes',
        path: '/stickers/shapes',
        icon: <Square className="h-4 w-4 mr-1.5" />,
        color: 'bg-blue-100',
        stickers: Array.from({ length: 6 }, (_, i) => `/stickers/shapes/shape-${i + 1}.png`)
      },
      {
        name: 'Decorative',
        path: '/stickers/decorative',
        icon: <Palette className="h-4 w-4 mr-1.5" />,
        color: 'bg-purple-100',
        stickers: Array.from({ length: 12 }, (_, i) => `/stickers/decorative/deco-${i + 1}.png`)
      },
      {
        name: 'Birthday',
        path: '/stickers/birthday',
        icon: <Gift className="h-4 w-4 mr-1.5" />,
        color: 'bg-pink-100',
        stickers: Array.from({ length: 10 }, (_, i) => `/stickers/birthday/birthday-${i + 1}.png`)
      },
      {
        name: 'Promotional',
        path: '/stickers/promotional',
        icon: <ShoppingBag className="h-4 w-4 mr-1.5" />,
        color: 'bg-orange-100',
        stickers: Array.from({ length: 8 }, (_, i) => `/stickers/promotional/promo-${i + 1}.png`)
      },
      {
        name: 'Love',
        path: '/stickers/love',
        icon: <Heart className="h-4 w-4 mr-1.5" />,
        color: 'bg-red-100',
        stickers: Array.from({ length: 10 }, (_, i) => `/stickers/love/love-${i + 1}.png`)
      },
      {
        name: 'Baby & Kids',
        path: '/stickers/baby',
        icon: <Baby className="h-4 w-4 mr-1.5" />,
        color: 'bg-cyan-100',
        stickers: Array.from({ length: 8 }, (_, i) => `/stickers/baby/baby-${i + 1}.png`)
      },
      {
        name: 'Seasonal',
        path: '/stickers/seasonal',
        icon: <CalendarDays className="h-4 w-4 mr-1.5" />,
        color: 'bg-yellow-100',
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

  // Find the active category object
  const activeTab = categories.find(cat => cat.name === activeCategory);

  return (
    <div className="flex flex-col h-full max-h-[calc(80vh-70px)]">
      <div className="px-4 mb-1">
        <h3 className="text-lg font-semibold">Choose a sticker</h3>
        <p className="text-sm text-muted-foreground">Select from various categories</p>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex flex-col h-full">
        <div className="px-4">
          <ScrollArea className="w-full" type="always">
            <TabsList className="w-full h-12 bg-muted/50 flex flex-nowrap p-1.5 rounded-lg">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.name} 
                  value={category.name}
                  className={`text-sm px-3 py-1.5 rounded-md whitespace-nowrap flex items-center min-w-fit ${
                    activeCategory === category.name ? category.color || '' : ''
                  }`}
                >
                  {category.icon}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>
        
        <div className="flex-grow overflow-hidden px-4 py-3">
          {categories.map((category) => (
            <TabsContent 
              key={category.name} 
              value={category.name} 
              className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <div className={`p-2 rounded-lg mb-3 ${category.color || 'bg-muted/30'} flex items-center`}>
                {category.icon}
                <h4 className="font-medium">{category.name} Stickers</h4>
              </div>
              
              <ScrollArea className="flex-grow rounded-md border">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3">
                  {category.stickers.map((sticker, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-2 h-24 aspect-square flex items-center justify-center hover:bg-muted hover:border-primary/20 transition-all duration-200 overflow-hidden"
                      onClick={() => handleStickerClick(sticker)}
                    >
                      <img 
                        src={sticker} 
                        alt={`${category.name} sticker ${index + 1}`}
                        className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-200"
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
        </div>
      </Tabs>
    </div>
  );
};
