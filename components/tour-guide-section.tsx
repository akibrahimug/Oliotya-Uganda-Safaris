import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function TourGuideSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative animate-fade-in-left">
            <div className="relative">
              <img src="/uganda-map-with-national-parks-markers.jpg" alt="Uganda Map" className="w-full h-auto rounded-2xl shadow-lg" />
              <div className="absolute top-1/4 left-1/4 animate-pulse">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                  <img
                    src="/bwindi-impenetrable-forest-gorillas.jpg"
                    alt="Bwindi"
                    className="relative w-24 h-24 rounded-lg shadow-xl border-4 border-white"
                  />
                </div>
              </div>
              <div className="absolute top-1/3 right-1/4 animate-pulse animation-delay-200">
                <img
                  src="/murchison-falls-uganda.jpg"
                  alt="Murchison Falls"
                  className="w-24 h-24 rounded-lg shadow-xl border-4 border-white"
                />
              </div>
              <div className="absolute bottom-1/3 left-1/3 bg-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-lg font-semibold">
                Bwindi Forest
              </div>
            </div>
          </div>

          <div className="animate-fade-in-right">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
              Uganda
              <br />
              <span className="text-primary">Tour Guide</span>
            </h2>
            <div className="w-20 h-1 bg-accent mb-6" />
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Bwindi Impenetrable Forest is home to half of the world's remaining mountain gorillas. This UNESCO World
              Heritage Site offers once-in-a-lifetime gorilla trekking experiences through ancient rainforests. Beyond
              gorillas, discover over 120 mammal species, 350 bird species, and breathtaking biodiversity in one of
              Africa's most pristine ecosystems.
            </p>
            <Button size="lg" className="group">
              See More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
