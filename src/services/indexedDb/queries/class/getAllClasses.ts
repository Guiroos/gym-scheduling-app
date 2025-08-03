import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IClass } from '@/customTypes/IClass';

export async function getAllClasses(): Promise<IClass[]> {
  const db = await initializeDB();

  return db.getAll(CLASSES_STORE_NAME);
}
