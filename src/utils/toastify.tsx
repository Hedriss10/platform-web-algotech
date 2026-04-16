import { Flip, toast } from "react-toastify";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastPosition =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

export type Theme = "light" | "dark" | "colored";

export interface NotifyOptions {
  type?: ToastType;
  position?: ToastPosition;
  autoClose?: number | false;
  theme?: Theme;
}

export const Toastify = (
  message: string,
  options: NotifyOptions = {}
): string | number => {
  const {
    type,
    position = "bottom-right",
    autoClose = 2000,
    theme = "light",
  } = options;

  const toastConfig = {
    position,
    autoClose,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme,
    transition: Flip,
  };

  switch (type) {
    case "success":
      return toast.success(message, toastConfig);
    case "error":
      return toast.error(message, toastConfig);
    case "info":
      return toast.info(message, toastConfig);
    case "warning":
      return toast.warn(message, toastConfig);
    default:
      return toast(message, toastConfig);
  }
};
