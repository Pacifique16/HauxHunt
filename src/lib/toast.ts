export type ToastTone = "success" | "info" | "error";

export type ToastDetail = {
  message: string;
  tone?: ToastTone;
};

export const TOAST_EVENT = "hauxhunt-toast";

export function showToast(message: string, tone: ToastTone = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastDetail>(TOAST_EVENT, {
      detail: { message, tone },
    }),
  );
}
