import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IClass } from '@/customTypes/IClass';

export async function updateClass(classData: IClass): Promise<string> {
  const db = await initializeDB();

  if (!classData.id) {
    throw new Error('Aula precisa ter um ID para ser atualizada.');
  }

  return db.put(CLASSES_STORE_NAME, classData);
}
