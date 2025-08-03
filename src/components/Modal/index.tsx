import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import type { ModalProps } from './types';

const Modal = ({
  title,
  isOpen,
  children,
  modalSx,
  titleContainerSx,
  titleSx,
  contentSx,
  onClose,
}: ModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        maxHeight: '100vh',
        ...modalSx,
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...titleContainerSx,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ ...titleSx }}>
          {title}
        </Typography>

        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ ...contentSx }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
