import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

/**
 * Labeled auth input with an associated inline error.
 * Error is text + icon, never color alone; described via aria-describedby.
 */
export function AuthField({ id, label, error, className, ...inputProps }: AuthFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "min-h-[44px] w-full rounded-lg border bg-white px-4 text-[15px] text-ink placeholder:text-slate-400",
          error ? "border-error" : "border-slate-300",
          className
        )}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-error">
          <span aria-hidden="true" className="mr-1 font-bold">
            !
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
