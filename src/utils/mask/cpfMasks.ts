export const cleanCpf = (cpf: string | undefined): string | undefined => {
  if (!cpf) return undefined;

  return cpf.replace(/\D/g, '');
};

export const formatCpf = (cpf: string | undefined): string | undefined => {
  if (!cpf) return undefined;

  const cleaned = cleanCpf(cpf);

  if (!cleaned) return undefined;

  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2');
};
