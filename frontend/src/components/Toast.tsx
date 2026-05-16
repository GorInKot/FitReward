import { useToastStore } from "../store/toastStore";

const KIND_STYLES: Record<string, string> = {
  error:
    "border-rose-400 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-950 dark:text-rose-100",
  success:
    "border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950 dark:text-emerald-100",
  info: "border-hairline bg-panel text-ink"
};

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismiss(toast.id)}
          className={`w-full max-w-lg rounded-xl border px-4 py-3 text-left text-sm shadow-lg ${KIND_STYLES[toast.kind]}`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
