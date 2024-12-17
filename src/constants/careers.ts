export const CAREERS = [
  'Diseño Gráfico',
  'Diseño de Modas',
  'Admón. Turística y Hotelera',
  'Ingeniería de Software',
  'Negocios Internacionales',
  'Admón. Financiera',
  'Negocios Distancia',
  'Logística Empresarial'
] as const;

export type Career = typeof CAREERS[number];