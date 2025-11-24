import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DestinationsCTASectionProps {
  data?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export function DestinationsCTASection({ data }: DestinationsCTASectionProps) {
  const sectionData = data || {
    title: "Ready to Start Your Adventure?",
    description: "Browse our curated safari packages and find the perfect journey for you",
    buttonText: "View Safari Packages",
    buttonLink: "/packages",
  };

  return (
    <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
          {sectionData.title}
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          {sectionData.description}
        </p>
        <Link href={sectionData.buttonLink}>
          <Button
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {sectionData.buttonText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
