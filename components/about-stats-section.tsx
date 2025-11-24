interface AboutStatsSectionProps {
  data: {
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
    stat4Number: string;
    stat4Label: string;
  } | null;
}

export function AboutStatsSection({ data }: AboutStatsSectionProps) {
  if (!data) {
    return null;
  }

  const stats = [
    { number: data.stat1Number, label: data.stat1Label },
    { number: data.stat2Number, label: data.stat2Label },
    { number: data.stat3Number, label: data.stat3Label },
    { number: data.stat4Number, label: data.stat4Label },
  ];

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">{stat.number}</div>
              <div className="text-primary-foreground/80 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
