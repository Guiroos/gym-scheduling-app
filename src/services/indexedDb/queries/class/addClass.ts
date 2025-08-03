import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IClass } from '@/customTypes/IClass';

export async function addClass(classData: IClass): Promise<string> {
  const db = await initializeDB();
  const classDataWithId = { ...classData, id: classData.id || crypto.randomUUID() };

  return db.put(CLASSES_STORE_NAME, classDataWithId);
}
