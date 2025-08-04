import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import type { InferType } from 'yup';

import Modal from '@/components/Modal';

import { updateClass } from '@/services/indexedDb/queries/class/updateClass';

import { addClass } from '@/queries/class/addClass';
import { getClassById } from '@/queries/class/getClassById';

import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';
import { classSchema } from '@/utils/yupSchemas/classSchema';

import type { IClass } from '@/customTypes/IClass';
import { CLASS_STATUS, type TClassStatus } from '@/customTypes/TClassStatus';

import type { ClassFormModalProps } from './types';

const ClassFormModal = ({
  isOpen,
  editingClassId,
  onClose,
  onSubmitSuccess,
}: ClassFormModalProps) => {
  const isEditing = Boolean(editingClassId);

  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(classSchema),
    defaultValues: {
      id: '',
      description: '',
      classType: '',
      datetime: new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split('.')[0],
      maxCapacity: 10,
      status: 'Aberta',
      allowPostStartRegistration: false,
      studentsIds: [],
    },
    mode: 'onChange',
  });

  const handleGetClassById = useCallback(async () => {
    if (!editingClassId) return;

    try {
      const classData = await getClassById(editingClassId);

      if (!classData) {
        handleToastifyMessage({ message: 'Aula não encontrada', type: 'error' });
        onClose();
        return;
      }

      setValue('id', classData.id);
      setValue('description', classData.description);
      setValue('classType', classData.classType);
      setValue('datetime', classData.datetime);
      setValue('maxCapacity', classData.maxCapacity);
      setValue('status', classData.status);
      setValue('allowPostStartRegistration', classData.allowPostStartRegistration);
      setValue('studentsIds', classData.studentsIds);
    } catch (error) {
      handleToastifyMessage({
        message: `Erro ao buscar aula: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    }
  }, [editingClassId, setValue]);

  const onSubmit = useCallback(
    async (data: InferType<typeof classSchema>) => {
      if (data.studentsIds.length > data.maxCapacity) {
        handleToastifyMessage({
          message: 'A quantidade de alunos excede a capacidade máxima',
          type: 'error',
        });
        return;
      }

      try {
        const classToSave: IClass = {
          ...data,
          id: data.id || crypto.randomUUID(),
          datetime: data.datetime,
          maxCapacity: Number(data.maxCapacity),
          status: data.status as TClassStatus,
          allowPostStartRegistration: Boolean(data.allowPostStartRegistration),
          studentsIds: data.studentsIds || [],
        };

        if (isEditing && editingClassId) {
          await updateClass(classToSave);
          handleToastifyMessage({ message: 'Aula atualizada com sucesso', type: 'success' });
        } else {
          await addClass(classToSave);
          handleToastifyMessage({ message: 'Aula adicionada com sucesso', type: 'success' });
        }

        onSubmitSuccess();
        onClose();
      } catch (error) {
        handleToastifyMessage({
          message: `Erro ao salvar a aula: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          type: 'error',
        });
      }
    },
    [isEditing, editingClassId]
  );

  useEffect(() => {
    if (isOpen && isEditing && editingClassId) {
      handleGetClassById();
    } else if (isOpen && !isEditing) {
      reset();
    }
  }, [editingClassId, isOpen, isEditing]);

  return (
    <Modal title={isEditing ? 'Editar Aula' : 'Nova Aula'} isOpen={isOpen} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={(theme) => theme.customSpacings.md}
        mt={(theme) => theme.customSpacings.md}
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descrição"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Controller
          name="classType"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tipo de Aula"
              error={!!errors.classType}
              helperText={errors.classType?.message}
            />
          )}
        />

        <Controller
          name="datetime"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Data e Hora"
              type="datetime-local"
              error={!!errors.datetime}
              helperText={errors.datetime?.message}
            />
          )}
        />

        <Controller
          name="maxCapacity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Capacidade Máxima"
              type="number"
              error={!!errors.maxCapacity}
              helperText={errors.maxCapacity?.message}
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.status}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select {...field} label="Status" labelId="status-label">
                {CLASS_STATUS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>

              {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <Controller
          name="allowPostStartRegistration"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch checked={field.value} onChange={(_e, checked) => field.onChange(checked)} />
              }
              label="Permite agendamento pós-início"
              labelPlacement="start"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ml: 0,
                pr: (theme) => theme.customSpacings.md,
                '& .MuiFormControlLabel-label': {
                  flexGrow: 1,
                  textAlign: 'left',
                },
              }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: (theme) => theme.customSpacings.md }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditing ? (
            'Atualizar Classe'
          ) : (
            'Adicionar Classe'
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default ClassFormModal;
