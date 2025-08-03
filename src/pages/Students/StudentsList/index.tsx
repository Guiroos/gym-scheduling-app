import { type ChangeEvent, useEffect, useState } from 'react';

import { Delete, Edit, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import BackButton from '@/components/BackButton';
import ConfirmationModal from '@/components/ConfirmationModal';

import useScrollPosition from '@/hooks/useScrollPosition';

import { deleteStudent } from '@/queries/student/deleteStudent';
import { getAllStudents } from '@/queries/student/getAllStudents';

import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

import type { IStudent } from '@/customTypes/IStudent';

import ModalStudentForm from './components/ModalStudentForm';

const StudentsList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { scrolled } = useScrollPosition(10);

  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchQuery, setSearchQuery] = useState('');

  const [modalStudentForm, setModalStudentForm] = useState(false);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students.length) : 0;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {(rowsPerPage > 0
                ? students
                    .filter((student) =>
                      student.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : students
              ).map((student) => (
                <Card
                  key={student.id}
                  sx={{ mb: (theme) => theme.customSpacings.md, overflow: 'visible' }}
                >
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
                      {expandedCard === student.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </CardContent>

                  <Collapse in={expandedCard === student.id} timeout="auto" unmountOnExit>
                    <CardContent sx={{ pt: 0, bgcolor: 'action.hover' }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Data de Nascimento
                        </Typography>

                        <Typography variant="body2">
                          {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>

                      {student.cpf && (
                        <Box sx={{ mb: 1 }}>
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
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModalConfirmDelete(true, student.id);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </CardContent>
                  </Collapse>
                </Card>
              ))}

              <Box
                sx={{
                  position: 'fixed',
                  bottom: '72px',
                  left: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  p: 2,
                  zIndex: theme.zIndex.appBar - 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  alignItems: 'center',
                  backdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'transform 0.3s ease',
                  transform: scrolled ? 'translateY(72px)' : 'translateY(0)',
                }}
              >
                <Pagination
                  count={Math.ceil(students.length / rowsPerPage)}
                  page={page + 1}
                  onChange={(_event, value) => {
                    setPage(value - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  size="small"
                  siblingCount={0}
                  boundaryCount={1}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      minWidth: 32,
                      height: 32,
                    },
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {`${page * rowsPerPage + 1}-${Math.min(
                      (page + 1) * rowsPerPage,
                      students.length
                    )} de ${students.length}`}
                  </Typography>

                  <Select
                    size="small"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    variant="standard"
                    disableUnderline
                    sx={{
                      '& .MuiSelect-select': {
                        py: 0.5,
                        pr: 3,
                        fontSize: '0.875rem',
                      },
                      '& .MuiSelect-icon': {
                        right: 0,
                      },
                    }}
                  >
                    <MenuItem value={5}>5 itens</MenuItem>
                    <MenuItem value={10}>10 itens</MenuItem>
                    <MenuItem value={15}>15 itens</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de alunos" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Data de Nascimento</TableCell>
                      <TableCell>Tipo de Plano</TableCell>
                      <TableCell>CPF</TableCell>
                      <TableCell sx={{ textAlign: 'center', width: '120px' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? students
                          .filter((student) =>
                            student.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : students
                    ).map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell>{student.name}</TableCell>

                        <TableCell>
                          {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                        </TableCell>

                        <TableCell>{student.planType}</TableCell>

                        <TableCell>
                          {student.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                        </TableCell>

                        <TableCell sx={{ textAlign: 'center' }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleModalStudentForm(true, student.id)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleModalConfirmDelete(true, student.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
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
                rowsPerPageOptions={[5, 10, 15]}
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
          )
        ) : null}
      </Box>
    </Container>
  );
};

export default StudentsList;
