interface ScrollIndicatorProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

export function ScrollIndicator({
  total,
  current,
  onDotClick,
}: ScrollIndicatorProps) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
