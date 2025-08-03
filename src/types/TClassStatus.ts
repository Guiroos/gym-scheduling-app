export const CLASS_STATUS = ['Aberta', 'Concluída'] as const;
export type TClassStatus = (typeof CLASS_STATUS)[number];
