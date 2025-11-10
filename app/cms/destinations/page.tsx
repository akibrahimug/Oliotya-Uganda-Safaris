"use client";

import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function DestinationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Destinations</h1>
        <p className="text-muted-foreground">
          Manage your travel destinations
        </p>
      </div>

      <Card className="p-12">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            Destination management is under development
          </p>
        </div>
      </Card>
    </div>
  );
}
