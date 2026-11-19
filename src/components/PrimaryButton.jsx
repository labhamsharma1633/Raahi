import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'accent', 'outline', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = true,
  className = ''
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-[0.98] select-none rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeStyles = {
    sm: "text-xs py-2 px-3 gap-1.5",
    md: "text-sm py-3 px-4 gap-2",
    lg: "text-base py-3.5 px-6 gap-2.5"
  };

  const variantStyles = {
    primary: "bg-raahi-teal hover:bg-[#092B2D] text-white shadow-md shadow-teal-950/20 focus:ring-teal-700",
    secondary: "bg-[#E2ECF2] hover:bg-[#D5E3EB] text-raahi-teal font-semibold focus:ring-teal-300",
    accent: "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md shadow-amber-900/10 focus:ring-amber-400",
    outline: "bg-transparent border border-raahi-border hover:bg-slate-50 text-slate-700 focus:ring-slate-300",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-400"
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = (disabled || loading) ? "opacity-60 cursor-not-allowed active:scale-100" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${disabledStyle} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
