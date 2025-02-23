import { IUser, IUserAccess } from '@/components/interfaces/iuser';
import { IModules, IPermissions, IRoles } from '@/components/interfaces/library-interface';
import Dexie, { Table } from 'dexie';

// Extend Dexie to include table definitions
class MyDatabase extends Dexie {
    users!: Table<IUser, string>;
    useraccess!: Table<IUserAccess, string>;
    roles!: Table<IRoles, string>;
    modules!: Table<IModules, string>;
    permissions!: Table<IPermissions, string>;

    constructor() {
        super('kcisdb');

        this.version(1).stores({
            users: 'id, username, email, password, role_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            useraccess: 'id, user_id, module_id, permission_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            roles: 'id, role_description, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            modules: 'id, module_description, module_path, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            permissions: 'id, permission_description, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks'
        });
    }
}


// Transaction Modes in Dexie
// "rw" (Read/Write): Allows both reading and writing.
// "r" (Read-only): Only allows reading.
// "rw!" (Read/Write, Exclusive): Ensures exclusive access to the database.

// Export the database instance
export const dexieDb = new MyDatabase();
