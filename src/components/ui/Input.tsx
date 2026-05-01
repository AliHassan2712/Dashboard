import { InputHTMLAttributes, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  wrapperClassName?: string; 
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, leftIcon, wrapperClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label className="text-sm font-bold text-app-text-primary-light dark:text-app-text-primary-dark">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* أيقونة اليمين (الافتراضية) */}
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-secondary-light dark:text-app-text-secondary-dark">
              {icon}
            </div>
          )}

          {/* أيقونة اليسار (مثل رمز الشيكل ₪) */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary-light font-black dark:text-app-text-secondary-dark">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full bg-app-card-light px-4 py-3 rounded-xl outline-none transition-all dark:bg-app-card-dark
              text-sm font-bold text-app-text-primary-light dark:text-app-text-primary-dark
              border-2 
              ${icon ? "pr-10" : ""}
              ${leftIcon ? "pl-10" : ""} 
              ${
                error 
                  ? "border-danger-500 focus:ring-4 focus:ring-danger-500/20 bg-danger-50/50 dark:bg-danger-900/10"
                  : "border-app-border-light focus:border-brand-600 focus:ring-4 focus:ring-brand-600/20 hover:border-zinc-300 dark:border-app-border-dark dark:focus:border-brand-400 dark:hover:border-zinc-700"
              }
              placeholder:text-app-text-muted-light placeholder:opacity-100 dark:placeholder:text-app-text-muted-dark
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <span className="text-xs font-bold text-danger-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
