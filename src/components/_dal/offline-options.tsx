import { cache } from "react";
import { LibraryOption } from "../interfaces/library-interface";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";

const getOfflineLibraryOptions = (library: string, descriptionField: string): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        await dexieDb.open();
        const results = await dexieDb.table(library).toArray();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
            label: row[descriptionField]
        }));
    });
}
export const getOfflineLibModalityOptions = getOfflineLibraryOptions('lib_modality', 'modality_name');
export const getOfflineLibModalitySubCategoryOptions = getOfflineLibraryOptions('lib_modality_sub_category', 'modality_sub_category_name');
export const getOfflineLibSexOptions = getOfflineLibraryOptions('lib_sex', 'sex_description');
export const getOfflineCivilStatusLibraryOptions = getOfflineLibraryOptions('lib_civil_status', 'civil_status_description');
export const getOfflineExtensionLibraryOptions = getOfflineLibraryOptions('lib_extension_name', 'extension_name');
export const getOfflineLibSectorsLibraryOptions = getOfflineLibraryOptions('lib_sectors', 'sector_name');
export const getOfflineLibIdCard = getOfflineLibraryOptions('lib_id_card', 'id_card_name');
export const getOfflineLibEducationalAttainment = getOfflineLibraryOptions('lib_educational_attainment','educational_attainment_description');
export const getOfflineLibRelationshipToBeneficiary = getOfflineLibraryOptions('lib_relationship_to_beneficiary', 'relationship_name');
export const getOfflineLibTypeOfDisability = getOfflineLibraryOptions('lib_type_of_disability','disability_name');
export const getOfflineLibCFWType = getOfflineLibraryOptions('lib_cfw_type','cfw_type_name');
export const getOfflineLibYearLevel = getOfflineLibraryOptions('lib_year_level','year_level_name');
export const getOfflineLibCourses = getOfflineLibraryOptions('lib_school_programs','program_name');
export const getOfflineLibSchools = getOfflineLibraryOptions('lib_school_profiles','school_name');
export const getOfflineLibDeploymentArea = getOfflineLibraryOptions('lib_deployment_area','deployment_name');
export const getOfflineLibTypeOfWork = getOfflineLibraryOptions('lib_type_of_work','work_name');
export const getOfflineLibFilesToUpload = getOfflineLibraryOptions('lib_files_to_upload','file_name');
export const getOfflineLibYearServed = getOfflineLibraryOptions('lib_year_served','year_served');
export const getOfflineLibProgramTypes = getOfflineLibraryOptions('lib_program_types','program_type_name');
export const getOfflineLibIPGroup = getOfflineLibraryOptions('lib_ip_group', 'name')
// export const getOfflineLibIPGroup = getOfflineLibraryOptions('lib_i','file_name');