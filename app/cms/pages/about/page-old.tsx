"use client";

import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPageEditor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About Page Editor</h1>
        <p className="text-muted-foreground">
          Manage content for the About page
        </p>
      </div>

      <Card className="p-12">
        <div className="text-center">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            The About page editor is under development
          </p>
        </div>
      </Card>
    </div>
  );
}
