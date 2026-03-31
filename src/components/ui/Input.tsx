import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  rightIcon?: ReactNode; // أيقونة في البداية (يمين)
  leftIcon?: ReactNode;  // أيقونة في النهاية (يسار)
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, wrapperClassName = "w-full", rightIcon, leftIcon, className = "", ...props }, ref) => {
    return (
      <div className={wrapperClassName}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>}
          <input
            ref={ref}
            className={`
              w-full border rounded-lg outline-none transition
              ${error ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-indigo-100"}
              disabled:bg-gray-50 disabled:text-gray-500
              ${rightIcon ? "pr-10" : "pr-4"}
              ${leftIcon ? "pl-10" : "pl-4"}
              ${className.includes('py-') || className.includes('p-') ? '' : 'py-2.5'}
              ${className}
            `}
            {...props}
          />
          {leftIcon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{leftIcon}</div>}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";