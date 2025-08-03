export interface StudentFormModalProps {
  isOpen: boolean;
  editingStudentId?: string | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}
