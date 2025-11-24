"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ContactFormComponent } from "@/components/contact-form-component";

export function ContactFormSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-primary font-semibold mb-4">SEND US A MESSAGE</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
              Let's Plan Your <span className="text-primary">Perfect Safari</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <Card className="animate-fade-in-up border-2">
            <CardContent className="p-8">
              <ContactFormComponent />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
