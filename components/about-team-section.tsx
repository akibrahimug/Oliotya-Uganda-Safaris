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

interface TeamSectionData {
  heading: string;
  title: string;
  description: string;
}

interface AboutTeamSectionProps {
  members: TeamMember[];
  sectionData?: TeamSectionData | null;
}

export function AboutTeamSection({ members, sectionData }: AboutTeamSectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary font-semibold mb-4">
            {sectionData?.heading || "OUR TEAM"}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
            {sectionData?.title || "Meet the Nambi Uganda Safaris Family"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {sectionData?.description || "Our passionate team of travel experts and local guides are dedicated to creating your perfect Ugandan adventure"}
          </p>
        </div>

        {members && members.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                {/* Mobile: Text below image */}
                <div className="block md:hidden">
                  <div className="relative overflow-hidden rounded-2xl mb-6 cursor-pointer">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center space-y-3 px-2">
                    <h3 className="font-inter text-2xl font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-primary text-lg font-semibold">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-base font-medium">
                      {member.years} Experience
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                      {member.bio}
                    </p>
                    {specialties.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-bold text-muted-foreground tracking-wider">
                          SPECIALTIES
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {specialties.map((specialty: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tablet/Desktop: Overlay hover effect */}
                <div className="hidden md:block">
                  <div className="relative overflow-hidden rounded-2xl mb-4 cursor-pointer">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay that expands on hover */}
                    <div className="absolute inset-0 bg-foreground/97 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                      <div className="text-background transform scale-75 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100 w-full max-w-xs mx-auto overflow-y-auto max-h-full">
                        <div className="text-center mb-3">
                          <h3 className="font-inter text-xl font-bold mb-1 text-white">
                            {member.name}
                          </h3>
                          <p className="text-primary text-base font-bold mb-1">
                            {member.role}
                          </p>
                          <p className="text-white/90 text-sm font-medium">
                            {member.years} Experience
                          </p>
                        </div>

                        <p className="text-white text-sm leading-relaxed mb-4 text-center">
                          {member.bio}
                        </p>

                        {specialties.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-white/95 text-center mb-2 tracking-wider">
                              SPECIALTIES
                            </p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {specialties.map((specialty: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-lg"
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
                  <div className="text-center space-y-1">
                    <h3 className="font-inter text-lg font-bold">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium text-sm">{member.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground text-sm">
                Add team members through the CMS to showcase your team here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
