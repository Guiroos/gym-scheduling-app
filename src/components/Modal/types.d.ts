import type { SxProps } from '@mui/material';

export interface ModalProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  modalSx?: SxProps;
  titleContainerSx?: SxProps;
  titleSx?: SxProps;
  contentSx?: SxProps;
  onClose: () => void;
}
