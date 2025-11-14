"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { getImageSrc } from "@/lib/image-utils";

export function TourGuideSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative animate-fade-in-left">
            <div className="relative">
              <img
                src={getImageSrc("/uganda-map-with-national-parks-markers.svg")}
                alt="Uganda Map"
                className="w-full "
              />
            </div>
          </div>

          <div className="animate-fade-in-right">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
              Escape the
              <br />
              <span className="text-primary">Ordinary</span>
            </h2>
            <div className="w-20 h-1 bg-accent mb-6" />
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Nambi Uganda Safaris is a safari company that offers customized
              tours to experience the extra ordinary landscape and wildlife of
              Uganda. The company's tours include cultural experiences, wildlife
              tours, hiking tours, and special occasion tours.
              {isExpanded && (
                <>
                  {" "}
                  They take care of everything, from the pick-up and drop-off at
                  the airport to booking hotels. Nambi Uganda Safaris is
                  committed to providing the best experience possible, and their
                  team pays close attention to every detail to ensure that each
                  safari is unique and tailored to the customer's needs. With a
                  dedicated tour guide assigned to each customer, Nambi Uganda
                  Safaris aims to provide an unforgettable Ugandan safari
                  experience. At Nambi Uganda Safaris, we pride ourselves on
                  promoting responsible and sustainable tourism. We believe in
                  preserving the natural environment and local communities while
                  providing unforgettable experiences for our customers. We work
                  closely with local communities and conservation organizations
                  to create safari experiences that benefit both the environment
                  and the people living in the area. Our goal is to leave a
                  positive impact on the communities we visit while providing
                  our customers with an authentic Ugandan safari experience. By
                  traveling with us, you can be confident that you are
                  contributing to the preservation of Uganda's natural and
                  cultural heritage.
                </>
              )}
            </p>
            <Button
              size="lg"
              className="group"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Read Less" : "Read More"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
