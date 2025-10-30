"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Award, Users, Globe, Heart, Target, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/uganda-safari-landscape-team-adventure.jpg"
            alt="Fox Adventures Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">
            About Fox Adventures
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-balance">
            Your trusted partner in discovering the Pearl of Africa
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <p className="text-primary font-semibold mb-4">OUR STORY</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
                Crafting Unforgettable{" "}
                <span className="text-primary">African Adventures</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We are Fox Adventures Africa, a safari company founded out of a
                passion for the people, extraordinary landscape, and wildlife of
                Africa. Our company arranges a variety of tours and we can, of
                course, customize the experience to fit the customers’
                interests.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                This means a combination of cultural experiences together with
                wildlife tours, hiking tours, and of course special location
                tours like an escape to celebrate your honeymoon, Volunteering
                trips, tourism internships, and social work internships. We take
                care of everything from the pickup and drop off at the airport
                to the booking of the customers’ hotels.
              </p>
              <Link href="/destinations">
                <Button size="lg" className="mt-4">
                  Explore Our Tours
                </Button>
              </Link>
            </div>
            <div className="relative animate-fade-in-right">
              <img
                src="/uganda-gorilla-trekking-adventure.jpg"
                alt="Uganda Adventure"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Community Impact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <p className="text-primary font-semibold mb-4">COMMUNITY IMPACT</p>
              <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6 text-balance">
                Giving Back Through{" "}
                <span className="text-primary">Akaana Foundation</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                At Fox Adventures, we believe in making a positive impact beyond tourism.
                We're proud partners of Akaana Foundation Africa, a nonprofit organization
                dedicated to supporting street children in Kampala.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Through this partnership, a portion of every tour helps fund education,
                shelter, and rehabilitation programs for vulnerable children, creating
                lasting change in our community.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.akaanafoundation.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="gap-2">
                    <Heart className="h-5 w-5" />
                    Learn More About Akaana
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Supporting Children</h3>
                      <p className="text-muted-foreground">
                        Providing education and safe environments for street children in Kampala
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Globe className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Community Development</h3>
                      <p className="text-muted-foreground">
                        Empowering local communities through sustainable tourism initiatives
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Target className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Long-term Impact</h3>
                      <p className="text-muted-foreground">
                        Creating lasting change through education, rehabilitation, and support programs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "8+", label: "Years Experience" },
              { number: "10+", label: "Destinations" },
              { number: "1200+", label: "Happy Travelers" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/80 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-primary font-semibold mb-4">OUR TEAM</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
              Meet the Fox Adventures Family
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our passionate team of travel experts and local guides are
              dedicated to creating your perfect Ugandan adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "David Okello",
                role: "Founder & CEO",
                image: "/african-male-tour-guide-professional.jpg",
                bio: "With over 15 years of experience in tourism, David founded Fox Adventures to share his passion for Uganda's wildlife and culture.",
                specialties: ["Safari Planning", "Wildlife Conservation", "Business Strategy"],
                years: "15+ Years",
              },
              {
                name: "Sarah Namukasa",
                role: "Head of Operations",
                image: "/african-female-tour-manager-professional.jpg",
                bio: "Sarah ensures every detail of your journey is perfect, from booking to the final farewell. Her attention to detail is unmatched.",
                specialties: ["Logistics Management", "Customer Service", "Team Coordination"],
                years: "10+ Years",
              },
              {
                name: "James Mugisha",
                role: "Lead Safari Guide",
                image: "/african-male-safari-guide-professional.jpg",
                bio: "A certified safari guide with deep knowledge of Uganda's ecosystems, James brings every adventure to life with his expertise and enthusiasm.",
                specialties: ["Wildlife Tracking", "Bird Watching", "Cultural Tours"],
                years: "12+ Years",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 cursor-pointer">
                  <img
                    src={member.image || "/placeholder.svg"}
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

                      <div className="space-y-2">
                        <p className="text-xs font-bold text-white/90 text-center mb-3 tracking-wider">
                          SPECIALTIES
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {member.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-lg"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-inter text-xl font-bold mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block mb-6">
              <div className="bg-primary text-primary-foreground px-4 py-2 text-base rounded-full font-medium">
                Join Thousands of Happy Travelers
              </div>
            </div>
            <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6 text-balance">
              Ready to Start Your <span className="text-primary">Uganda Adventure</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              Let our expert team craft a personalized safari experience tailored to your dreams.
              From gorilla trekking to cultural tours, your perfect adventure awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl gap-2">
                  Explore Our Destinations
                  <Award className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2"
                >
                  Get Custom Itinerary
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              🌟 98% Customer Satisfaction • 🏆 Award-Winning Service • 💚 Eco-Friendly Tours
            </p>
          </div>
        </div>
      </section>
      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-primary font-semibold mb-4">OUR VALUES</p>
            <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6 text-balance">
              What Drives Us <span className="text-primary">Forward</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values guide every adventure we create and every
              relationship we build with our travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Passion for Uganda",
                description:
                  "We're deeply passionate about showcasing Uganda's natural beauty, wildlife, and rich cultural heritage to the world. Every tour is crafted with love for our country.",
              },
              {
                icon: Shield,
                title: "Safety & Security",
                description:
                  "Your safety is our top priority. We maintain the highest safety standards, use well-maintained vehicles, and employ experienced guides trained in emergency response.",
              },
              {
                icon: Users,
                title: "Local Expertise",
                description:
                  "Our experienced, knowledgeable guides are locals who bring destinations to life with authentic stories, deep cultural insights, and genuine connections.",
              },
              {
                icon: Globe,
                title: "Sustainable Tourism",
                description:
                  "We're committed to responsible tourism that benefits local communities, protects wildlife, and preserves Uganda's pristine environment for future generations.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group relative bg-background p-8 rounded-2xl border-2 border-border hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-7 h-7 text-primary-foreground" />
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
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
