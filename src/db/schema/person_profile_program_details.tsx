import { sql } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// junction table that relates person_profile, cfw_type - this is for family with 
// ANG INYONG PAMILYA BA AY NAGING BENEPISYARYO NA DIN NG CASH-FOR-WORK PROGRAM NG DSWD? (ex: Tara Basa Program, CFW for Disaster, etc)
export const cfw_family_program_details = sqliteTable('cfw_family_program_details', {
    id: integer('id').notNull().primaryKey(),
    person_profile_id: text("person_profile_id"),
    cfw_type_id: integer('cfw_type_id'),
    year_served: integer('year_served'),
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
