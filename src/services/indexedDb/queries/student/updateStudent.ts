import { STUDENTS_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IStudent } from '@/customTypes/IStudent';

export async function updateStudent(student: IStudent): Promise<string> {
  const db = await initializeDB();

  if (!student.id) {
    throw new Error('Student precisa ter um ID para ser atualizado.');
  }

  return db.put(STUDENTS_STORE_NAME, student);
}
