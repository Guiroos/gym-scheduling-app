import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useMask } from '@react-input/mask';
import type { InferType } from 'yup';

import Modal from '@/components/Modal';

import { addStudent } from '@/queries/student/addStudent';
import { getStudentById } from '@/queries/student/getStudentById';
import { updateStudent } from '@/queries/student/updateStudent';

import { cleanCpf, formatCpf } from '@/utils/mask/cpfMasks';
import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';
import { studentSchema } from '@/utils/yupSchemas/studentSchema';

import type { IStudent } from '@/customTypes/IStudent';
import { PLAN_TYPES, type TPlanType } from '@/customTypes/TPlanType';

import type { StudentFormModalProps } from './types';

const ModalStudentForm = ({
  isOpen,
  editingStudentId,
  onClose,
  onSubmitSuccess,
}: StudentFormModalProps) => {
  const isEditing = Boolean(editingStudentId);

  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      id: '',
      name: '',
      birthDate: new Date().toISOString().split('T')[0],
      cpf: '',
      city: '',
      neighborhood: '',
      address: '',
      planType: 'Mensal',
    },
    mode: 'onChange',
  });

  const cpfInputRef = useMask({
    mask: '___.___.___–__',
    replacement: { _: /\d/ },
    showMask: true,
  });

  const handleGetStudentById = useCallback(async () => {
    if (!editingStudentId) return;

    try {
      const student = await getStudentById(editingStudentId);

      if (!student) {
        handleToastifyMessage({ message: 'Aluno não encontrado', type: 'error' });
        onClose();
        return;
      }

      setValue('id', student.id);
      setValue('name', student.name);
      setValue('birthDate', student.birthDate);
      setValue('cpf', student.cpf ? formatCpf(student.cpf) : '');
      setValue('city', student.city);
      setValue('neighborhood', student.neighborhood);
      setValue('address', student.address);
      setValue('planType', student.planType);
    } catch (error) {
      handleToastifyMessage({
        message: `Erro ao buscar aluno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        type: 'error',
      });
    }
  }, [editingStudentId]);

  const onSubmit = useCallback(
    async (data: InferType<typeof studentSchema>) => {
      try {
        const studentToSave: IStudent = {
          ...data,
          id: data.id || crypto.randomUUID(),
          cpf: cleanCpf(data.cpf),
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          planType: data.planType as TPlanType,
        };

        if (isEditing && editingStudentId) {
          await updateStudent(studentToSave);
          handleToastifyMessage({ message: 'Aluno atualizado com sucesso', type: 'success' });
        } else {
          await addStudent(studentToSave);
          handleToastifyMessage({ message: 'Aluno adicionado com sucesso', type: 'success' });
        }

        onSubmitSuccess();
        onClose();
      } catch (error) {
        handleToastifyMessage({
          message: `Erro ao salvar aluno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          type: 'error',
        });
      }
    },
    [isEditing, editingStudentId]
  );

  useEffect(() => {
    if (isEditing && editingStudentId) {
      handleGetStudentById();
    } else if (isOpen && !isEditing) {
      reset();
    }
  }, [editingStudentId, isOpen, isEditing]);

  return (
    <Modal title={isEditing ? 'Editar Aluno' : 'Adicionar Aluno'} isOpen={isOpen} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={(theme) => theme.customSpacings.md}
        mt={(theme) => theme.customSpacings.md}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Data de Nascimento"
              type="date"
              error={!!errors.birthDate}
              helperText={errors.birthDate?.message}
            />
          )}
        />

        <Controller
          name="cpf"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="CPF"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              inputRef={cpfInputRef}
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Cidade"
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          )}
        />

        <Controller
          name="neighborhood"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Bairro"
              error={!!errors.neighborhood}
              helperText={errors.neighborhood?.message}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Endereço"
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          )}
        />

        <Controller
          name="planType"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.planType}>
              <InputLabel id="plan-type-label">Tipo de plano</InputLabel>
              <Select {...field} label="Plan Type" labelId="plan-type-label">
                {PLAN_TYPES.map((planType) => (
                  <MenuItem key={planType} value={planType}>
                    {planType}
                  </MenuItem>
                ))}
              </Select>

              {errors.planType && <FormHelperText>{errors.planType.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
          sx={{ mt: (theme) => theme.customSpacings.xl }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditing ? (
            'Atualizar Aluno'
          ) : (
            'Adicionar Aluno'
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalStudentForm;
