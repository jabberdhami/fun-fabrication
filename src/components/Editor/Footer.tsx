
import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="p-3 border-t border-border bg-background text-center text-sm text-muted-foreground">
      <a 
        href="https://www.itsss.co.in" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover:text-primary transition-colors"
      >
        Made by ITSSS <ExternalLink className="h-3 w-3" />
      </a>
    </footer>
  );
};
