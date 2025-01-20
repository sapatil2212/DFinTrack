// src/components/ui/use-toast.js
import { toast as reactToast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Export toast function directly
export const toast = ({ title, description, variant }) => {
  const options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  if (variant === "destructive") {
    reactToast.error(`${title}: ${description}`, options);
  } else {
    reactToast.success(`${title}: ${description}`, options);
  }
};

export const ToastContainerComponent = () => <ToastContainer />;
