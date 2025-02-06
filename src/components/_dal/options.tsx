"use server";

import { db } from "@/db";
import { LibraryOption } from "../interfaces/library-interface";
import { lib_civil_status, lib_sex } from "@/db/schema/libraries";
import { eq } from "drizzle-orm";
import { cache } from "react";

const getLibraryOptions = (library: any, descriptionField: string): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        const results = await db.select().from(library).where(eq(library.is_deleted, false)).execute();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
        }));
    });
};

export const getSexLibraryOptions = getLibraryOptions(lib_sex, 'sex_description');
export const getCivilStatusLibraryOptions = getLibraryOptions(lib_civil_status, 'civil_status_description');