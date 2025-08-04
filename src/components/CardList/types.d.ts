export interface CardListProps<T> {
  items: T[];
  loading?: boolean;
  emptyMessage?: string;
  pagination?: boolean;
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}
