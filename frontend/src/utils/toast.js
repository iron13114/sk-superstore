import { toast } from 'react-toastify';
export const showToast = {
  success: (msg, opts) => toast.success(msg, { toastId: `success-${msg}`, ...opts }),
  error: (msg, opts) => toast.error(msg, { toastId: `error-${msg}`, ...opts }),
  info: (msg, opts) => toast.info(msg, { toastId: `info-${msg}`, ...opts }),
  warning: (msg, opts) => toast.warning(msg, { toastId: `warning-${msg}`, ...opts }),
};