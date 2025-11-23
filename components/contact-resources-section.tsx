import { BookOpen, Plane, Shield, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  linkText: string;
  linkUrl: string;
  isExternal: boolean;
}

interface ContactResourcesSectionProps {
  data: Resource[];
}

const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Plane,
    Shield,
    CreditCard,
    BookOpen,
  };
  return icons[iconName] || BookOpen;
};

export function ContactResourcesSection({ data }: ContactResourcesSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="font-inter text-4xl font-bold">
              Helpful Resources
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Everything you need to plan your Uganda adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((resource) => {
            const IconComponent = getIcon(resource.icon);
            const LinkWrapper = resource.isExternal ? 'a' : Link;
            const linkProps = resource.isExternal
              ? { href: resource.linkUrl, target: "_blank", rel: "noopener noreferrer" }
              : { href: resource.linkUrl };

            return (
              <Card key={resource.id} className="group hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-inter text-xl font-bold mb-3">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <LinkWrapper
                    {...linkProps}
                    className="text-primary font-semibold hover:underline"
                  >
                    {resource.linkText} →
                  </LinkWrapper>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
