import type { DBSchema } from 'idb';

import type { IClass } from '@/customTypes/IClass';
import type { IStudent } from '@/customTypes/IStudent';

import { CLASSES_STORE_NAME, STUDENTS_STORE_NAME } from './dbConfig';

export interface GymDBSchema extends DBSchema {
  [STUDENTS_STORE_NAME]: {
    value: IStudent;
    key: string;
  };

  [CLASSES_STORE_NAME]: {
    value: IClass;
    key: string;
  };
}
