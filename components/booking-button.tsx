"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BookingButtonProps {
  packageName: string;
  packageSlug: string;
  maxTravelers: number;
  price: number;
  packageId?: number;
}

export function BookingButton({
  packageName,
  packageSlug,
  maxTravelers,
  price,
  packageId,
}: BookingButtonProps) {
  const router = useRouter();

  const handleBookingClick = () => {
    if (packageId) {
      router.push(`/book/${packageSlug}`);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full shadow-lg hover:shadow-xl"
      onClick={handleBookingClick}
    >
      Book This Safari
    </Button>
  );
}
