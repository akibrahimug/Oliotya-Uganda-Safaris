import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AboutStorySectionProps {
  data: {
    heading: string;
    title: string;
    titleHighlight: string;
    paragraph1: string;
    paragraph2: string;
    buttonText: string;
    buttonLink: string;
    image: string;
  };
}

export function AboutStorySection({ data }: AboutStorySectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold mb-4">{data.heading}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              {data.title}{" "}
              <span className="text-primary">{data.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {data.paragraph1}
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {data.paragraph2}
            </p>
            <Link href={data.buttonLink}>
              <Button size="lg" className="mt-4">
                {data.buttonText}
              </Button>
            </Link>
          </div>
          <div className="relative">
            <img
              src={data.image}
              alt="Our Story"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
