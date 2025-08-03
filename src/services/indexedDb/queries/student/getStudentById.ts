import { STUDENTS_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IStudent } from '@/customTypes/IStudent';

export async function getStudentById(id: string): Promise<IStudent | undefined> {
  const db = await initializeDB();

  return db.get(STUDENTS_STORE_NAME, id);
}
