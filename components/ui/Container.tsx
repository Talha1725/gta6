import { ContainerProps } from "@/types";
import React from "react";

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  fluid = false,
  maxWidth = "xl",
  padding = "md",
}) => {
  // Max-width classes
  const maxWidthClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
    "7xl": "max-w-7xl",
  };

  // Padding classes
  const paddingClasses = {
    none: "",
    sm: "px-2 sm:px-4",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12",
  };

  // Combine classes
  const containerClasses = [
    fluid ? "w-full" : "mx-auto",
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={containerClasses}>{children}</div>;
};

export default Container;
