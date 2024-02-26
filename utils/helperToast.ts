import { toast, ToastContent, ToastOptions } from 'react-toastify'

export const helperToast = {
  success: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss()
    toast.success(content, { theme: 'dark', ...opts })
  },
  error: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss()
    toast.error(content, { theme: 'dark', ...opts })
  },
  info: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss()
    toast.info(content, { theme: 'dark', ...opts })
  },
  clear: () => {
    toast.dismiss()
  },
}
