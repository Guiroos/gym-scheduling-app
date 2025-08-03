import type { IClass } from '@/customTypes/IClass';

export interface ClassCardProps {
  classData: IClass;
  openDetails: (classId: string) => void;
  openEdit: (classId: string) => void;
}
