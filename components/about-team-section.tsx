import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  years: string;
  specialties: string[];
}

interface AboutTeamSectionProps {
  data: TeamMember[];
}

export function AboutTeamSection({ data }: AboutTeamSectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-4">OUR TEAM</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Meet the Nambi Uganda Safaris Family
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our passionate team of travel experts and local guides
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.filter(m => m).map((member) => (
            <div key={member.id} className="bg-muted/30 rounded-2xl overflow-hidden border-2 border-border">
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.years}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <div className="text-center">
            <Badge variant="secondary">No team members yet</Badge>
          </div>
        )}
      </div>
    </section>
  );
}
