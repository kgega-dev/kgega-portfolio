import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the props interface for the component
interface CtaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: React.ReactNode;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

// Reusable CtaCard component with a clean, modern layout
const CtaCard = React.forwardRef<HTMLDivElement, CtaCardProps>(
  ({ className, imageSrc, imageAlt, title, subtitle, description, buttonText, onButtonClick, secondaryButtonText, onSecondaryButtonClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-xl border bg-card text-card-foreground shadow",
          "flex flex-col md:flex-row", // Stacks on mobile, row on desktop
          className
        )}
        {...props}
      >
        {/* Image Section */}
        <div className="md:w-[40%] w-full aspect-square flex-shrink-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover aspect-square" // Enforce aspect ratio on img directly
          />
        </div>

        {/* Content Section */}
        <div className="md:w-[60%] w-full p-6 md:p-8 flex flex-col justify-center">
          <div>
            <p className="text-sm font-semibold text-primary">{title}</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              {subtitle}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 w-full">
              <Button size="lg" onClick={onButtonClick} className="w-full px-1 sm:px-4 text-[0.68rem] sm:text-sm">
                {buttonText}
              </Button>
              {secondaryButtonText && (
                <Button size="lg" variant="outline" onClick={onSecondaryButtonClick} className="cta-secondary-btn w-full px-1 sm:px-4 text-[0.68rem] sm:text-sm">
                  {secondaryButtonText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CtaCard.displayName = "CtaCard";

export { CtaCard };