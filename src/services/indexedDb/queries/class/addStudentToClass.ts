import { CLASSES_STORE_NAME } from '@/services/indexedDb/dbConfig';
import { initializeDB } from '@/services/indexedDb/dbService';

import type { IClass } from '@/customTypes/IClass';

export async function addStudentToClass(classId: string, studentId: string): Promise<boolean> {
  const db = await initializeDB();

  const tx = db.transaction(CLASSES_STORE_NAME, 'readwrite');
  const store = tx.objectStore(CLASSES_STORE_NAME);
  const classData = (await store.get(classId)) as IClass;

  if (!classData) {
    throw new Error(`Aula com ID ${classId} não encontrada.`);
  }

  // Regra de Negócio: Aula não pode ultrapassar capacidade máxima
  if (classData.studentsIds.length >= classData.maxCapacity) {
    throw new Error('Capacidade máxima atingida.');
  }

  // Regra de Negócio: Não permitir agendamento pós-início se não habilitado
  const now = new Date();
  const classDateTime = new Date(classData.datetime);

  if (
    !classData.allowPostStartRegistration &&
    classDateTime < now &&
    classData.status !== 'Concluída'
  ) {
    throw new Error('Agendamento após o início não permitido.');
  }

  // Evitar agendamento duplicado
  if (classData.studentsIds.includes(studentId)) {
    throw new Error('Aluno já agendado nesta aula.');
  }

  classData.studentsIds.push(studentId);
  await store.put(classData);
  await tx.done;

  return true;
}
