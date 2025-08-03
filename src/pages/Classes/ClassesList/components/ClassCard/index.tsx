import EditIcon from '@mui/icons-material/Edit';
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';

import type { ClassCardProps } from './types.d';

const ClassCard = ({ classData, openDetails, openEdit }: ClassCardProps) => {
  const isClassFull = classData.studentsIds.length >= classData.maxCapacity;

  return (
    <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: (theme) => theme.customSpacings.md,
          borderRadius: (theme) => theme.customBorderRadius.md,
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: (theme) => theme.customShadows.medium,
          },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          width: '200px',
        }}
        onClick={() => openDetails(classData.id)}
      >
        <Box sx={{ wordBreak: 'break-word' }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={(theme) => theme.customSpacings.xs}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {new Date(classData.datetime).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                openEdit(classData.id);
              }}
              size="small"
              color="primary"
              aria-label="edit class"
              sx={{ ml: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            variant="caption"
            px={(theme) => theme.customSpacings.xs}
            py={(theme) => theme.customSpacings.xs}
            borderRadius={(theme) => theme.customBorderRadius.sm}
            color="primary.contrastText"
            bgcolor={
              classData.status === 'Aberta'
                ? (theme) => theme.palette.primary.light
                : (theme) => theme.palette.success.light
            }
          >
            {classData.status === 'Aberta' ? 'Aberta' : 'Concluída'}
          </Typography>

          <Typography variant="body1" my={(theme) => theme.customSpacings.xs}>
            {classData.description}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={(theme) => theme.customSpacings.xs}
          >
            {classData.classType}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={(theme) => theme.customSpacings.xs}
        >
          <Typography variant="body2" color={isClassFull ? 'error' : 'text.secondary'}>
            {classData.studentsIds.length} / {classData.maxCapacity} pessoas
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ClassCard;
