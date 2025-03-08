import { sql } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// junction table that relates person profile and the files to be uploaded
export const person_profile_file_upload = sqliteTable('person_profile_file_upload', {
    id: integer('id').notNull().primaryKey(),
    person_profile_id: text('person_profile_id'),
    file_id: text('file_id'),
    file_name: text('file_name'), //this is the name of the file that has been uploaded
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text('created_by').notNull(),
    last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text('last_modified_by'),
    push_status_id: integer('push_status_id').default(0),
    push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text('deleted_by'),
    is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    remarks: text('remarks'),
});