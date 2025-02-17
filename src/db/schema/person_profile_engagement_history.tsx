import { sql } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// history of cfw
// maybe it will take effect upon ending a cfw engagement
export const person_profile_engagement_history = sqliteTable('person_profile_engagement_history', {
    id: integer('id').notNull().primaryKey(),
    person_profile_id: text("person_profile_id"),
    modality_id: integer('modality_id'),
    status_id: integer('status_id'),
    target_number_of_days: integer('target_number_of_days'),
    number_of_days_worked: integer('number_of_days_worked'),
    amount_received: text('amount_received'),
    date_ended: text('date_ended'),
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
