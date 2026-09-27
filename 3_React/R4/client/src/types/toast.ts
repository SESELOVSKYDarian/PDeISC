export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
}
