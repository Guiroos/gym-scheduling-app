import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Tooltip } from '@mui/material';

import type { BackButtonProps } from './types';

const BackButton = ({ returnTo, tooltipText = 'Voltar', sx }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <Tooltip title={tooltipText}>
      <IconButton onClick={handleClick} aria-label={tooltipText} sx={{ ...sx }} color="primary">
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
