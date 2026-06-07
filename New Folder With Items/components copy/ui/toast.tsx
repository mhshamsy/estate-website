'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

import { cn } from '@/lib/utils';

// ============================================
// Toast Variants
// ============================================
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-white text-slate-950',
        success:
          'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200',
        warning:
          'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200',
        destructive:
          'border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200',
        loading: 'border-slate-200 bg-white text-slate-950',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// ============================================
// Toast Provider
// ============================================
const ToastProvider = ToastPrimitives.Provider;

// ============================================
// Toast Viewport
// ============================================
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// ============================================
// Toast Component
// ============================================
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

// ============================================
// Toast Action
// ============================================
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

// ============================================
// Toast Close
// ============================================
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute top-2 right-2 rounded-md p-1 text-slate-950/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-950 focus:opacity-100 focus:ring-2 focus:outline-none',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

// ============================================
// Toast Title
// ============================================
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

// ============================================
// Toast Description
// ============================================
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// ============================================
// Toast Icon Component
// ============================================
interface ToastIconProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'loading';
}

const ToastIcon = ({ variant = 'default' }: ToastIconProps) => {
  const iconClass = 'h-5 w-5 shrink-0';

  switch (variant) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
    case 'destructive':
      return <AlertCircle className={`${iconClass} text-red-600`} />;
    case 'loading':
      return <Loader2 className={`${iconClass} animate-spin text-slate-600`} />;
    default:
      return null;
  }
};

// ============================================
// Toast Footer (for meta info)
// ============================================
const ToastFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 text-xs opacity-70', className)}
    {...props}
  />
));
ToastFooter.displayName = 'ToastFooter';

// ============================================
// Exports
// ============================================
export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
  ToastFooter,
  toastVariants,
};
