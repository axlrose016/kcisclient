import Dexie, { Table } from 'dexie';
import { ILibEmploymentStatus, ILibLevel, ILibPosition } from '@/components/interfaces/library-interface';

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';

class LibDatabase extends Dexie {
    lib_level!: Table<ILibLevel, string>;
    lib_employment_status!: Table<ILibEmploymentStatus, string>;
    lib_position!: Table<ILibPosition, string>;

    constructor() {
        super('libdb');
        this.version(1).stores({
            lib_level: `++id, level_description, ${commonFields}`,
            lib_employment_status: `++id, employment_status_description, ${commonFields}`,
            lib_position: `++id, position_description, ${commonFields}`
        })
    }
}
export const libDb = new LibDatabase();
