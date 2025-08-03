import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IClass } from '@/customTypes/IClass';

export async function getClassesByDateRange(startDate: Date, endDate: Date): Promise<IClass[]> {
  const db = await initializeDB();

  const allClasses = await db.getAll(CLASSES_STORE_NAME);

  return allClasses
    .filter((classData) => {
      const classDate = new Date(classData.datetime);
      return classDate >= startDate && classDate <= endDate;
    })
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
}
