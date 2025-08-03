import { STUDENTS_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

export async function deleteStudent(id: string): Promise<void> {
  const db = await initializeDB();

  return db.delete(STUDENTS_STORE_NAME, id);
}
