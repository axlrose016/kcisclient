import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { seed } from "./seed";

export async function migrateDatabase(db: any) {
    console.log("Running database migration...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration complete.");
}

export async function seedLibrary(db: any) {
    console.log("Seeding library...");
    await seed(db);
    console.log("Library seeded.");
}
