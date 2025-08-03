import { type ChangeEvent, useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import BackButton from '@/components/BackButton';
import ConfirmationModal from '@/components/ConfirmationModal';

import { deleteStudent } from '@/queries/student/deleteStudent';
import { getAllStudents } from '@/queries/student/getAllStudents';

import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

import type { IStudent } from '@/customTypes/IStudent';

import ModalStudentForm from './components/ModalStudentForm';
import StudentRow from './components/StudentRow';

const StudentsList = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [modalStudentForm, setModalStudentForm] = useState(false);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students.length) : 0;

  useEffect(() => {
    handleGetAllStudents();
  }, []);

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
            size="small"
            onClick={() => handleModalStudentForm(true, '')}
            disabled={loading}
          >
            Adicionar Aluno
          </Button>
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
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="tabela de alunos">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Data de Nascimento</TableCell>
                    <TableCell>Tipo de Plano</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '5%' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : students
                  ).map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onEdit={(studentId) => handleModalStudentForm(true, studentId)}
                      onDelete={(studentId) => handleModalConfirmDelete(true, studentId)}
                    />
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[8, 16, 24]}
              component="div"
              count={students.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
              }
            />
          </Paper>
        ) : null}
      </Box>
    </Container>
  );
};

export default StudentsList;
