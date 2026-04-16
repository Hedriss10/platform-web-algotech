import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold " +
  "transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-55 " +
  "min-h-[2.75rem]";

const primary =
  "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 " +
  "hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-600/35 active:translate-y-px " +
  "focus:ring-blue-500/30";

const secondary =
  "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50 " +
  "focus:ring-slate-400/20";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      fullWidth,
      loading,
      className,
      disabled,
      children,
      type = "button",
      ...rest
    },
    ref
  ) {
    const variantClasses = variant === "secondary" ? secondary : primary;
    const classes = [
      base,
      variantClasses,
      fullWidth ? "w-full" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled ?? loading}
        aria-busy={loading ? true : undefined}
        {...rest}
      >
        {loading ? (
          <>
            <span
              className={
                variant === "secondary"
                  ? "h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
                  : "h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
              }
              aria-hidden
            />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
