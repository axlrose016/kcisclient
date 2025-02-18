import Dexie from 'dexie';

// Initialize a new Dexie database with a name (e.g., 'myDatabase')
export const dexieDb = new Dexie('kcisdb');

// Define the schema for your database version(s)
// This is where you define tables and their indexes
dexieDb.version(1).stores({
  users: 'id++, username, email, password, role_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks',
});