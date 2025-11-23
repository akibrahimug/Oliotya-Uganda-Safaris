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
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={data.image} alt="Contact Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{data.title}</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">{data.subtitle}</h2>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{data.description}</p>
      </div>
    </section>
  );
}
