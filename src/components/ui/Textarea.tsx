import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-app-text-primary-light mb-2 dark:text-app-text-primary-dark">{label}</label>}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 border rounded-lg outline-none transition resize-none
            bg-app-card-light text-app-text-primary-light placeholder:text-app-text-muted-light dark:bg-app-card-dark dark:text-app-text-primary-dark dark:placeholder:text-app-text-muted-dark
            ${error ? "border-danger-500 focus:ring-2 focus:ring-danger-500/20 dark:bg-danger-900/10" : "border-app-border-light focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 dark:border-app-border-dark dark:focus:border-brand-400"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-danger-600 font-medium dark:text-danger-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
