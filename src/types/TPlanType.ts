export const PLAN_TYPES = ['Mensal', 'Trimestral', 'Anual'] as const;
export type TPlanType = (typeof PLAN_TYPES)[number];
