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
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/70 to-foreground/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subtitle */}
          <p className="text-primary font-semibold text-lg tracking-wide uppercase animate-fade-in">
            {data.subtitle}
          </p>

          {/* Main Title */}
          <h1 className="font-inter text-5xl md:text-6xl lg:text-7xl font-bold text-background mb-6 animate-fade-in-up">
            {data.title}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-background/90 leading-relaxed max-w-3xl mx-auto animate-fade-in-up">
            {data.description}
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
