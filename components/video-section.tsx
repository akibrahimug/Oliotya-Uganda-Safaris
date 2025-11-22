interface VideoSectionProps {
  data?: {
    title: string;
    description: string;
    videoUrl: string;
  };
}

export function VideoSection({ data }: VideoSectionProps) {
  // Default fallback data
  const sectionData = data || {
    title: "Experience Uganda",
    description: "Watch our journey through the Pearl of Africa and discover what makes Uganda a unique destination",
    videoUrl: "",
  };

  // Split title to highlight last word
  const titleWords = sectionData.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const titleBeforeLastWord = titleWords.slice(0, -1).join(" ");

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {titleBeforeLastWord} <span className="text-primary">{lastWord}</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-muted/50 aspect-video flex items-center justify-center">
          <div className="text-muted-foreground text-lg">Video Player Placeholder</div>
        </div>
      </div>
    </section>
  );
}
