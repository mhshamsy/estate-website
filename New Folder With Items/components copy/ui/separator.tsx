import * as React from 'react';
import { cn } from '@/lib/utils';

const separatorVariants = {
  default: 'bg-slate-200',
  primary: 'bg-slate-900',
};

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof separatorVariants;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'shrink-0 bg-slate-200',
        separatorVariants[variant],
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator, separatorVariants };
