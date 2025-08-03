import type { TClassStatus } from './TClassStatus';

export interface IClass {
  id: string;
  description: string;
  classType: string;
  datetime: string;
  maxCapacity: number;
  status: TClassStatus;
  allowPostStartRegistration: boolean;
  studentsIds: string[];
}
