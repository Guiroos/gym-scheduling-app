import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LeftArrow from '@mui/icons-material/KeyboardArrowLeft';
import RightArrow from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import BackButton from '@/components/BackButton';
import { CardList } from '@/components/CardList';
import ConfirmationModal from '@/components/ConfirmationModal';
import { DataTable } from '@/components/DataTable';
import type { ColumnDef } from '@/components/DataTable/types';

import { deleteClass } from '@/services/indexedDb/queries/class/deleteClass';

import { getClassesByDateRange } from '@/queries/class/getClassesByDataRange';

import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

import type { IClass } from '@/customTypes/IClass';

import ModalClassForm from './components/ModalClassForm';

const ClassesList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
  );

  const [modalClassForm, setModalClassForm] = useState(false);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(true);

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpandCard = (classId: string) => {
    setExpandedCard(expandedCard === classId ? null : classId);
  };

  const handleModalConfirmDelete = (state: boolean) => setModalConfirmDelete(state);

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

  const handleGetClassesByDateRange = useCallback(
    async (date: string) => {
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
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    },
    [selectedDate]
  );

  const handleDeleteClass = async () => {
    if (!selectedClassId) return;

    setLoading(true);

    try {
      await deleteClass(selectedClassId);
      handleModalConfirmDelete(false);
      handleToastifyMessage({ message: 'Aula excluída com sucesso', type: 'success' });
      handleGetClassesByDateRange(selectedDate);
    } catch (err) {
      handleToastifyMessage({
        message: `Erro ao excluir aula: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    handleGetClassesByDateRange(selectedDate);
  }, [selectedDate]);

  const columns: ColumnDef<IClass>[] = [
    {
      field: 'description',
      headerName: 'Descrição',
    },
    {
      field: 'datetime',
      headerName: 'Data e Hora',
      renderCell: ({ value }) => {
        if (value === null || value === undefined || value === '') {
          return 'Data inválida';
        }

        try {
          const date = new Date(value as string | number);
          return isNaN(date.getTime())
            ? 'Data inválida'
            : date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
        } catch {
          return 'Data inválida';
        }
      },
    },
    {
      field: 'classType',
      headerName: 'Tipo de Aula',
    },
    {
      field: 'maxCapacity',
      headerName: 'Capacidade',
      renderCell: ({ row }) => `${row.studentsIds?.length || 0}/${row.maxCapacity}`,
    },
    {
      field: 'status',
      headerName: 'Status',
    },
    {
      field: 'actions' as keyof IClass,
      headerName: 'Ações',
      align: 'center',
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleModalClassForm(true, row.id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClassId(row.id);
              handleModalConfirmDelete(true);
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
      <ModalClassForm
        isOpen={modalClassForm}
        editingClassId={selectedClassId}
        onClose={() => handleModalClassForm(false, '')}
        onSubmitSuccess={() => handleGetClassesByDateRange(selectedDate)}
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

      <Box sx={{ my: (theme) => theme.customSpacings.md }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={(theme) => theme.customSpacings.md}
        >
          <BackButton returnTo="/" tooltipText="Voltar para o início" />
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Aulas
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="medium"
            onClick={() => handleModalClassForm(true, '')}
            disabled={loading}
          >
            Adicionar Aula
          </Button>
        </Box>

        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          gap={(theme) => theme.customSpacings.md}
          alignItems="center"
          mb={(theme) => theme.customSpacings.md}
        >
          <IconButton
            size="small"
            color="primary"
            aria-label="edit class"
            sx={{ ml: 1 }}
            onClick={() => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() - 1);
              setSelectedDate(date.toISOString().split('T')[0]);
            }}
          >
            <LeftArrow />
          </IconButton>

          <TextField
            label="Selecione uma data"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ width: isMobile ? '100%' : 250 }}
            size={isMobile ? 'small' : 'medium'}
          />

          <IconButton
            size="small"
            color="primary"
            aria-label="edit class"
            sx={{ ml: 1 }}
            onClick={() => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() + 1);
              setSelectedDate(date.toISOString().split('T')[0]);
            }}
          >
            <RightArrow />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : null}

        {!loading && classes.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: (theme) => theme.customSpacings.xl }}>
            Nenhuma aula encontrada para a data selecionada.
          </Typography>
        ) : null}

        {!loading && classes.length > 0 ? (
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
                items={classes}
                keyExtractor={(classItem) => classItem.id}
                loading={loading}
                pagination={true}
                renderItem={(classItem) => (
                  <Card key={classItem.id} sx={{ mb: 2, overflow: 'visible' }}>
                    <CardContent
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:last-child': { pb: 2 },
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleExpandCard(classItem.id)}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {classItem.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(classItem.datetime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' • '}
                          {classItem.classType}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        {expandedCard === classItem.id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </CardContent>

                    {expandedCard === classItem.id && (
                      <CardContent sx={{ pt: 0, bgcolor: 'action.hover' }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Data e Hora
                          </Typography>

                          <Typography variant="body2">
                            {new Date(classItem.datetime).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Vagas
                          </Typography>

                          <Typography variant="body2">
                            {classItem.studentsIds?.length || 0} / {classItem.maxCapacity}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Status
                          </Typography>

                          <Typography variant="body2">
                            {classItem.status === 'Aberta' ? 'Aberta' : 'Finalizada'}
                          </Typography>
                        </Box>

                        <CardActions sx={{ justifyContent: 'flex-end', p: 0, mt: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClassDetails(classItem.id);
                            }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalClassForm(true, classItem.id);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </CardContent>
                    )}
                  </Card>
                )}
              />
            </Box>
          ) : (
            <DataTable<IClass>
              rowKey="id"
              rows={classes}
              columns={columns}
              loading={loading}
              onRowClick={(row) => handleClassDetails(row.id)}
            />
          )
        ) : null}
      </Box>
    </Container>
  );
};

export default ClassesList;
