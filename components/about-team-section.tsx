import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  years: string;
  specialties: string[] | any; // Can be Json type from Prisma
  displayOrder: number;
  active: boolean;
}

interface AboutTeamSectionProps {
  members: TeamMember[];
}

export function AboutTeamSection({ members }: AboutTeamSectionProps) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary font-semibold mb-4">OUR TEAM</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
            Meet the Nambi Uganda Safaris Family
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our passionate team of travel experts and local guides are dedicated to creating your perfect Ugandan adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, index) => {
            // Safely handle specialties (could be Json or array)
            const specialties = Array.isArray(member.specialties)
              ? member.specialties
              : [];

            return (
              <div
                key={member.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 cursor-pointer">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay that expands on hover */}
                  <div className="absolute inset-0 bg-foreground/97 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                    <div className="text-background transform scale-75 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                      <div className="text-center mb-4">
                        <h3 className="font-inter text-2xl font-bold mb-1 text-white">
                          {member.name}
                        </h3>
                        <p className="text-primary text-base font-bold mb-1">
                          {member.role}
                        </p>
                        <p className="text-white/80 text-sm font-medium">
                          {member.years} Experience
                        </p>
                      </div>

                      <p className="text-white text-sm leading-relaxed mb-5 text-center">
                        {member.bio}
                      </p>

                      {specialties.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-white/90 text-center mb-3 tracking-wider">
                            SPECIALTIES
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {specialties.map((specialty: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-lg"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="font-inter text-xl font-bold mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-sm">{member.role}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
