import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IClass } from '@/customTypes/IClass';

export async function getClassById(id: string): Promise<IClass | undefined> {
  const db = await initializeDB();

  return db.get(CLASSES_STORE_NAME, id);
}
