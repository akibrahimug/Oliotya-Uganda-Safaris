import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface ContactFAQSectionProps {
  data: FAQ[];
}

export function ContactFAQSection({ data }: ContactFAQSectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-primary font-semibold mb-4 uppercase tracking-wide">
            Have Questions?
          </p>
          <h2 className="font-inter text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find quick answers to common questions about planning your safari adventure
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <Accordion type="single" collapsible className="space-y-4">
            {data.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="bg-muted/30 rounded-xl border-0 px-6 py-2 hover:bg-muted/50 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-lg py-6 hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pt-2 leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                    className="prose prose-sm max-w-none"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Below FAQ */}
        <div className="max-w-4xl mx-auto mt-16 text-center animate-fade-in-up">
          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8">
            <h3 className="font-inter text-2xl font-bold mb-3">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you plan the perfect safari adventure.
              Reach out and we'll get back to you within 24 hours.
            </p>
            <a
              href="#contact-form"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
