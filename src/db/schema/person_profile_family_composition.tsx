import { sql } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const person_profile_family_composition = sqliteTable('person_profile_family_composition', {
    id: integer('id').notNull().primaryKey(),
    person_profile_id: text("person_profile_id"),
    name: text('name'),
    birthdate: text('birthdate'),
    age: integer('age'),
    contact_number: text('contact_number'),
    highest_educational_attainment_id: integer('highest_educational_attainment_id'),
    monthly_income: text('monthly_income'),
    relationship_to_the_beneficiary_id: integer('relationship_to_the_beneficiary_id'),
    work: text('work'),
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
