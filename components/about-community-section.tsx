import { Button } from "@/components/ui/button";
import { Users, Globe, Target, Heart } from "lucide-react";
import Link from "next/link";

interface AboutCommunitySectionProps {
  data: {
    heading: string;
    title: string;
    titleHighlight: string;
    paragraph1: string;
    paragraph2: string;
    buttonText: string;
    buttonLink: string;
    image?: string | null;
    feature1Title: string;
    feature1Description: string;
    feature2Title: string;
    feature2Description: string;
    feature3Title: string;
    feature3Description: string;
  };
}

export function AboutCommunitySection({ data }: AboutCommunitySectionProps) {
  const foundationImageSrc = data.image?.trim() || null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold mb-4">{data.heading}</p>
            <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6">
              {data.title}{" "}
              <span className="text-primary">{data.titleHighlight}</span>
            </h2>
            {foundationImageSrc ? (
              <div className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-background shadow-sm">
                <img
                  src={foundationImageSrc}
                  alt={`${data.titleHighlight} image`}
                  className="h-64 w-full object-cover md:h-80"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="mb-8 rounded-2xl border border-dashed border-primary/30 bg-background/70 p-6 text-sm text-muted-foreground">
                Add a Community Foundation image in CMS to display it here.
              </div>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {data.paragraph1}
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {data.paragraph2}
            </p>
            <Link href={data.buttonLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <Heart className="h-5 w-5" />
                {data.buttonText}
              </Button>
            </Link>
          </div>
          <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{data.feature1Title}</h3>
                  <p className="text-muted-foreground">{data.feature1Description}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{data.feature2Title}</h3>
                  <p className="text-muted-foreground">{data.feature2Description}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{data.feature3Title}</h3>
                  <p className="text-muted-foreground">{data.feature3Description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
