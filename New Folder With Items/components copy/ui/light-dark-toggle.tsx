"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { MoonIcon, SunIcon } from "lucide-react";

type Props = {
  className?: string;
};

function LightDarkToggle({ className }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={className}
          onClick={() => {
            setIsDarkMode((prevValue) => !prevValue);
            document.body.classList.toggle("dark")
          }}
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </TooltipTrigger>
        <TooltipContent>
          {isDarkMode ? "enable light mode" : "enable dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LightDarkToggle;
