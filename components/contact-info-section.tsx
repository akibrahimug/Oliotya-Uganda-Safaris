import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContactInfoSectionProps {
  data: {
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
  };
}

export function ContactInfoSection({ data }: ContactInfoSectionProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-inter text-xl font-bold mb-6">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Email</p>
                <a
                  href={`mailto:${data.email}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {data.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Phone</p>
                <a
                  href={`tel:${data.phone}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {data.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <a
                  href={`https://wa.me/${data.whatsapp.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Click here to chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Office</p>
                <p className="text-muted-foreground">{data.office}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Business Hours</p>
                <p className="text-muted-foreground">{data.businessHours.monFri}</p>
                <p className="text-muted-foreground">{data.businessHours.sat}</p>
                <p className="text-muted-foreground">{data.businessHours.sun}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-inter text-lg font-bold mb-3">
            Quick Response
          </h3>
          <p className="text-sm text-muted-foreground">
            {data.quickResponse}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
