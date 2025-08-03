import { type IDBPDatabase, openDB } from 'idb';

import { CLASSES_STORE_NAME, DB_NAME, DB_VERSION, STUDENTS_STORE_NAME } from './dbConfig';
import type { GymDBSchema } from './dbService.types';

let dbPromise: Promise<IDBPDatabase<GymDBSchema>>;

export async function initializeDB() {
  if (!dbPromise) {
    dbPromise = openDB<GymDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore(STUDENTS_STORE_NAME, { keyPath: 'id' });
          db.createObjectStore(CLASSES_STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  return dbPromise;
}

initializeDB();
