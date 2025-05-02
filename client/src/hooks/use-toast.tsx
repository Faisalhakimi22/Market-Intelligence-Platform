import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  action?: React.ReactNode;
  duration?: number;
};

export function useToast() {
  function toast({
    title,
    description,
    variant = "default",
    action,
    duration = 5000,
    ...props
  }: ToastOptions) {
    const options = {
      ...props,
      duration,
      className: variant === "destructive" ? "destructive" : 
                variant === "success" ? "success" : undefined,
      action,
    };

    if (variant === "destructive") {
      return sonnerToast.error(title!, {
        description,
        ...options,
      });
    } else if (variant === "success") {
      return sonnerToast.success(title!, {
        description,
        ...options,
      });
    } else {
      return sonnerToast(title!, {
        description,
        ...options,
      });
    }
  }

  function dismiss(toastId?: string) {
    sonnerToast.dismiss(toastId);
  }

  return {
    toast,
    dismiss,
  };
}
