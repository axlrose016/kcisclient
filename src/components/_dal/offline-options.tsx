import { cache } from "react";
import { LibraryOption } from "../interfaces/library-interface";
import { dexieDb } from "@/db/offline/Dexie/dexieDb";

const getOfflineLibraryOptions = (library: string, descriptionField: string): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        await dexieDb.open();
        const results = await dexieDb.table(library).toArray();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
        }));
    });
}

export const getOfflineLibModalityOptions = getOfflineLibraryOptions('lib_modality', 'modality_name');
export const getOfflineLibModalitySubCategoryOptions = getOfflineLibraryOptions('lib_modality_sub_category', 'modality_sub_category_name');
export const getOfflineLibSexOptions = getOfflineLibraryOptions('lib_sex', 'sex_description');
export const getOfflineCivilStatusLibraryOptions = getOfflineLibraryOptions('lib_civil_status', 'civil_status_description');
export const getOfflineExtensionLibraryOptions = getOfflineLibraryOptions('lib_extension_name', 'extension_name');
export const getOfflineLibSectorsLibraryOptions = getOfflineLibraryOptions('lib_sectors', 'sector_name');