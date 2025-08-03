import type { TPlanType } from './TPlanType';

export interface IStudent {
  id: string;
  name: string;
  birthDate: string;
  cpf?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
  planType: TPlanType;
}
