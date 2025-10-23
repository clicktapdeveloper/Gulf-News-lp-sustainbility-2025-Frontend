import { useState } from 'react';

interface UsePaymentModalProps {
  amount: number;
  currency?: string;
  referenceId?: string;
  customerEmail?: string;
  onSuccess?: (paymentId?: string) => void;
  onError?: (message: string) => void;
  title?: string;
  description?: string;
}

export const usePaymentModal = ({
  amount,
  currency = 'AED',
  referenceId,
  customerEmail,
  onSuccess,
  onError,
  title,
  description
}: UsePaymentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSuccess = (paymentId?: string) => {
    closeModal();
    onSuccess?.(paymentId);
  };

  const handleError = (error: string) => {
    onError?.(error);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    modalProps: {
      isOpen,
      onClose: closeModal,
      amount,
      currency,
      referenceId,
      customerEmail,
      onSuccess: handleSuccess,
      onError: handleError,
      title,
      description
    }
  };
};
