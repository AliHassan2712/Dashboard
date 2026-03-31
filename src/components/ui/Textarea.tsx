import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 border rounded-lg outline-none transition resize-none
            ${error ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-300 focus:ring-2 focus:ring-indigo-100"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";