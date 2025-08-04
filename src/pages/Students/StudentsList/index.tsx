import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { Card, CardActions, CardContent, IconButton, useMediaQuery, useTheme } from '@mui/material';

import BackButton from '@/components/BackButton';
import { CardList } from '@/components/CardList';
import ConfirmationModal from '@/components/ConfirmationModal';
import { DataTable } from '@/components/DataTable';
import type { ColumnDef } from '@/components/DataTable/types';

import { deleteStudent } from '@/queries/student/deleteStudent';
import { getAllStudents } from '@/queries/student/getAllStudents';

import { formatCpf } from '@/utils/mask/cpfMasks';
import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

import type { IStudent } from '@/customTypes/IStudent';

import ModalStudentForm from './components/ModalStudentForm';

const StudentsList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [modalStudentForm, setModalStudentForm] = useState(false);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleSearchQuery = (value: string) => {
    const query = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9]/g, '');

    setSearchQuery(query);
  };

  const handleExpandCard = (studentId: string) => {
    setExpandedCard(expandedCard === studentId ? null : studentId);
  };

  const handleModalStudentForm = (state: boolean, studentId: string) => {
    if (state) {
      setSelectedStudentId(studentId);
    } else {
      setSelectedStudentId(null);
    }

    setModalStudentForm(state);
  };

  const handleModalConfirmDelete = (state: boolean, studentId: string) => {
    if (state) {
      setSelectedStudentId(studentId);
    } else {
      setSelectedStudentId(null);
    }

    setModalConfirmDelete(state);
  };

  const handleGetAllStudents = async () => {
    setLoading(true);

    try {
      const allStudents = await getAllStudents();

      setStudents(allStudents);
    } catch (error) {
      handleToastifyMessage({
        message: `Erro ao buscar alunos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleDeleteStudent = async (studentId?: string) => {
    if (!studentId) return;

    setLoading(true);

    try {
      await deleteStudent(studentId);
      handleToastifyMessage({ message: 'Aluno deletado com sucesso', type: 'success' });
      handleModalConfirmDelete(false, '');
      handleGetAllStudents();
    } catch (error) {
      handleToastifyMessage({
        message: `Erro ao deletar aluno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        type: 'error',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllStudents();
  }, []);

  const columns: ColumnDef<IStudent>[] = [
    {
      field: 'name',
      headerName: 'Nome',
      renderCell: ({ row }) => row.name,
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      renderCell: ({ row }) => formatCpf(row.cpf),
    },
    {
      field: 'planType',
      headerName: 'Tipo de Plano',
      renderCell: ({ row }) => row.planType,
    },
    {
      field: 'actions' as keyof IStudent,
      headerName: 'Ações',
      width: '5%',
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleModalStudentForm(true, row.id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStudentId(row.id);
              handleModalConfirmDelete(true, row.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <ModalStudentForm
        isOpen={modalStudentForm}
        editingStudentId={selectedStudentId}
        onClose={() => handleModalStudentForm(false, '')}
        onSubmitSuccess={() => handleGetAllStudents()}
      />

      <ConfirmationModal
        isOpen={modalConfirmDelete}
        title="Excluir Aluno"
        message="Tem certeza que deseja excluir este aluno?"
        type="delete"
        confirmText="Excluir"
        handleCancel={() => handleModalConfirmDelete(false, '')}
        handleConfirm={() => handleDeleteStudent(selectedStudentId || '')}
      />

      <Box sx={{ my: (theme) => theme.customSpacings.md }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={(theme) => theme.customSpacings.md}
        >
          <BackButton returnTo="/" tooltipText="Voltar para o início" />
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Alunos
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="medium"
            onClick={() => handleModalStudentForm(true, '')}
            disabled={loading}
          >
            Adicionar Aluno
          </Button>
        </Box>

        <Box sx={{ mb: (theme) => theme.customSpacings.md }}>
          <TextField
            label="Buscar aluno"
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            value={searchQuery}
            onChange={(e) => handleSearchQuery(e.target.value)}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : null}

        {!loading && students.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: (theme) => theme.customSpacings.xl }}>
            Nenhum aluno encontrado. Adicione seu primeiro aluno!
          </Typography>
        ) : null}

        {!loading && students.length > 0 ? (
          isMobile ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                pb: (theme) => theme.spacing(12),
              }}
            >
              <CardList
                items={students.filter((student) =>
                  student.name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .includes(searchQuery.toLowerCase())
                )}
                keyExtractor={(student) => student.id}
                loading={loading}
                renderItem={(student) => (
                  <Card sx={{ overflow: 'visible' }}>
                    <CardContent
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:last-child': { pb: (theme) => theme.customSpacings.md },
                        cursor: 'pointer',
                      }}
                      onClick={() => handleExpandCard(student.id)}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {student.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.planType}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        {expandedCard === student.id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </CardContent>

                    {expandedCard === student.id && (
                      <CardContent>
                        <Box sx={{ mb: (theme) => theme.customSpacings.md }}>
                          <Typography variant="caption" color="text.secondary">
                            Data de Nascimento
                          </Typography>

                          <Typography variant="body2">
                            {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>

                        {student.cpf && (
                          <Box sx={{ mb: (theme) => theme.customSpacings.md }}>
                            <Typography variant="caption" color="text.secondary">
                              CPF
                            </Typography>
                            <Typography variant="body2">
                              {student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                            </Typography>
                          </Box>
                        )}

                        <CardActions sx={{ justifyContent: 'flex-end', p: 0, mt: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalStudentForm(true, student.id);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalConfirmDelete(true, student.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </CardContent>
                    )}
                  </Card>
                )}
                pagination
              />
            </Box>
          ) : (
            <DataTable<IStudent>
              rowKey="id"
              rows={students.filter((student) =>
                student.name
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[^a-zA-Z0-9]/g, '')
                  .includes(searchQuery)
              )}
              columns={columns}
              loading={loading}
              onRowClick={(row) => handleModalStudentForm(true, row.id)}
            />
          )
        ) : null}
      </Box>
    </Container>
  );
};

export default StudentsList;
