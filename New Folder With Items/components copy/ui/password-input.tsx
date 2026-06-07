"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

function PasswordInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        {...props}
        className={cn("pr-10, className")}
      />
      <span className="absolute top-2 right-1 cursor-pointer select-none">
        {showPassword ? (
          <EyeOffIcon
            onClick={() => {
              setShowPassword(false);
            }}
          />
        ) : (
          <EyeIcon
            onClick={() => {
              setShowPassword(true);
            }}
          />
        )}
      </span>
    </div>
  );
}

export { PasswordInput };
