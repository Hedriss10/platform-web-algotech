import { useEffect, useState, type ReactNode } from "react";
import { Button } from "../Button/Button";

const dangerBtn =
  "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl px-4 py-2.5 " +
  "text-sm font-semibold text-white shadow-lg shadow-red-600/25 " +
  "bg-gradient-to-b from-red-600 to-red-700 transition " +
  "hover:from-red-500 hover:to-red-600 hover:shadow-red-600/35 active:translate-y-px " +
  "focus:outline-none focus:ring-4 focus:ring-red-500/30 " +
  "disabled:cursor-not-allowed disabled:opacity-55";

export type ConfirmDeleteModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  /** Em caso de erro, deve voltar a lançar a excepção para a modal permanecer aberta. */
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmDeleteModal({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [open, onCancel, pending]);

  if (!open) return null;

  const handleConfirm = async () => {
    setPending(true);
    try {
      await Promise.resolve(onConfirm());
      onCancel();
    } catch {
      /* erro tratado no chamador (ex.: toast); manter modal aberta */
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      onClick={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-delete-title"
          className="text-lg font-bold text-slate-900"
        >
          {title}
        </h2>
        <div className="mt-4 text-sm leading-relaxed text-slate-600">
          {description}
        </div>
        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={pending}
          >
            {cancelLabel}
          </Button>
          <button
            type="button"
            className={dangerBtn}
            onClick={() => void handleConfirm()}
            disabled={pending}
            aria-busy={pending ? true : undefined}
          >
            {pending ? (
              <>
                <span
                  className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden
                />
                <span>A processar…</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
