import * as yup from 'yup';

export const classSchema = yup.object({
  id: yup.string(),
  description: yup
    .string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .required('Descrição é obrigatória'),
  classType: yup.string().required('Tipo de aula é obrigatório'),
  datetime: yup
    .string()
    .required('Data e hora é obrigatória')
    .typeError('Formato de data inválido'),
  maxCapacity: yup.number().required(),
  status: yup.string().required(),
  allowPostStartRegistration: yup.boolean().required(),
  studentsIds: yup.array().required(),
});
