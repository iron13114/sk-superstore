import { toast } from 'react-toastify';

const defaultOptions = {
  autoClose: 1000,        
  hideProgressBar: true,  
  closeButton: false,    
  pauseOnHover: false,    
  pauseOnFocusLoss: false,
};

export const showToast = {
  success: (msg, opts) => toast.success(msg, { toastId: `success-${msg}`, ...defaultOptions, ...opts }),
  error: (msg, opts) => toast.error(msg, { toastId: `error-${msg}`, ...defaultOptions, ...opts }),
  info: (msg, opts) => toast.info(msg, { toastId: `info-${msg}`, ...defaultOptions, ...opts }),
  warning: (msg, opts) => toast.warning(msg, { toastId: `warning-${msg}`, ...defaultOptions, ...opts }),
};