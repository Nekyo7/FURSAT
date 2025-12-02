import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold uppercase tracking-wide transition-all duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]",
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]",
        outline:
          "bg-background text-foreground shadow-sm hover:bg-secondary hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]",
        ghost:
          "border-transparent hover:bg-muted hover:border-foreground",
        link:
          "border-transparent underline-offset-4 hover:underline",
        hero:
          "bg-secondary text-secondary-foreground shadow-md hover:shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] text-lg",
        success:
          "bg-success text-success-foreground shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]",
        info:
          "bg-info text-info-foreground shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px]",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
