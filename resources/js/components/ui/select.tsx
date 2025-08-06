import React from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

// Simple select component using native HTML select
const Select = ({ children, className, ...props }: SelectProps) => (
  <select
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

// These are placeholder components for compatibility but not used with native select
const SelectTrigger = ({ children, className }: SelectTriggerProps) => (
  <div className={className}>
    {children}
  </div>
);

const SelectContent = ({ children }: SelectContentProps) => (
  <div>
    {children}
  </div>
);

const SelectItem = ({ value, children }: SelectItemProps) => (
  <option value={value}>
    {children}
  </option>
);

const SelectValue = ({ placeholder }: SelectValueProps) => (
  <span>{placeholder}</span>
);

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }