import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

export async function deleteClass(id: string): Promise<void> {
  const db = await initializeDB();

  return db.delete(CLASSES_STORE_NAME, id);
}
