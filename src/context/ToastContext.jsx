import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
const tones = {
  success: "border-vital/30 bg-vital-soft text-vital",
  error: "border-urgent/30 bg-urgent-soft text-urgent",
  info: "border-line bg-white text-ink",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (message, type = "info") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const toast = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map(({ id, message, type }) => {
          const Icon = icons[type];
          return (
            <div
              key={id}
              role="status"
              className={`pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm shadow-lift ${tones[type]}`}
            >
              <Icon size={17} className="mt-0.5 shrink-0" />
              <p className="flex-1">{message}</p>
              <button onClick={() => dismiss(id)} aria-label="Dismiss" className="shrink-0 opacity-60 hover:opacity-100">
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
