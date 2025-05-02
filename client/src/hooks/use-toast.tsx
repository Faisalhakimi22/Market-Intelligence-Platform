// Copied from shadcn/ui toast
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  toast as sonnerToast,
  ToastOptions as SonnerToastOptions,
} from "@/components/ui/sonner";

type ToastOptions = Omit<SonnerToastOptions, "action" | "description"> & {
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
};

export function useToast() {
  function toast({
    title,
    description,
    variant,
    action,
    ...props
  }: ToastOptions) {
    const options: SonnerToastOptions = {
      ...props,
      className: variant === "destructive" ? "destructive" : undefined,
      action,
    };

    return sonnerToast[variant === "destructive" ? "error" : "message"](
      title,
      {
        description,
        ...options,
      }
    );
  }

  function dismiss(toastId: string) {
    sonnerToast.dismiss(toastId);
  }

  return {
    toast,
    dismiss,
  };
}
