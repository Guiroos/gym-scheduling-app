export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'delete' | 'finalize';
  cancelText?: string;
  confirmText?: string;
  handleCancel: () => void;
  handleConfirm: () => Promise<void>;
}
