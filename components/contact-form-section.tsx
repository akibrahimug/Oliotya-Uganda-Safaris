"use client";

import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactFormComponent } from "@/components/contact-form-component";

interface ContactFormSectionProps {
  infoData?: {
    email: string;
    phone: string;
    whatsapp: string;
    office: string;
    businessHours: {
      monFri: string;
      sat: string;
      sun: string;
    };
    quickResponse: string;
  } | null;
}

export function ContactFormSection({ infoData }: ContactFormSectionProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wide">
            Get In Touch
          </p>
          <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6">
            Let's Plan Your <span className="text-primary">Perfect Safari</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you have questions or you're ready to start your adventure,
            we're here to help. Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Information Sidebar */}
          {infoData && (
            <div className="lg:col-span-1 space-y-6 animate-fade-in">
              {/* Main Contact Card */}
              <Card className="border-0 shadow-lg bg-background">
                <CardContent className="p-8">
                  <h3 className="font-inter text-2xl font-bold mb-8">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-sm uppercase tracking-wide text-muted-foreground">
                          Email
                        </p>
                        <a
                          href={`mailto:${infoData.email}`}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          {infoData.email}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-sm uppercase tracking-wide text-muted-foreground">
                          Phone
                        </p>
                        <a
                          href={`tel:${infoData.phone}`}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          {infoData.phone}
                        </a>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-sm uppercase tracking-wide text-muted-foreground">
                          WhatsApp
                        </p>
                        <a
                          href={`https://wa.me/${infoData.whatsapp.replace(/[\s\+\-\(\)]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          Chat with us
                        </a>
                      </div>
                    </div>

                    {/* Office */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-sm uppercase tracking-wide text-muted-foreground">
                          Office
                        </p>
                        <p className="text-foreground font-medium">
                          {infoData.office}
                        </p>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                          Business Hours
                        </p>
                        <div className="space-y-1 text-foreground font-medium text-sm">
                          <p>{infoData.businessHours.monFri}</p>
                          <p>{infoData.businessHours.sat}</p>
                          <p>{infoData.businessHours.sun}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Response Card */}
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-inter text-lg font-bold mb-2">
                        Quick Response
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {infoData.quickResponse}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Form */}
          <div className={infoData ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card className="border-0 shadow-xl animate-fade-in-up">
              <CardContent className="p-8 md:p-12">
                <ContactFormComponent />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
