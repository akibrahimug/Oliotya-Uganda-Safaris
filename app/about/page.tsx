"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Heart, Target, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/uganda-safari-landscape-team-adventure.jpg" alt="Fox Adventures Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">About Fox Adventures</h1>
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
                Crafting Unforgettable <span className="text-primary">African Adventures</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Founded in 2009, Fox Adventures has been at the forefront of Uganda's tourism industry, showcasing the
                incredible beauty and diversity of the Pearl of Africa. Our journey began with a simple mission: to
                share the wonders of Uganda with the world.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Over the years, we've grown from a small local operator to one of Uganda's most trusted tour companies,
                serving thousands of satisfied travelers from around the globe. Our deep knowledge of Uganda's
                landscapes, wildlife, and culture sets us apart.
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

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-primary font-semibold mb-4">OUR VALUES</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">What Drives Us Forward</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values guide every adventure we create and every relationship we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Passion for Uganda",
                description:
                  "We're deeply passionate about showcasing Uganda's natural beauty, wildlife, and rich cultural heritage to the world.",
              },
              {
                icon: Shield,
                title: "Safety First",
                description:
                  "Your safety is our top priority. We maintain the highest safety standards in all our tours and activities.",
              },
              {
                icon: Users,
                title: "Expert Guides",
                description:
                  "Our experienced, knowledgeable guides are locals who bring destinations to life with their expertise.",
              },
              {
                icon: Target,
                title: "Personalized Service",
                description:
                  "Every traveler is unique. We tailor each experience to match your interests, pace, and preferences.",
              },
              {
                icon: Globe,
                title: "Sustainable Tourism",
                description:
                  "We're committed to responsible tourism that benefits local communities and protects Uganda's environment.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We strive for excellence in every detail, from planning to execution, ensuring unforgettable experiences.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-background p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15+", label: "Years Experience" },
              { number: "30+", label: "Destinations" },
              { number: "5000+", label: "Happy Travelers" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80 text-lg">{stat.label}</div>
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
              Our passionate team of travel experts and local guides are dedicated to creating your perfect Ugandan
              adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "David Okello",
                role: "Founder & CEO",
                image: "/african-male-tour-guide-professional.jpg",
              },
              {
                name: "Sarah Namukasa",
                role: "Head of Operations",
                image: "/african-female-tour-manager-professional.jpg",
              },
              {
                name: "James Mugisha",
                role: "Lead Safari Guide",
                image: "/african-male-safari-guide-professional.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Let us help you create memories that will last a lifetime. Explore Uganda with the experts who know it
              best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations">
                <Button size="lg" className="w-full sm:w-auto">
                  View Our Tours
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
