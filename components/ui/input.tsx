import * as React from "react";
import { cn } from "@/lib/utils";

type RuleType = "text" | "email" | "number";

export type ValidationRule = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  type?: RuleType;
  message?: string;
};

// Correctly extend input props by omitting `value` and `onChange`
export interface InputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  label?: string;
  rules?: ValidationRule[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode; // new prop for icon
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, rules = [], value, onChange, className, type = "text", icon, ...props }, ref) => {
    const [error, setError] = React.useState("");

    const validate = (val: string) => {
      for (const rule of rules) {
        // Required check
        if (rule.required && !val.trim()) {
          setError(rule.message || "This field is required");
          return false;
        }
    
        // Min length check (applies to any string/number)
        if (rule.min !== undefined) {
          if (val.length < rule.min) {
            setError(rule.message || `Minimum ${rule.min} characters required`);
            return false;
          }
        }
    
        // Max length check (applies to any string/number)
        if (rule.max !== undefined) {
          if (val.length > rule.max) {
            setError(rule.message || `Maximum ${rule.max} characters allowed`);
            return false;
          }
        }
    
        // Type-specific checks
        if (rule.type === "text") {
          // Optional: you can add extra text rules, e.g., letters only
          if (/[\d]/.test(val)) {
            setError(rule.message || "Text cannot contain numbers");
            return false;
          }
        }
    
        if (rule.type === "email") {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(val)) {
            setError(rule.message || "Invalid email address");
            return false;
          }
        }
    
        if (rule.type === "number") {
          const num = Number(val);
          if (isNaN(num)) {
            setError(rule.message || "Must be a number");
            return false;
          }
          if (rule.min !== undefined && num < rule.min) {
            setError(rule.message || `Minimum value is ${rule.min}`);
            return false;
          }
          if (rule.max !== undefined && num > rule.max) {
            setError(rule.message || `Maximum value is ${rule.max}`);
            return false;
          }
        }
    
        // Pattern check
        if (rule.pattern && !rule.pattern.test(val)) {
          setError(rule.message || "Invalid format");
          return false;
        }
      }
    
      // All rules passed
      setError("");
      return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange(val);
      validate(val);
    };

    return (
      <div className="flex flex-col w-full">
        {label && <label className="mb-1 text-sm font-medium">{label}</label>}

        <div className="relative flex-1">
        
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          className={cn(
            "h-9 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error ? "border-red-500 focus-visible:ring-red-500" : "",
            className
          )}
          {...props}
        />
        </div>
        {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
