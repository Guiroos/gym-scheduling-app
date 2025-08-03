import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';

// Componentes e Serviços
import BackButton from '@/components/BackButton';
import ConfirmationModal from '@/components/ConfirmationModal';

import { addStudentToClass } from '@/services/indexedDb/queries/class/addStudentToClass';
import { deleteClass } from '@/services/indexedDb/queries/class/deleteClass';
import { finalizeClass } from '@/services/indexedDb/queries/class/finalizeClass';
import { getClassById } from '@/services/indexedDb/queries/class/getClassById';
import { removeStudentFromClass } from '@/services/indexedDb/queries/class/removeStudentFromClass';
import { getAllStudents } from '@/services/indexedDb/queries/student/getAllStudents';
import { getStudentById } from '@/services/indexedDb/queries/student/getStudentById';

import { formatCpf } from '@/utils/mask/cpfMasks';
import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

import type { IClass } from '@/customTypes/IClass';
import type { IStudent } from '@/customTypes/IStudent';

import ModalClassForm from '../ClassesList/components/ModalClassForm';

const ClassDetails = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const [classDetails, setClassDetails] = useState<(IClass & { students: IStudent[] }) | null>(
    null
  );

  const [allStudents, setAllStudents] = useState<IStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [addParticipantError, setAddParticipantError] = useState<string | null>(null);

  const [modalClassForm, setModalClassForm] = useState(false);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  const [modalConfirmFinalize, setModalConfirmFinalize] = useState(false);

  const [isModifying, setIsModifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const formattedDateTime =
    classDetails &&
    new Date(classDetails.datetime).toLocaleString('pt-BR', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleModalConfirmDelete = (state: boolean) => setModalConfirmDelete(state);
  const handleModalConfirmFinalize = (state: boolean) => setModalConfirmFinalize(state);
  const handleModalClassForm = (state: boolean) => setModalClassForm(state);

  const handleGetClassDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const classData = await getClassById(id);

      if (!classData) {
        setError('Aula não encontrada.');
        handleToastifyMessage({ message: 'Aula não encontrada.', type: 'error' });
        return;
      }

      const participantPromises = classData.studentsIds.map(
        (studentId) => getStudentById(studentId) as Promise<IStudent>
      );
      const participants = await Promise.all(participantPromises);
      const validParticipants = participants.filter((p): p is IStudent => p !== undefined);

      setClassDetails({ ...classData, students: validParticipants });
    } catch (err) {
      console.error('Erro ao buscar detalhes da aula:', err);
      setError('Erro ao buscar detalhes da aula.');
      handleToastifyMessage({ message: 'Erro ao buscar detalhes da aula.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetStudentsForSelect = useCallback(async () => {
    setLoadingStudents(true);

    try {
      const students = await getAllStudents();
      setAllStudents(students);
    } catch (err) {
      console.error('Erro ao buscar alunos para seleção:', err);
      handleToastifyMessage({
        message: 'Erro ao buscar alunos para seleção.',
        type: 'error',
      });
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  const handleAddParticipant = async () => {
    if (!classId || !selectedStudentId) {
      setAddParticipantError('Selecione um aluno.');
      return;
    }

    setAddParticipantError(null);
    setIsModifying(true);

    try {
      const success = await addStudentToClass(classId, selectedStudentId);

      if (success) {
        handleToastifyMessage({ message: 'Aluno adicionado com sucesso', type: 'success' });
        handleGetClassDetails(classId);
        setSelectedStudentId('');
      }
    } catch (err) {
      handleToastifyMessage({
        message: `Erro ao adicionar aluno: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    } finally {
      setIsModifying(false);
    }
  };

  const handleRemoveParticipant = async (classId: string, studentId: string) => {
    if (!classId || !studentId) return;

    setIsModifying(true);

    try {
      const success = await removeStudentFromClass(classId, studentId);

      if (success) {
        handleToastifyMessage({ message: 'Aluno removido com sucesso', type: 'success' });
        handleGetClassDetails(classId);
      } else {
        handleToastifyMessage({ message: 'Falha ao remover aluno.', type: 'warning' });
      }
    } catch (err) {
      handleToastifyMessage({
        message: `Erro ao remover aluno: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    } finally {
      setIsModifying(false);
    }
  };

  const handleFinalizeClass = async () => {
    if (!classId) return;

    setIsModifying(true);

    try {
      await finalizeClass(classId);
      handleToastifyMessage({ message: 'Aula concluída com sucesso', type: 'success' });
      handleGetClassDetails(classId);
    } catch (err) {
      handleToastifyMessage({
        message: `Erro ao concluir aula: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    } finally {
      setIsModifying(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!classId) return;

    setIsModifying(true);

    try {
      await deleteClass(classId);
      handleToastifyMessage({ message: 'Aula excluída com sucesso', type: 'success' });
      navigate('/classes');
    } catch (err) {
      handleToastifyMessage({
        message: `Erro ao excluir aula: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    } finally {
      setIsModifying(false);
    }
  };

  useEffect(() => {
    if (classId) {
      handleGetClassDetails(classId);
      handleGetStudentsForSelect();
    } else {
      handleToastifyMessage({ message: 'ID da aula inválido.', type: 'error' });
      navigate('/classes');
    }
  }, [classId, handleGetClassDetails, handleGetStudentsForSelect, navigate]);

  if (loading) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error || !classDetails || !classId) {
    return (
      <Container sx={{ my: 4 }}>
        <BackButton returnTo="/classes" tooltipText="Back to Classes List" />
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            {error || 'Detalhes da aula não disponíveis.'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <ModalClassForm
        isOpen={modalClassForm}
        editingClassId={classId}
        onClose={() => handleModalClassForm(false)}
        onSubmitSuccess={() => handleGetClassDetails(classId)}
      />

      <ConfirmationModal
        isOpen={modalConfirmFinalize}
        title="Concluir Aula"
        message="Tem certeza que deseja concluir esta aula?"
        type="finalize"
        confirmText="Concluir"
        handleCancel={() => handleModalConfirmFinalize(false)}
        handleConfirm={handleFinalizeClass}
      />

      <ConfirmationModal
        isOpen={modalConfirmDelete}
        title="Excluir Aula"
        message="Tem certeza que deseja excluir esta aula?"
        type="delete"
        confirmText="Excluir"
        handleCancel={() => handleModalConfirmDelete(false)}
        handleConfirm={handleDeleteClass}
      />

      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BackButton returnTo="/classes" tooltipText="Back to Classes List" />
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, ml: 2 }}>
            Detalhes da Aula
          </Typography>

          {classDetails.status === 'Aberta' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleModalClassForm(true)}
              startIcon={<EditIcon />}
              sx={{
                mr: (theme) => theme.customSpacings.md,
                borderRadius: (theme) => theme.customBorderRadius.sm,
              }}
            >
              Editar
            </Button>
          )}
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: (theme) => theme.customSpacings.md,
            borderRadius: (theme) => theme.customBorderRadius.md,
            mb: (theme) => theme.customSpacings.md,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            {classDetails.description}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            Tipo: {classDetails.classType}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            Horário: {formattedDateTime}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            Status: {classDetails.status === 'Aberta' ? 'Aberta' : 'Concluída'}
          </Typography>

          {classDetails.status === 'Aberta' && (
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Permite agendamento após início:{' '}
              {classDetails.allowPostStartRegistration ? 'Sim' : 'Não'}
            </Typography>
          )}

          <Typography
            variant="body1"
            color={
              classDetails && classDetails.students.length >= classDetails.maxCapacity
                ? 'error'
                : 'text.secondary'
            }
          >
            Participantes: {classDetails?.students.length || 0} / {classDetails.maxCapacity}
          </Typography>
        </Paper>

        {classDetails.status === 'Aberta' && (
          <Box sx={{ mb: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleModalConfirmDelete(true)}
              startIcon={<DeleteForeverIcon />}
              sx={{ borderRadius: (theme) => theme.customBorderRadius.sm }}
              disabled={isModifying}
            >
              Deletar Aula
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={() => handleModalConfirmFinalize(true)}
              startIcon={<CheckCircleIcon />}
              sx={{ borderRadius: (theme) => theme.customBorderRadius.sm }}
              disabled={isModifying}
            >
              Concluir Aula
            </Button>
          </Box>
        )}

        {classDetails.status === 'Aberta' && (
          <Paper
            elevation={3}
            sx={{
              p: (theme) => theme.customSpacings.md,
              borderRadius: (theme) => theme.customBorderRadius.md,
              mb: (theme) => theme.customSpacings.md,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Gerenciar Participantes
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
              <FormControl sx={{ flexGrow: 1 }} error={!!addParticipantError}>
                <InputLabel id="student-select-label">Selecione um aluno</InputLabel>
                <Select
                  label="Selecione um aluno"
                  labelId="student-select-label"
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value as string);
                    setAddParticipantError(null); // Limpa o erro ao mudar seleção
                  }}
                  disabled={loadingStudents || isModifying}
                >
                  {allStudents.length === 0 && !loadingStudents && (
                    <MenuItem disabled>Nenhum aluno disponível</MenuItem>
                  )}

                  {loadingStudents && (
                    <MenuItem disabled>
                      <CircularProgress size={16} /> Carregando alunos...
                    </MenuItem>
                  )}

                  {allStudents.map((student) => (
                    <MenuItem
                      key={student.id}
                      value={student.id}
                      disabled={classDetails.studentsIds.includes(student.id)}
                    >
                      {student.name} (
                      {student.cpf ? `CPF: ${formatCpf(student.cpf)}` : 'Nenhum CPF'})
                    </MenuItem>
                  ))}
                </Select>

                {addParticipantError && <FormHelperText>{addParticipantError}</FormHelperText>}
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddParticipant}
                startIcon={<AddIcon />}
                sx={{ height: '56px', borderRadius: (theme) => theme.customBorderRadius.sm }}
                disabled={!selectedStudentId || isModifying}
              >
                Adicionar
              </Button>
            </Box>
          </Paper>
        )}

        {classDetails && classDetails.students.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              p: (theme) => theme.customSpacings.md,
              borderRadius: (theme) => theme.customBorderRadius.md,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Participantes Cadastrados
            </Typography>

            <List
              sx={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: (theme) => theme.customBorderRadius.sm,
                p: (theme) => theme.customSpacings.md,
              }}
            >
              {classDetails.students.map((student) => (
                <ListItem
                  key={student.id}
                  secondaryAction={
                    classDetails.status === 'Aberta' && (
                      <IconButton
                        edge="end"
                        aria-label="remove participant"
                        onClick={() => handleRemoveParticipant(classDetails.id, student.id)}
                        color="error"
                        disabled={isModifying}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={student.name}
                    secondary={<>{student.cpf ? `CPF: ${formatCpf(student.cpf)}` : 'No CPF'}</>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        {!classDetails?.students.length && !loading && (
          <Typography sx={{ textAlign: 'center', mt: 4 }}>
            Nenhum participante registrado.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ClassDetails;
