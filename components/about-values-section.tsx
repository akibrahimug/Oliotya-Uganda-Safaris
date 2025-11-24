import { Award, Users, Globe, Heart, Target, Shield } from "lucide-react";

interface Value {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}

interface AboutValuesSectionProps {
  values: Value[];
}

const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Heart,
    Shield,
    Users,
    Globe,
    Target,
    Award,
  };
  return icons[iconName] || Heart;
};

export function AboutValuesSection({ values }: AboutValuesSectionProps) {
  if (!values || values.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary font-semibold mb-4">OUR VALUES</p>
          <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6 text-balance">
            What Drives Us <span className="text-primary">Forward</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our core values guide every adventure we create and every relationship we build with our travelers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const IconComponent = getIcon(value.icon);
            return (
              <div
                key={value.id}
                className="group relative bg-background p-8 rounded-2xl border-2 border-border hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-inter text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
