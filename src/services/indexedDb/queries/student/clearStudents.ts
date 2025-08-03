import { STUDENTS_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

export async function clearStudents() {
  const db = await initializeDB();

  return db.clear(STUDENTS_STORE_NAME);
}
