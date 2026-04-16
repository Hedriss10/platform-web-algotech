import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

const selectBase =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition " +
  "hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

const selectError =
  "border-red-300 focus:border-red-500 focus:ring-red-500/20 hover:border-red-300";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, className, id: idProp, children, ...rest },
    ref
  ) {
    const reactId = useId();
    const safeId = idProp ?? `s-${reactId.replace(/:/g, "")}`;
    const errId = error ? `${safeId}-error` : undefined;

    return (
      <div
        className={["flex w-full flex-col gap-1.5", className]
          .filter(Boolean)
          .join(" ")}
      >
        <label
          htmlFor={safeId}
          className="text-sm font-semibold tracking-tight text-slate-800"
        >
          {label}
        </label>
        <select
          id={safeId}
          ref={ref}
          className={[selectBase, error ? selectError : ""]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={errId}
          {...rest}
        >
          {children}
        </select>
        {error ? (
          <p id={errId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
