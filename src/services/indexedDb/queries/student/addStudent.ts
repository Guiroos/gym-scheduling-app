import { STUDENTS_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IStudent } from '@/customTypes/IStudent';

export async function addStudent(student: IStudent): Promise<string> {
  const db = await initializeDB();
  const studentWithId = { ...student, id: student.id || crypto.randomUUID() };

  return db.put(STUDENTS_STORE_NAME, studentWithId);
}
