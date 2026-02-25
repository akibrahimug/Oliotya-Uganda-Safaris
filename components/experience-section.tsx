import { getImageSrc } from "@/lib/image-utils";
import Image from "next/image";

interface ExperienceSectionProps {
  data?: {
    heading: string;
    title: string;
    description: string;
    image: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    badgeText: string;
    backgroundText: string;
  };
}

export function ExperienceSection({ data: propData }: ExperienceSectionProps) {
  // Fallback to defaults if no data provided
  const data = propData || {
    heading: "We are collectors of",
    title: "Unique Experiences",
    description: "Committed to be home country's traditional values and the highest possible standard and service. We focus on our customers needs and truly believe that if we get essential clients' holidays WINS made.",
    image: "/international.jpg",
    stat1Value: "10+",
    stat1Label: "Destinations",
    stat2Value: "8+",
    stat2Label: "Years Experience",
    badgeText: "1 International Travel",
    backgroundText: "UGANDA",
  };
  const imageSrc = getImageSrc(data.image);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <p className="text-muted-foreground mb-4">{data.heading}</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 text-balance">
              {data.title.split(" ").map((word, i) =>
                i === data.title.split(" ").length - 1 ? (
                  <span key={i} className="text-primary">{word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-xl">
              {data.description}
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">{data.stat1Value}</div>
                <div className="text-muted-foreground">{data.stat1Label}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">{data.stat2Value}</div>
                <div className="text-muted-foreground">{data.stat2Label}</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right">
            <div className="relative">
              <Image
                src={imageSrc}
                alt="Uganda Globe"
                width={3840}
                height={2849}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={70}
                className="w-full h-auto animate-float"
              />
              <div className="absolute -right-8 bottom-1/4 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-xl font-semibold animate-pulse">
                {data.badgeText}
              </div>
            </div>
            <div className="absolute -right-4 top-0 text-9xl font-bold text-muted/10 [writing-mode:vertical-lr] pointer-events-none">
              {data.backgroundText}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
