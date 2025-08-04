import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

export async function clearClasses() {
  const db = await initializeDB();

  return db.clear(CLASSES_STORE_NAME);
}
