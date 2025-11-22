import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import Link from "next/link";

interface AboutCTASectionProps {
  data: {
    badge: string;
    heading: string;
    headingHighlight: string;
    description: string;
    button1Text: string;
    button1Link: string;
    button2Text: string;
    button2Link: string;
    footerText: string;
  };
}

export function AboutCTASection({ data }: AboutCTASectionProps) {
  return (
    <section className="py-20 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="bg-primary text-primary-foreground px-4 py-2 text-base rounded-full font-medium">
              {data.badge}
            </div>
          </div>
          <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6">
            {data.heading} <span className="text-primary">{data.headingHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            {data.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={data.button1Link}>
              <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl gap-2">
                {data.button1Text}
                <Award className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={data.button2Link}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2"
              >
                {data.button2Text}
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            {data.footerText}
          </p>
        </div>
      </div>
    </section>
  );
}
