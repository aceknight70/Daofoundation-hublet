import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastEvent {
  message: string;
  type: ToastType;
}

type Listener = (e: ToastEvent) => void;
let listeners: Listener[] = [];

export const showToast = (message: string, type: ToastType = "success") => {
  listeners.forEach((l) => l({ message, type }));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<(ToastEvent & { id: number })[]>([]);

  useEffect(() => {
    const listener: Listener = (e) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...e, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded shadow-lg text-white font-sans text-sm animate-fade-in ${
            t.type === "success"
              ? "bg-green-600"
              : t.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};
