import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

export async function finalizeClass(classId: string): Promise<void> {
  const db = await initializeDB();

  const tx = db.transaction(CLASSES_STORE_NAME, 'readwrite');
  const store = tx.objectStore(CLASSES_STORE_NAME);
  const classData = await store.get(classId);

  if (!classData) {
    throw new Error(`Aula com ID ${classId} não encontrada.`);
  }

  classData.status = 'Concluída';
  await store.put(classData);
  await tx.done;
}
