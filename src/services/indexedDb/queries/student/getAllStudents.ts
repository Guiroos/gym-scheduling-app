import { STUDENTS_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IStudent } from '@/customTypes/IStudent';

export async function getAllStudents(): Promise<IStudent[]> {
  const db = await initializeDB();

  return db.getAll(STUDENTS_STORE_NAME);
}
