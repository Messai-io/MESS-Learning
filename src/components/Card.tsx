import { forwardRef, type HTMLAttributes } from 'react';

/**
 * Minimal surface container.
 *
 * This is a dependency-free stand-in for the `Card` in MESSAI's internal
 * design system (`@messai/ui`), which is not published. It reproduces the
 * default appearance — white surface, hairline border, base padding — using
 * stock Tailwind utilities only, so it renders correctly against any Tailwind
 * install without MESSAI's preset.
 *
 * `className` is appended last, so callers override padding or border freely:
 *   <Card className="p-4 border-2 border-amber-200">
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Render the hairline border. Default: true. */
  border?: boolean;
  /** Apply a subtle drop shadow. Default: false. */
  shadow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ border = true, shadow = false, className, children, ...props }, ref) => {
    const classes = [
      'bg-white',
      'p-6',
      border ? 'border border-black/10' : '',
      shadow ? 'shadow-sm' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
