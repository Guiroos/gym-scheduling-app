import { faker } from '@faker-js/faker/locale/pt_BR';

import { addStudent } from '@/services/indexedDb/queries/student/addStudent';

import type { IStudent } from '@/customTypes/IStudent';
import { PLAN_TYPES } from '@/customTypes/TPlanType';

const CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Brasília',
  'Salvador',
  'Fortaleza',
  'Curitiba',
  'Manaus',
  'Recife',
  'Porto Alegre',
];

const NEIGHBORHOODS = [
  'Centro',
  'Jardim América',
  'Vila Nova',
  'Alphaville',
  'Barra da Tijuca',
  'Boa Viagem',
  'Savassi',
  'Asa Sul',
  'Batel',
  'Ponta Verde',
];

function generateCPF() {
  const rand = (n: number) => Math.round(Math.random() * n);
  const mod = (base: number, div: number) => Math.round(base - Math.floor(base / div) * div);

  const n = Array(9)
    .fill(0)
    .map(() => rand(9));

  // First digit
  let d1 =
    n[0] * 10 +
    n[1] * 9 +
    n[2] * 8 +
    n[3] * 7 +
    n[4] * 6 +
    n[5] * 5 +
    n[6] * 4 +
    n[7] * 3 +
    n[8] * 2;
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;

  // Second digit
  let d2 =
    d1 * 2 + n[0] * 9 + n[1] * 8 + n[2] * 7 + n[3] * 6 + n[4] * 5 + n[5] * 4 + n[6] * 3 + n[7] * 2;
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;

  return `${n.join('')}${d1}${d2}`.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function generateMockStudents(count = 20): IStudent[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Array.from({ length: count }, (_, _i) => {
    const birthDate = faker.date.birthdate({ min: 18, max: 70, mode: 'age' });
    const city = faker.helpers.arrayElement(CITIES);
    const neighborhood = faker.helpers.arrayElement(NEIGHBORHOODS);

    return {
      id: crypto.randomUUID(),
      name: faker.person.fullName(),
      birthDate: birthDate.toISOString().split('T')[0],
      cpf: generateCPF(),
      city,
      neighborhood,
      address: `${faker.location.street()}, ${faker.number.int({ min: 10, max: 9999 })}`,
      planType: faker.helpers.arrayElement(PLAN_TYPES),
    };
  });
}

export async function generateMockStudentsAndAddToDB(count = 20): Promise<void> {
  const students = generateMockStudents(count);

  await Promise.all(students.map((student) => addStudent(student)));
}
