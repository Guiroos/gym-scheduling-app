export interface ColumnDef<T, K extends keyof T = keyof T> {
  field: K;
  headerName: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  renderCell?: (params: { value: T[K]; row: T }) => React.ReactNode;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  rowKey: keyof T;
  pagination?: boolean;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}
