import * as yup from 'yup';

import { PLAN_TYPES } from '@/customTypes/TPlanType';

export const studentSchema = yup.object({
  id: yup.string().optional(),
  name: yup.string().min(3, 'Nome deve ter pelo menos 3 caracteres').required('Nome é obrigatório'),
  birthDate: yup
    .string()
    .required('Data de nascimento é obrigatória')
    .test('date', 'Formato de data inválido', (value) => {
      if (!value) return false;
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(value);
    })
    .typeError('Formato de data inválido'),
  cpf: yup.string().optional(),
  city: yup.string().optional(),
  neighborhood: yup.string().optional(),
  address: yup.string().optional(),
  planType: yup.string().oneOf(PLAN_TYPES).required('Tipo de plano é obrigatório'),
});
