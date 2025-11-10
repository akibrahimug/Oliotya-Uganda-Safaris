"use client";

import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function FAQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">FAQs</h1>
        <p className="text-muted-foreground">
          Manage frequently asked questions
        </p>
      </div>

      <Card className="p-12">
        <div className="text-center">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            FAQ management is under development
          </p>
        </div>
      </Card>
    </div>
  );
}
