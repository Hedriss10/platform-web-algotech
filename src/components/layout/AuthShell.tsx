import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AuthShell({ children }: Props) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-5 py-10">
      {/* Decoração suave */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-400/25 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-400/15 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
