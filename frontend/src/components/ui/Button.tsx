// src/components/ui/button.tsx
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'icon'
  size?: 'default' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            'default': "bg-waikawa-600 text-white hover:bg-waikawa-700",
            'outline': "border border-waikawa-200 bg-transparent hover:bg-waikawa-100",
            'icon': "h-10 w-10 p-0"
          }[variant],
          {
            'default': "h-10 px-4 py-2",
            'lg': "h-11 px-8",
            'icon': "h-10 w-10"
          }[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"