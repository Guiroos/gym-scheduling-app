import type { IStudent } from '@/types/IStudent';

export interface StudentRowProps {
  student: IStudent;
  onEdit: (studentId: string) => void;
  onDelete: (studentId: string) => void;
}
