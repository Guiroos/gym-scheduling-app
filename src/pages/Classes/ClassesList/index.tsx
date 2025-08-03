import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add'; // Ícone de Adicionar
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import BackButton from '@/components/BackButton';

import { getClassesByDateRange } from '@/queries/class/getClassesByDataRange';

import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

import type { IClass } from '@/customTypes/IClass';

import theme from '@/theme';

import ClassCard from './components/ClassCard';
import ModalClassForm from './components/ModalClassForm';

const ClassesList = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [modalClassForm, setModalClassForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleModalClassForm = (state: boolean, classId: string) => {
    if (state) {
      setSelectedClassId(classId);
    } else {
      setSelectedClassId(null);
    }

    setModalClassForm(state);
  };

  const handleClassDetails = (classId: string) => {
    navigate(`/classes/${classId}`);
  };

  const handleGetClassesByDateRange = useCallback(async (date: string) => {
    setLoading(true);

    try {
      const startDate = new Date(date + 'T00:00:00');
      const endDate = new Date(date + 'T02:59:59.999Z');
      endDate.setDate(endDate.getDate() + 1);

      const classes = await getClassesByDateRange(startDate, endDate);
      setClasses(classes);
    } catch (error) {
      handleToastifyMessage({
        message: `Erro ao buscar classes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetClassesByDateRange(selectedDate);
  }, [selectedDate, handleGetClassesByDateRange]);

  return (
    <Container maxWidth="lg">
      <ModalClassForm
        isOpen={modalClassForm}
        editingClassId={selectedClassId}
        onClose={() => handleModalClassForm(false, '')}
        onSubmitSuccess={() => handleGetClassesByDateRange(selectedDate)}
      />

      <Box sx={{ my: (theme) => theme.customSpacings.md }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: (theme) => theme.customSpacings.md }}>
          <BackButton returnTo="/" tooltipText="Voltar para a Home" />

          <Typography
            variant="h4"
            component="h1"
            sx={{ flexGrow: 1, ml: (theme) => theme.customSpacings.md }}
          >
            Aulas
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => handleModalClassForm(true, '')}
            startIcon={<AddIcon />}
          >
            Adicionar Aula
          </Button>
        </Box>

        <Box sx={{ mb: (theme) => theme.customSpacings.xxl, textAlign: 'center' }}>
          <TextField
            label="Selecione uma data"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ width: 250 }}
          />
        </Box>

        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && classes.length === 0 && (
          <Typography sx={{ textAlign: 'center', mt: (theme) => theme.customSpacings.md }}>
            Nenhuma aula agendada para esta data. Adicione uma nova aula!
          </Typography>
        )}

        {!loading && classes.length > 0 && (
          <Grid container spacing={theme.customSpacings.sm}>
            {classes.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                openDetails={(classId) => handleClassDetails(classId)}
                openEdit={(classId) => handleModalClassForm(true, classId)}
              />
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default ClassesList;

// {selectedClass && classDetails && (
//   <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
//     <DialogTitle
//       sx={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         pb: (theme) => theme.customSpacings.md,
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="h6">
//           {new Date(selectedClass.datetime).toLocaleString('pt-BR', {
//             weekday: 'long',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//           })}
//         </Typography>
//       </Box>
//       <IconButton edge="end" color="inherit" onClick={handleCloseModal} aria-label="close">
//         <CloseIcon />
//       </IconButton>
//     </DialogTitle>

//     <DialogContent dividers sx={{ mb: (theme) => theme.customSpacings.md }}>
//       <Box sx={{ mb: (theme) => theme.customSpacings.md }}>
//         <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
//           {selectedClass.description}
//         </Typography>
//         <Typography variant="body1" color="text.secondary" gutterBottom>
//           Type: {selectedClass.classType}
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Status: {selectedClass.status === 'Aberta' ? 'Open' : 'Concluded'}
//         </Typography>
//         {selectedClass.status === 'Aberta' && (
//           <Typography variant="body1" color="text.secondary">
//             Allow registration after start:{' '}
//             {selectedClass.allowPostStartRegistration ? 'Yes' : 'No'}
//           </Typography>
//         )}
//       </Box>

//       <Box sx={{ mb: (theme) => theme.customSpacings.md }}>
//         <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//           Participants ({classDetails?.studentsDetails.length || 0} /{' '}
//           {selectedClass.maxCapacity})
//         </Typography>
//         {classDetails && classDetails.studentsDetails.length > 0 ? (
//           <List
//             sx={{
//               maxHeight: '200px',
//               overflowY: 'auto',
//               border: (theme) => `1px solid ${theme.palette.divider}`,
//               borderRadius: (theme) => theme.customBorderRadius.sm,
//               p: (theme) => theme.customSpacings.md,
//             }}
//           >
//             {classDetails.studentsDetails.map((student) => (
//               <ListItem
//                 key={student.id}
//                 secondaryAction={
//                   selectedClass.status === 'Aberta' && (
//                     <IconButton
//                       edge="end"
//                       aria-label="remove participant"
//                       onClick={() => handleRemoveParticipant(student.id)}
//                       color="error"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   )
//                 }
//               >
//                 <ListItemText
//                   primary={student.name}
//                   secondary={student.cpf || 'No CPF'} // Exibe o CPF ou "No CPF"
//                 />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             Nenhum participante registrado ainda.
//           </Typography>
//         )}
//       </Box>

//       {selectedClass.status === 'Aberta' && (
//         <DialogActions
//           sx={{
//             mt: (theme) => theme.customSpacings.md,
//             p: 0,
//             justifyContent: 'space-between',
//           }}
//         >
//           <Box sx={{ display: 'flex', gap: (theme) => theme.customSpacings.md }}>
//             {/* Botão para adicionar participante (precisa do ID do aluno logado ou uma forma de selecionar) */}
//             {/* Para este desafio, podemos simplificar e não adicionar a funcionalidade de adicionar participante aqui, focando no remove e finalize */}
//             {/* <Button variant="contained" color="primary" startIcon={<AddIcon />}> Add Participant </Button> */}

//             <Button
//               variant="outlined"
//               color="primary"
//               onClick={() => handleFinalizeClass()}
//               startIcon={<CheckCircleIcon />}
//               sx={{ borderRadius: (theme) => theme.customBorderRadius.sm }}
//             >
//               Finalizar Aula
//             </Button>
//           </Box>

//           {/* Botão para remover participante (precisa do ID do aluno) */}
//           {/* O botão de remover já está no ListItem */}

//           {/* Se quiser um botão para deletar a aula inteira */}
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => {
//               /* Implementar deleteClass */
//             }} // Implementar delete
//             sx={{ borderRadius: (theme) => theme.customBorderRadius.sm }}
//           >
//             Deletar Aula
//           </Button>
//         </DialogActions>
//       )}
//     </DialogContent>
//   </Dialog>
// )}
