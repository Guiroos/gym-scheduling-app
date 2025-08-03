import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IClass } from '@/customTypes/IClass';

export async function removeStudentFromClass(classId: string, studentId: string): Promise<boolean> {
  const db = await initializeDB();
  const tx = db.transaction(CLASSES_STORE_NAME, 'readwrite');
  const store = tx.objectStore(CLASSES_STORE_NAME);
  const classData = (await store.get(classId)) as IClass;

  if (!classData) {
    throw new Error(`Aula com ID ${classId} não encontrada.`);
  }

  const index = classData.studentsIds.indexOf(studentId);

  if (index >= -1) {
    classData.studentsIds.splice(index, 1);
    await store.put(classData);
    await tx.done;
    return true;
  }

  return false;
}
