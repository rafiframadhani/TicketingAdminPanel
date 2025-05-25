// src/components/ui/button.jsx
import * as React from "react";
import { cn } from "../../lib/utils"; // Pastikan path ini benar
import { Loader2 } from 'lucide-react'; // Import ikon loader jika dibutuhkan, atau ikon lain

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  caution: "bg-orange-500 text-white hover:bg-orange-600",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-700 text-white hover:bg-green-800",
  outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100",
  primary: "bg-gray-800 text-white hover:bg-gray-900",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  ghost: "hover:bg-gray-100 hover:text-gray-900",
  link: "text-blue-600 underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-10 w-10", // Untuk tombol hanya ikon
};

export const Button = React.forwardRef(
  ({ className, children, onClick, variant = "default", size = "default", icon: Icon, isLoading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={isLoading} // Nonaktifkan tombol saat loading
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Ikon loading */}
        {Icon && !isLoading && <Icon className="mr-2 h-4 w-4" />} {/* Tampilkan ikon hanya jika tidak loading */}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";