import toast from 'react-hot-toast';

export const showPaymentToast = (result: any) => {
  if (result.success) {
    // Check if payment was actually successful (not just API call successful)
    if (result.status === 'AUTHORIZED' || result.status === 'CAPTURED') {
      toast.success(`Payment Successful! ID: ${result.paymentId}`, {
        duration: 5000,
        icon: '✅',
      });
      return true; // Payment fully successful
    } else if (result.status === 'DECLINED') {
      toast.error(`Payment Declined: ${result.response?.processorInformation?.responseMessage || 'Card declined'}`, {
        duration: 6000,
        icon: '❌',
      });
      return false; // Payment declined
    } else {
      toast.error(`Payment Failed: ${result.response?.processorInformation?.responseMessage || 'Unknown error'}`, {
        duration: 6000,
        icon: '⚠️',
      });
      return false; // Payment failed
    }
  } else {
    toast.error(`Payment Error: ${result.error || 'Unknown error'}`, {
      duration: 6000,
      icon: '🚫',
    });
    return false; // API error
  }
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    duration: 0, // Don't auto-dismiss loading toasts
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    icon: '✅',
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    icon: '❌',
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 4000,
    icon: 'ℹ️',
  });
};
