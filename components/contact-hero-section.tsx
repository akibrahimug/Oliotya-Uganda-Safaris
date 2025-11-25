interface ContactHeroSectionProps {
  data: {
    image: string;
    title: string;
    subtitle: string;
    description: string;
  };
}

export function ContactHeroSection({ data }: ContactHeroSectionProps) {
  return (
    <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={data.image}
          alt="Contact Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subtitle */}
          <p className="text-primary font-semibold text-lg tracking-wide uppercase">
            {data.subtitle}
          </p>

          {/* Main Title */}
          <h1 className="font-inter text-5xl md:text-6xl lg:text-7xl font-bold text-background">
            {data.title}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-background/90 leading-relaxed max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
