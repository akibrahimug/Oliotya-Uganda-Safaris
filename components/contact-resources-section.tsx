import { BookOpen, Plane, Shield, CreditCard, ArrowRight } from "lucide-react";
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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-primary font-semibold mb-4 uppercase tracking-wide">
            Planning Resources
          </p>
          <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to Know
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our comprehensive guides and resources to help you plan the perfect Uganda safari adventure
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.map((resource, index) => {
            const IconComponent = getIcon(resource.icon);
            const LinkWrapper = resource.isExternal ? 'a' : Link;
            const linkProps = resource.isExternal
              ? { href: resource.linkUrl, target: "_blank", rel: "noopener noreferrer" }
              : { href: resource.linkUrl };

            return (
              <Card
                key={resource.id}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-background overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>

                  {/* Content */}
                  <h3 className="font-inter text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Link */}
                  <LinkWrapper
                    {...linkProps}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group/link"
                  >
                    {resource.linkText}
                    <ArrowRight className="h-5 w-5 group-hover/link:translate-x-1 transition-transform" />
                  </LinkWrapper>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto mt-16 text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="font-inter text-2xl font-bold mb-3">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let us help you create an unforgettable safari experience tailored to your interests and budget
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
              >
                Contact Us Today
              </a>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center px-8 py-3 bg-background text-foreground border-2 border-muted rounded-lg font-semibold hover:border-primary hover:text-primary transition-all"
              >
                View Safari Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
