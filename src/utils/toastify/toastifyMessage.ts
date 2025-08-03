import { toast } from 'react-toastify';

interface IToastifyMessage {
  message: string;
  type: 'success' | 'warning' | 'error' | 'loading';
  dismiss?: boolean;
}

export const handleToastifyMessage = ({ message, type, dismiss = true }: IToastifyMessage) => {
  if (dismiss) {
    toast.dismiss();
  }

  switch (type) {
    case 'success':
      toast.success(message, { toastId: 'success-toast' });
      break;
    case 'warning':
      toast.warn(message, { toastId: 'warning-toast' });
      break;
    case 'error':
      toast.error(message, { toastId: 'error-toast' });
      break;
    case 'loading':
      toast.loading(message, { toastId: 'loading-toast' });
      break;
    default:
      break;
  }
};
