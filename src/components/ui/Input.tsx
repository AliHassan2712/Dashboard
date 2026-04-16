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
          <label className="text-sm font-bold text-slate-800">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* أيقونة اليمين (الافتراضية) */}
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}

          {/* أيقونة اليسار (مثل رمز الشيكل ₪) */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-black">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full bg-white px-4 py-3 rounded-xl outline-none transition-all
              text-sm font-bold text-slate-900 
              border-2 
              ${icon ? "pr-10" : ""}
              ${leftIcon ? "pl-10" : ""} 
              ${
                error 
                  ? "border-rose-500 focus:ring-4 focus:ring-rose-500/20 bg-rose-50/50" 
                  : "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 hover:border-slate-300"
              }
              placeholder:text-slate-400 placeholder:opacity-100
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";