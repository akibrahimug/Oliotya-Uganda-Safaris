"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TourGuideReadMoreModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    title: string;
    subtitle: string;
    description: string;
  };
}

export function TourGuideReadMoreModal({ open, onClose, data }: TourGuideReadMoreModalProps) {
  // Split description into sentences for better formatting
  const sentences = data.description.split('. ').filter(s => s.trim());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[85vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Hero section with gradient */}
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 xl:px-20 xl:py-16 border-b">
            <DialogHeader>
              <DialogTitle className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-left mb-4 lg:mb-6 leading-tight">
                {data.title}
                <br />
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {data.subtitle}
                </span>
              </DialogTitle>
              <div className="w-24 sm:w-28 md:w-32 lg:w-40 h-1.5 lg:h-2 bg-linear-to-r from-accent to-primary rounded-full" />
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-10 lg:px-16 lg:py-12 xl:px-20 xl:py-14">
            <div className="prose prose-lg max-w-none">
              {sentences.map((sentence, index) => {
                // Every 3 sentences, create a paragraph
                if (index % 3 === 0) {
                  const group = sentences.slice(index, index + 3);
                  return (
                    <p
                      key={index}
                      className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed lg:leading-relaxed xl:leading-relaxed text-foreground/90 mb-6 lg:mb-8 xl:mb-10 first:text-xl first:sm:text-2xl first:md:text-2xl first:lg:text-3xl first:xl:text-4xl first:font-medium first:text-foreground"
                    >
                      {group.join('. ')}{group.length > 0 && '.'}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
