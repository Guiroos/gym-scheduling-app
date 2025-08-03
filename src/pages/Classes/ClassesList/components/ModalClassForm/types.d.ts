export interface ClassFormModalProps {
  isOpen: boolean;
  editingClassId?: string | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}
