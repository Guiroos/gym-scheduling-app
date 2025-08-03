import { useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Button } from '@mui/material';

import type { ConfirmationModalProps } from './types.d';

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  cancelText,
  confirmText,
  type = 'delete',
  handleCancel,
  handleConfirm,
}: ConfirmationModalProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} color="primary" disabled={loading}>
          {cancelText || 'Cancelar'}
        </Button>

        <Button
          onClick={async () => {
            setLoading(true);
            await handleConfirm();
            setLoading(false);
          }}
          color={type === 'delete' ? 'error' : 'success'}
          variant="contained"
          autoFocus
          loading={loading}
          disabled={loading}
          startIcon={type === 'delete' ? <DeleteIcon /> : <CheckCircleIcon />}
        >
          {confirmText || 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
