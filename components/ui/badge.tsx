"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================
// Badge Variants
// ============================================
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // ✅ Default - Dark solid
        default:
          "border-transparent bg-slate-900 text-white hover:bg-slate-900/80",

        // ✅ Secondary - Light gray
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",

        // ✅ Outline - Border only
        outline:
          "text-slate-950 border-slate-200 hover:bg-slate-100 hover:text-slate-900",

        // ✅ Destructive - Red
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-500/80",

        // ✅ Success - Green
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-500/80",

        //✅ Primary
        primary: "bg-sky-600 text-white border-transparent",

        // ✅ Warning - Yellow/Orange
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",

        // ✅ Info - Blue
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",

        // ✅ Purple
        purple:
          "border-transparent bg-purple-500 text-white hover:bg-purple-500/80",

        // ✅ Pink
        pink: "border-transparent bg-pink-500 text-white hover:bg-pink-500/80",

        // ✅ Gradient variants
        gradient:
          "border-transparent bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:from-slate-800 hover:to-slate-600",

        gradientSuccess:
          "border-transparent bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-400",

        gradientDanger:
          "border-transparent bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-500 hover:to-rose-400",

        // ✅ Soft variants (lighter backgrounds)
        soft: "border-transparent bg-slate-100 text-slate-900",

        softSuccess:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80",

        softWarning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",

        softDanger:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-100/80",

        softInfo:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ============================================
// Badge Component
// ============================================
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// ============================================
// Badge with Dot (status indicator)
// ============================================
interface BadgeDotProps extends BadgeProps {
  dotColor?: string;
}

const BadgeDot = React.forwardRef<HTMLDivElement, BadgeDotProps>(
  ({ className, variant, size, dotColor, children, ...props }, ref) => {
    const dotColors: Record<string, string> = {
      default: "bg-white",
      secondary: "bg-slate-700",
      outline: "bg-slate-500",
      destructive: "bg-white",
      success: "bg-white",
      warning: "bg-white",
      info: "bg-white",
      purple: "bg-white",
      pink: "bg-white",
    };

    return (
      <Badge
        ref={ref}
        variant={variant}
        size={size}
        className={cn("gap-1.5", className)}
        {...props}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotColor || dotColors[variant || "default"]
          )}
        />
        {children}
      </Badge>
    );
  }
);
BadgeDot.displayName = "BadgeDot";

// ============================================
// Badge with Icon
// ============================================
interface BadgeIconProps extends BadgeProps {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}

const BadgeIcon = React.forwardRef<HTMLDivElement, BadgeIconProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Badge
        ref={ref}
        variant={variant}
        size={size}
        className={cn("gap-1", className)}
        {...props}
      >
        {iconPosition === "left" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </Badge>
    );
  }
);
BadgeIcon.displayName = "BadgeIcon";

// ============================================
// Badge Group (multiple badges)
// ============================================
interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "gap-1" | "gap-2" | "gap-3" | "gap-4";
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ className, gap = "gap-1", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center", gap, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BadgeGroup.displayName = "BadgeGroup";

// ============================================
// Count Badge (notification count)
// ============================================
interface BadgeCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
  showZero?: boolean;
}

const BadgeCount = React.forwardRef<HTMLSpanElement, BadgeCountProps>(
  ({ className, count, max = 99, showZero = false, ...props }, ref) => {
    const displayCount = count > max ? `${max}+` : count;

    if (count === 0 && !showZero) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-medium",
          count === 0 ? "bg-slate-100 text-slate-600" : "bg-red-500 text-white",
          className
        )}
        {...props}
      >
        {displayCount}
      </span>
    );
  }
);
BadgeCount.displayName = "BadgeCount";

// ============================================
// Status Badge (pre-configured status badges)
// ============================================
type StatusType =
  | "online"
  | "offline"
  | "busy"
  | "away"
  | "pending"
  | "approved"
  | "rejected"
  | "draft"
  | "published"
  | "archived";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  showLabel?: boolean;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    variant: VariantProps<typeof badgeVariants>["variant"];
    dotColor: string;
  }
> = {
  online: { label: "آنلاین", variant: "success", dotColor: "bg-green-500" },
  offline: { label: "آفلاین", variant: "secondary", dotColor: "bg-slate-400" },
  busy: { label: "مشغول", variant: "destructive", dotColor: "bg-red-500" },
  away: {
    label: "دور از دسترس",
    variant: "warning",
    dotColor: "bg-yellow-500",
  },
  pending: {
    label: "در انتظار",
    variant: "warning",
    dotColor: "bg-yellow-500",
  },
  approved: {
    label: "تأیید شده",
    variant: "success",
    dotColor: "bg-green-500",
  },
  rejected: { label: "رد شده", variant: "destructive", dotColor: "bg-red-500" },
  draft: { label: "پیش‌نویس", variant: "secondary", dotColor: "bg-slate-400" },
  published: {
    label: "منتشر شده",
    variant: "success",
    dotColor: "bg-green-500",
  },
  archived: {
    label: "آرشیو شده",
    variant: "outline",
    dotColor: "bg-slate-400",
  },
};

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, showLabel = true, className, ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <BadgeDot
        ref={ref}
        variant={config.variant}
        dotColor={config.dotColor}
        className={className}
        {...props}
      >
        {showLabel && config.label}
      </BadgeDot>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

// ============================================
// Role Badge (pre-configured role badges)
// ============================================
type RoleType = "admin" | "editor" | "user" | "guest" | "moderator" | "vip";

interface RoleBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  role: RoleType;
}

const roleConfig: Record<
  RoleType,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  admin: { label: "مدیر", variant: "destructive" },
  editor: { label: "ویرایشگر", variant: "info" },
  user: { label: "کاربر", variant: "secondary" },
  guest: { label: "مهمان", variant: "outline" },
  moderator: { label: "ناظر", variant: "purple" },
  vip: { label: "VIP", variant: "gradient" },
};

const RoleBadge = React.forwardRef<HTMLDivElement, RoleBadgeProps>(
  ({ role, className, ...props }, ref) => {
    const config = roleConfig[role];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={className}
        {...props}
      >
        {config.label}
      </Badge>
    );
  }
);
RoleBadge.displayName = "RoleBadge";

// ============================================
// Exports
// ============================================
export {
  Badge,
  BadgeDot,
  BadgeIcon,
  BadgeGroup,
  BadgeCount,
  StatusBadge,
  RoleBadge,
  badgeVariants,
};
