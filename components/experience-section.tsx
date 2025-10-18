export function ExperienceSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <p className="text-muted-foreground mb-4">We are collectors of</p>
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 text-balance">
              Unique <span className="text-primary">Experiences</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-xl">
              Committed to be home country's traditional values and the highest possible standard and service. We focus
              on our customers needs and truly believe that if we get essential clients' holidays WINS made.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">30+</div>
                <div className="text-muted-foreground">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">15+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right">
            <div className="relative">
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Uganda Globe"
                className="w-full h-auto animate-float"
              />
              <div className="absolute -right-8 bottom-1/4 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-xl font-semibold animate-pulse">
                1 International Travel
              </div>
            </div>
            <div className="absolute -right-4 top-0 text-9xl font-bold text-muted/10 [writing-mode:vertical-lr] pointer-events-none">
              UGANDA
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
