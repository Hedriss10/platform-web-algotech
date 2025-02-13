import { Flip, toast } from "react-toastify";

export const notify = (
  message,
  {
    type,
    position = "bottom-right",
    autoClose = 3000,
    theme = "dark",
  }
) => {
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