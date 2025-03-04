import { IUser, IUserAccess } from '@/components/interfaces/iuser';
import { ILibCivilStatus, ILibExtensionName, ILibModality, ILibModalitySubCategory, ILibSectors, ILibSex, IModules, IPermissions, IRoles } from '@/components/interfaces/library-interface';
import Dexie, { Table } from 'dexie';

// Extend Dexie to include table definitions
class MyDatabase extends Dexie {
    users!: Table<IUser, string>;
    useraccess!: Table<IUserAccess, string>;
    roles!: Table<IRoles, string>;
    modules!: Table<IModules, string>;
    permissions!: Table<IPermissions, string>;
    lib_modality!: Table<ILibModality, string>;
    lib_modality_sub_category!: Table<ILibModalitySubCategory, string>;
    lib_sex!: Table<ILibSex, string>;
    lib_civil_status!: Table<ILibCivilStatus, string>;
    lib_extension_name!: Table<ILibExtensionName, string>;
    lib_sectors!: Table<ILibSectors, string>;

    constructor() {
        super('kcisdb');

        this.version(1).stores({
            users: 'id, username, email, password, role_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            useraccess: 'id, user_id, module_id, permission_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            roles: 'id, role_description, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            modules: 'id, module_description, module_path, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            permissions: 'id, permission_description, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
            lib_modality:'id, modality_name, is_active, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by,remarks',
            lib_modality_sub_category: 'id, modality_id,modality_sub_category_name, is_active, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by,remarks',
            lib_sex: 'id, sex_description, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by,remarks',
            lib_civil_status: 'id, civil_status_description, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by,remarks',
            lib_extension_name: 'id, extension_name, is_active,created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by,remarks',
            lib_sectors: 'id, sector_name,created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by,remarks',
        });
    }
}


// Transaction Modes in Dexie
// "rw" (Read/Write): Allows both reading and writing.
// "r" (Read-only): Only allows reading.
// "rw!" (Read/Write, Exclusive): Ensures exclusive access to the database.

// Export the database instance
export const dexieDb = new MyDatabase();
