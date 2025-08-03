import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, TableCell, TableRow } from '@mui/material';

import { formatCpf } from '@/utils/mask/cpfMasks';

import type { StudentRowProps } from './types.d';

const StudentRow = ({ student, onEdit, onDelete }: StudentRowProps) => {
  const formattedDataNascimento = student.birthDate
    ? new Date(student.birthDate + 'T00:00:00').toLocaleDateString('pt-BR')
    : '-';

  return (
    <TableRow key={student.id}>
      <TableCell>{student.name}</TableCell>
      <TableCell>{formattedDataNascimento}</TableCell>
      <TableCell>{student.planType}</TableCell>
      <TableCell>{formatCpf(student.cpf) || '-'}</TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'flex',
            gap: (theme) => theme.customSpacings.md,
            justifyContent: 'center',
          }}
        >
          <IconButton size="small" onClick={() => onEdit(student.id)}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>

          <IconButton size="small" onClick={() => onDelete(student.id)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default StudentRow;
