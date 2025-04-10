import Dexie, { EntityTable } from "dexie";
import { dexieDb } from "../databases/dexieDb";
import { ILibCFWType, ILibCivilStatus, ILibCourses, ILibDeploymentArea, ILibEducationalAttainment, ILibExtensionName, ILibFilesToUpload, ILibIdCard, ILibIPGroup, ILibModality, ILibModalitySubCategory, ILibProgramTypes, ILibRelationshipToBeneficiary, ILibSchoolProfiles, ILibSchoolPrograms, ILibSectors, ILibSex, ILibTypeOfDisability, ILibTypeOfWork, ILibYearLevel, ILibYearServed, IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";
import { ICFWSchedules, ICFWTimeLogs, IUser, IUserAccess } from "@/components/interfaces/iuser";
import { seedCFWSchedules, seedCFWTimeLogs } from "./user-service";

const tblRoles = dexieDb.table('roles') as EntityTable<IRoles, 'id'>;
const tblModules = dexieDb.table('modules') as EntityTable<IModules, 'id'>;
const tblPermissions = dexieDb.table('permissions') as EntityTable<IPermissions, 'id'>;
const tblLibModality = dexieDb.table('lib_modality') as EntityTable<ILibModality, 'id'>;
const tblLibModalitySubCategory = dexieDb.table('lib_modality_sub_category') as EntityTable<ILibModalitySubCategory, 'id'>;
const tblLibSex = dexieDb.table('lib_sex') as EntityTable<ILibSex, 'id'>;
const tblLibCivilStatus = dexieDb.table('lib_civil_status') as EntityTable<ILibCivilStatus, 'id'>;
const tblLibExtensionName = dexieDb.table('lib_extension_name') as EntityTable<ILibExtensionName, 'id'>;
const tblLibSectors = dexieDb.table('lib_sectors') as EntityTable<ILibSectors, 'id'>;
const tblLibIdCard = dexieDb.table('lib_id_card') as EntityTable<ILibIdCard, 'id'>;
const tblLibEducationalAttainment = dexieDb.table('lib_educational_attainment') as EntityTable<ILibEducationalAttainment, 'id'>;
const tblLibRelationshipToBeneficiary = dexieDb.table('lib_relationship_to_beneficiary') as EntityTable<ILibRelationshipToBeneficiary, 'id'>;
const tblLibTypeOfDisability = dexieDb.table('lib_type_of_disability') as EntityTable<ILibTypeOfDisability, 'id'>;
const tblLibCFWType = dexieDb.table('lib_cfw_type') as EntityTable<ILibCFWType, 'id'>;
const tblLibYearLevel = dexieDb.table('lib_year_level') as EntityTable<ILibYearLevel, 'id'>;
const tblLibCourses = dexieDb.table('lib_courses') as EntityTable<ILibCourses, 'id'>;
const tblLibDeploymentArea = dexieDb.table('lib_deployment_area') as EntityTable<ILibDeploymentArea, 'id'>;
const tblLibTypeOfWork = dexieDb.table('lib_type_of_work') as EntityTable<ILibTypeOfWork, 'id'>;
const tblLibFilesToUpload = dexieDb.table('lib_files_to_upload') as EntityTable<ILibFilesToUpload, 'id'>;
const tblLibIPGroup = dexieDb.table('lib_ip_group') as EntityTable<ILibIPGroup, 'id'>;
const tblLibYearServed = dexieDb.table('lib_year_served') as EntityTable<ILibYearServed, 'id'>;
const tblLibProgramTypes = dexieDb.table('lib_program_types') as EntityTable<ILibProgramTypes, 'id'>;
const tblCFWSchedules = dexieDb.table('cfwschedules') as EntityTable<ICFWSchedules, 'id'>;
const tblCFWTimeLogs = dexieDb.table('cfwtimelogs') as EntityTable<ICFWTimeLogs, 'id'>;
const tblLibSchoolProfiles = dexieDb.table('lib_school_profiles') as EntityTable<ILibSchoolProfiles, 'id'>;
const tblLibSchoolPrograms = dexieDb.table('lib_school_programs') as EntityTable<ILibSchoolPrograms, 'id'>;

//Roles Service
export async function addRole(role: IRoles) {
    try {
        return await tblRoles.add(role);
    } catch (error) {
        return null;
    }
}
export async function bulkAddRole(roles: IRoles[]) {
    try {
        return await tblRoles.bulkAdd(roles);
    } catch (error) {
        return null;
    }
}
export async function getRoles() {
    try {
        return await tblRoles.toArray();
    } catch (error) {
        console.error('Error retrieving roles:', error);
        return [];
    }
}
export const seedRoles: IRoles[] = [
    {
        "id": "d4003a01-36c6-47af-aae5-13d3f04e110f",
        "role_description": "Administrator",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "cae2b943-9b80-45ea-af2a-823730f288ac",
        "role_description": "Guest",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
        "role_description": "Finance",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "1c99504f-ad53-4151-9a88-52e0cffdbb6d",
        "role_description": "Engineer",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "37544f59-f3ba-45df-ae0b-c8fa4e4ce446",
        "role_description": "CFW",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
]

//Modules Service
export async function addModule(module: IModules) {
    try {
        return await tblModules.add(module);
    } catch (error) {
        return null;
    }
}
export async function bulkAddModule(modules: IModules[]) {
    try {
        return await tblModules.bulkAdd(modules);
    } catch (error) {
        return null;
    }
}
export async function getModules() {
    try {
        return await tblModules.toArray();
    } catch (error) {
        console.error('Error retrieving modules:', error);
        return [];
    }
}
export const seedModules: IModules[] = [
    {
        "id": "9bb8ab82-1439-431d-b1c4-20630259157a",
        "module_description": "Sub-Project",
        "module_path": "subproject",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "4e658b02-705a-43eb-a051-681d54e22e2a",
        "module_description": "Person Profile",
        "module_path": "personprofile",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "19a18164-3a26-4ec3-ac6d-755df1d3b980",
        "module_description": "Finance",
        "module_path": "finance",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "78ac69e0-19b6-40d0-8b07-135df9152bd8",
        "module_description": "Procurement",
        "module_path": "procurement",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "ce67be45-b5aa-4272-bcf4-a32abc9d7068",
        "module_description": "Engineering",
        "module_path": "engineering",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "866e6bcb-041f-4d58-94bf-6c54e4855f85",
        "module_description": "Settings",
        "module_path": "settings",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
]

//Permissions Service
export async function addPermission(permission: IPermissions) {
    try {
        return await tblPermissions.add(permission);
    } catch (error) {
        return null;
    }
}
export async function bulkAddPermission(permissions: IPermissions[]) {
    try {
        return await tblPermissions.bulkAdd(permissions);
    } catch (error) {
        return null;
    }
}
export async function getPermissions() {
    try {
        return await tblPermissions.toArray();
    } catch (error) {
        console.error('Error retrieving permissions:', error);
        return [];
    }
}
export const seedPermissions: IPermissions[] = [
    {
        "id": "f38252b5-cc46-4cc1-8353-a49a78708739",
        "permission_description": "Can Add",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "98747f00-76e5-497d-beac-ba4255db066f",
        "permission_description": "Can Update",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
        "permission_description": "Can Delete",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
]

//Modality Service
export async function addModality(modality: ILibModality) {
    try {
        return await tblLibModality.add(modality);
    } catch (error) {
        return null;
    }
}
export async function bulkAddModality(modalities: ILibModality[]) {
    try {
        return await tblLibModality.bulkAdd(modalities);
    } catch (error) {
        return null;
    }
}
export async function getModalities() {
    try {
        return await tblLibModality.toArray();
    } catch (error) {
        console.error('Error retrieving modalities:', error);
        return [];
    }
}
export const seedLibModalities: ILibModality[] = [
    {
        "id": 1,
        "modality_name": "KC1",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 2,
        "modality_name": "PAMANA (2016 and earlier)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 3,
        "modality_name": "MCC",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 4,
        "modality_name": "AF (Old)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 5,
        "modality_name": "AUSAid",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 6,
        "modality_name": "PODER",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 7,
        "modality_name": "NCDDP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 8,
        "modality_name": "BUB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 9,
        "modality_name": "JFPR",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 10,
        "modality_name": "DFAT",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 11,
        "modality_name": "GIG",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 12,
        "modality_name": "CCL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 13,
        "modality_name": "GOP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 14,
        "modality_name": "L&E",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 15,
        "modality_name": "IP-CDD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 16,
        "modality_name": "MAKILAHOK",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 17,
        "modality_name": "KKB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 18,
        "modality_name": "KSB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 19,
        "modality_name": "PAMANA (2020 onwards)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 20,
        "modality_name": "KKB 2020",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 21,
        "modality_name": "NCDDP-AF",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 22,
        "modality_name": "PMNP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 23,
        "modality_name": "KKB-CDD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 24,
        "modality_name": "PAG-ABOT",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 25,
        "modality_name": "CFW",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    }
]
export const seedModalitySubCategory: ILibModalitySubCategory[] = [
    {
        "id": 1,
        "modality_id": 25,
        "modality_sub_category_name": "CFW - HEI",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "modality_id": 25,
        "modality_sub_category_name": "CFW - PWD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
]
export const seedLibSex: ILibSex[] = [
    {
        "id": 1,
        "sex_description": "Female",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "sex_description": "Male",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
]
export const seedLibCivilStatus: ILibCivilStatus[] = [
    {
        "id": 1,
        "civil_status_description": "Annulled",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "civil_status_description": "Legally Separated",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "civil_status_description": "Married",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "civil_status_description": "Single",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "civil_status_description": "Widowed",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
]
export const seedLibExtensionName: ILibExtensionName[] = [
    {
        "id": 1,
        "extension_name": "Jr.",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "extension_name": "Sr.",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "extension_name": "II",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "extension_name": "III",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "extension_name": "IV",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 6,
        "extension_name": "N/A",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
]
export const seedLibSectors: ILibSectors[] = [
    { "id": 1, "sector_name": "Women", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 2, "sector_name": "Out of School Youth (15-25 yrs old)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 3, "sector_name": "Persons with Disabilities (PWD)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 4, "sector_name": "Indigenous People (IP)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 5, "sector_name": "4Ps Beneficiary", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 6, "sector_name": "Senior Citizen", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 7, "sector_name": "Solo Parent", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 8, "sector_name": "Children (below 14 yrs old)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 9, "sector_name": "Children and Youth in Need of Special Protection", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 10, "sector_name": "LGBTQIA+", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 11, "sector_name": "Youth (15-30 yrs old )", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 12, "sector_name": "Family Heads in Need of Assistance", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 13, "sector_name": "Pregnant Women", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 14, "sector_name": "Farmer", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 15, "sector_name": "Fisherfolk", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 16, "sector_name": "Urban Poor", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 17, "sector_name": "Laborers", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 18, "sector_name": "Migrant Workers", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
]
export const seedLibIdCard: ILibIdCard[] = [
    {
        "id": 1,
        "id_card_name": "National ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "id_card_name": "Passport",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "id_card_name": "Driver's License",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "id_card_name": "SSS ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "id_card_name": "GSIS ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 6,
        "id_card_name": "PRC ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 7,
        "id_card_name": "Philhealth ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 8,
        "id_card_name": "Voter's ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 9,
        "id_card_name": "Senior Citizen ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 10,
        "id_card_name": "PWD ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 11,
        "id_card_name": "N/A",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
]
export const seedLibEducationalAttainment: ILibEducationalAttainment[] = [
    {
        "id": 1,
        "educational_attainment_description": "N/A",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "educational_attainment_description": "NO FORMAL EDUCATION",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "educational_attainment_description": "DAYCARE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "educational_attainment_description": "KINDERGARTEN",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "educational_attainment_description": "ELEMENTARY LEVEL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 6,
        "educational_attainment_description": "ELEMENTARY GRADUATE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 7,
        "educational_attainment_description": "HIGH SCHOOL LEVEL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 8,
        "educational_attainment_description": "HIGH SCHOOL GRADUATE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 9,
        "educational_attainment_description": "COLLEGE LEVEL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 10,
        "educational_attainment_description": "COLLEGE GRADUATE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 11,
        "educational_attainment_description": "WITH UNITS IN MASTERS DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 12,
        "educational_attainment_description": "MASTERS DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
    ,
    {
        "id": 13,
        "educational_attainment_description": "DOCTORATE DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
    ,
    {
        "id": 14,
        "educational_attainment_description": "TECHNICAL-VOCATIONAL EDUCATION AND TRAINING",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
    ,
    {
        "id": 15,
        "educational_attainment_description": "MASTERS DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
];

export const seedLibRelationshipToBeneficiary: ILibRelationshipToBeneficiary[] = [
    { "id": 1, "relationship_name": "Father", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "relationship_name": "Mother", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "relationship_name": "Son", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "relationship_name": "Daughter", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "relationship_name": "Spouse", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "relationship_name": "Sibling", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "relationship_name": "Grandfather", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "relationship_name": "Grandmother", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "relationship_name": "Uncle", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 10, "relationship_name": "Aunt", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 11, "relationship_name": "Cousin", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 12, "relationship_name": "Nephew", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 13, "relationship_name": "Niece", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 14, "relationship_name": "Guardian", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 15, "relationship_name": "Friend", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 16, "relationship_name": "Others", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
]
export const seedTypeofDisability: ILibTypeOfDisability[] = [
    { "id": 1, "disability_name": "Visual Impairment", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "disability_name": "Hearing Impairment", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "disability_name": "Speech Impairment", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "disability_name": "Physical Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "disability_name": "Intellectual Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "disability_name": "Psychosocial Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "disability_name": "Autism Spectrum Disorder", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "disability_name": "Multiple Disabilities", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "disability_name": "Chronic Illness-related Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedCFWType: ILibCFWType[] = [
    { "id": 1, "cfw_type_name": "CFW for Disaster", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "cfw_type_name": "Tara Basa", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
];
export const seedYearLevel: ILibYearLevel[] = [
    { "id": 1, "year_level_name": "First Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "year_level_name": "Second Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "year_level_name": "Third Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "year_level_name": "Fourth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "year_level_name": "Fifth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "year_level_name": "More than Fifth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "year_level_name": "N/A", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedLibCourses: ILibCourses[] = [
    {
        "id": 1,
        "course_code": "BSA",
        "course_name": "BACHELOR OF SCIENCE IN ACCOUNTANCY",
        "course_description": "A program focused on accounting principles, financial reporting, and auditing.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 2,
        "course_code": "BSECE",
        "course_name": "BACHELOR OF SCIENCE IN ELECTRONICS ENGINEERING",
        "course_description": "A program that focuses on electronics, circuit design, and communication systems.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 3,
        "course_code": "BSIE",
        "course_name": "BACHELOR OF SCIENCE IN INDUSTRIAL ENGINEERING",
        "course_description": "Focuses on optimizing complex processes and systems for efficiency and productivity.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 4,
        "course_code": "BSENT",
        "course_name": "BACHELOR OF SCIENCE IN ENTREPRENEURSHIP",
        "course_description": "A program designed to equip students with skills for starting and managing businesses.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 5,
        "course_code": "BSIT",
        "course_name": "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
        "course_description": "A program focused on the study of computer systems, software development, and network administration.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 6,
        "course_code": "BSMA",
        "course_name": "BACHELOR OF SCIENCE IN MANAGEMENT ACCOUNTING",
        "course_description": "A program emphasizing financial management, cost analysis, and strategic planning.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 7,
        "course_code": "BSECE",
        "course_name": "BACHELOR OF SCIENCE IN EARLY CHILDHOOD EDUCATION",
        "course_description": "A program preparing students for teaching young children in educational settings.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
];

export const seedLibDeploymentArea: ILibDeploymentArea[] = [
    { "id": 1, "deployment_name": "ARMED FORCES OF THE PHILIPPINES", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "deployment_name": "BARANGAY LOCAL GOVERNMENT UNIT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "deployment_name": "BIODIVERSITY MANAGEMENT BUREAU", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "deployment_name": "BUREAU OF FIRE PROTECTION", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "deployment_name": "BUREAU OF JAIL MANAGEMENT AND PENOLOGY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "deployment_name": "COMELEC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "deployment_name": "COMMISSION ON HIGHER EDUCATION (CHED)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "deployment_name": "COMMISSION ON POPULATION AND DEVELOPMENT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "deployment_name": "DEPARTMENT OF AGRARIAN REPORM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 10, "deployment_name": "DEPARTMENT OF AGRICULTURE (DA)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 11, "deployment_name": "DEPARTMENT OF BUDGET AND MANAGEMENT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 12, "deployment_name": "DEPARTMENT OF EDUCATION (DEPED)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 13, "deployment_name": "DEPARTMENT OF ENERGY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 14, "deployment_name": "DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 15, "deployment_name": "DEPARTMENT OF HEALTH", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 16, "deployment_name": "DEPARTMENT OF HUMAN SETTLEMENTS AND URBAN DEVELOPMENT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 17, "deployment_name": "DEPARTMENT OF JUSTICE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 18, "deployment_name": "DEPARTMENT OF PUBLIC WORKS AND HIGHWAYS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 19, "deployment_name": "DEPARTMENT OF SCIENCE AND TECHNOLOGY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 20, "deployment_name": "DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 21, "deployment_name": "DSWD NPMO", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 22, "deployment_name": "DSWD RPMO", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 23, "deployment_name": "DSWD SATELITE OFFICES", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 24, "deployment_name": "ELEMENTARY SCHOOL", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 25, "deployment_name": "HEI/S/LUC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 26, "deployment_name": "JUNIOR HIGH SCHOOL", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 27, "deployment_name": "KALAHI-CIDSS AREAS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 28, "deployment_name": "LAND TRANSPORTATION OFFICE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 29, "deployment_name": "LOCAL GOVERNMENT HOSPITALS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 30, "deployment_name": "LOCAL GOVERNMENT UNITS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 31, "deployment_name": "MINES AND GEOSCIENCES BUREAU", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 32, "deployment_name": "NATIONAL IRRIGATION AUTHORITY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 33, "deployment_name": "NATIONAL LABOR RELATIONS COMMISSION", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 34, "deployment_name": "NATIONAL PRIVACY COMMISSION", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 35, "deployment_name": "NATIONAL TELECOMMUNICATIONS COMMISSION", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 36, "deployment_name": "NATIONAL YOUTH COMMISSION", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 37, "deployment_name": "NBI", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 38, "deployment_name": "PHIL NATIONAL POLICE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 39, "deployment_name": "PHILIPPINE COCONUT AUTHORITY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 40, "deployment_name": "PHILIPPINE INFORMATION AGENCY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 41, "deployment_name": "PHILIPPINE STATISTICS AUTHORITY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 42, "deployment_name": "SCIENCE AND TECHNOLOGY INFORMATION INSTITUTE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 43, "deployment_name": "SENATE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 44, "deployment_name": "SENIOR HIGH SCHOOL", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 45, "deployment_name": "SOCIAL SECURITY SYSTEM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },

];
export const seedLibTypeOfWork: ILibTypeOfWork[] = [
    { "id": 1, "work_name": "Office Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "work_name": "Field Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "work_name": "Clerical Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "work_name": "Mixed Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedFilesToUpload: ILibFilesToUpload[] = [
    { "id": 1, "file_name": "Primary ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "file_name": "Primary ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "file_name": "Secondary ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "file_name": "Secondary ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "file_name": "PWD ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "file_name": "PWD ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "file_name": "School ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "file_name": "School ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "file_name": "Certificate of Registration from School", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 10, "file_name": "TOR/Diploma/Certification from the School Registrar", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 11, "file_name": "Certificate of Indigency", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 12, "file_name": "1x1 Picture", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 13, "file_name": "Profile Picture", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedIPGroup: ILibIPGroup[] = [
    ...Array.from({ length: 101 }, (_, i) => ({
        id: i + 1,
        name: [
            "Aeta", "Agta/Aeta", "Agta-Tabangnon", "Agutaynen", "Ata-Manobo", "Badjao", "Bajao", "Banwaon", "Batak", "B'laan",
            "Bukidnon", "Cagayanen", "Cuyonin", "Dibawanon", "Dumagat", "Eskaya", "Higaonon", "Iyakan", "Kabihug", "Kalibugan",
            "Katabagan", "Lambangian", "Maguindanao", "Mandaya", "Mangyan", "Manobo", "Mansaka", "Sabanon", "Samal", "Subanen",
            "Suludnon", "Tagbanua", "Talaandig", "Tao'tbato", "Tboli", "Teduray", "Tribo Aeta", "Others", "Kankanaey", "Bago",
            "Itneg", "Ibaloy", "Tinguian", "Kalanguya", "Aplau", "Ableg", "Adasen", "Agta", "Applai", "Ayangan", "Balangao",
            "Balatoc", "Banao", "Binongan", "Bontok", "Calaoan", "Gubang", "Ibaloi", "Ibanag", "Inlaud", "Isnag", "Itawis",
            "Kalanguya", "Kalinga", "Kankanaey", "Mabaka", "Maeng", "Malanag", "Malaweg", "Masadiit", "Muyadan", "Tingguian",
            "Tuwali", "Ata", "Bagobo", "Tagabawa", "Ubo Manuvu", "Klata", "Dibabaonon", "Manguangan", "Matigsalog", "Tagakaulo",
            "Kagan / Kalagan (Muslim)", "Maranao", "Ati", "Tausug", "Bantuanon", "Cimaron", "Molbog", "Palaw An",
            "Sibuyan Manyan Tagabukid", "Ivatan", "Ibatan", "Akeanon-Bukidnon", "Umayamnon", "Panay-Bukidnon", "Mamanwa"
        ][i],
        created_date: new Date().toISOString(),
        created_by: "00000000-0000-0000-0000-000000000000",
        last_modified_by: "",
        last_modified_date: "",
        push_status_id: 2,
        push_date: "",
        deleted_by: "",
        deleted_date: "",
        is_deleted: false,
        remarks: "Seeded"
    }))
];

export const seedYearServed: ILibYearServed[] = [
    { "id": 1, "year_served": 2022, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "year_served": 2023, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "year_served": 2024, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "year_served": 2025, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
];

export const seedProgramTypes: ILibProgramTypes[] = [
    { "id": 1, "program_type_name": "DRMB-FarmAralan", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "program_type_name": "DRMB-LAWA (Local Adaptation to Water Access)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "program_type_name": "DRMB-BINHI (Breaking Insufficiency through Nutritious Harvest for the Impoverished)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "program_type_name": "STB-Tara Basa Tutoring Program", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "program_type_name": "KC-Cash-for-Work Program for College Graduates and Students", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "program_type_name": "KC-Cash-for-Work Program for Economically Poor and Vulnerable Communities/Sectors", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },

];



export const seedLibSchoolProfiles: ILibSchoolProfiles[] = [
    {
        id: 1,
        school_name: "QUEZON CITY UNIVERSITY",
        short_name: "QCU",
        school_code: "",
        address: "",
        city_code: "",
        province_code: "",
        region_code: "",
        barangay_code: "",
        email: "",
        contact_number: "",
        school_head: "",
        school_head_position: " ",
        website_url: " ",
        established_year: 0,
        logo_url: "",
        type: "Public",
        level: "College", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    },
    {
        id: 2,
        school_name: "PARAÑAQUE CITY COLLEGE",
        short_name: "PCC",
        school_code: "",
        address: "",
        city_code: "",
        province_code: "",
        region_code: "",
        barangay_code: "",
        email: "",
        contact_number: "",
        school_head: "",
        school_head_position: " ",
        website_url: " ",
        established_year: 0,
        logo_url: "",
        type: "Public",
        level: "College", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    },
    {
        id: 3,
        school_name: "COLEGIO DE MUNTINLUPA",
        short_name: "CDM",
        school_code: "",
        address: "",
        city_code: "",
        province_code: "",
        region_code: "",
        barangay_code: "",
        email: "",
        contact_number: "",
        school_head: "",
        school_head_position: " ",
        website_url: " ",
        established_year: 0,
        logo_url: "",
        type: "Public",
        level: "College", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    },


]


export const seedLibSchoolPrograms: ILibSchoolPrograms[] = [
    { id: 1, program_name: "BACHELOR OF ARTS IN COMMUNICATION", program_code: "ABCOMM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, program_name: "BACHELOR OF ARTS IN POLITICAL SCIENCE", program_code: "ABPOLSCI", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, program_name: "BACHELOR OF ARTS MAJOR IN PSYCHOLOGY", program_code: "ABPSY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, program_name: "BACHELOR OF EARLY CHILDHOOD EDUCATION", program_code: "BECED", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 5, program_name: "BACHELOR OF ELEMENTARY EDUCATION", program_code: "BEED", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 6, program_name: "BACHELOR OF PHYSICAL EDUCATION", program_code: "BPED", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 7, program_name: "BACHELOR OF SCIENCE IN ACCOUNTANCY", program_code: "BSACCT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 8, program_name: "BACHELOR OF SCIENCE IN EARLY CHILDHOOD EDUCATION", program_code: "BSECE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 9, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS ENGINEERING", program_code: "BSECEENG", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 10, program_name: "BACHELOR OF SCIENCE IN ENTREPENEURSHIP", program_code: "BSENTREP", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 11, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL ENGINEERING", program_code: "BSIE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 12, program_name: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY", program_code: "BSIT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 13, program_name: "BACHELOR OF SCIENCE IN MANAGEMENT ACCOUNTING", program_code: "BSMA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 14, program_name: "BACHELOR OF SCIENCE IN REAL ESTATE MANAGEMENT", program_code: "BSREM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 15, program_name: "BACHELOR OF SCIENCE IN TOURISM MANAGEMENT", program_code: "BSTM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 16, program_name: "HOSPITALITY MANAGEMENT SERVICES", program_code: "HMS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 17, program_name: "BACHELOR OF SCIENCE IN ARCHITECTURE", program_code: "BSA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 18, program_name: "BACHELOR OF SCIENCE IN CIVIL ENGINEERING", program_code: "BSCE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 19, program_name: "BACHELOR OF SCIENCE IN COMPUTER ENGINEERING", program_code: "BSCE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 20, program_name: "BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING", program_code: "BSEE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 21, program_name: "BACHELOR OF SCIENCE IN ENVIRONMENT AND SANITARY ENGINEERING", program_code: "BSESE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 23, program_name: "BACHELOR OF SCIENCE IN MECHANICAL ENGINEERING", program_code: "BSME", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
];


export async function seedData() {
    try {
        await tblRoles.bulkPut(seedRoles);
        await tblModules.bulkPut(seedModules);
        await tblPermissions.bulkPut(seedPermissions);
        await tblLibModality.bulkPut(seedLibModalities);
        await tblLibModalitySubCategory.bulkPut(seedModalitySubCategory);
        await tblLibSex.bulkPut(seedLibSex);
        await tblLibCivilStatus.bulkPut(seedLibCivilStatus);
        await tblLibExtensionName.bulkPut(seedLibExtensionName);
        await tblLibSectors.bulkPut(seedLibSectors);
        await tblLibIdCard.bulkPut(seedLibIdCard);
        await tblLibEducationalAttainment.bulkPut(seedLibEducationalAttainment);
        await tblLibRelationshipToBeneficiary.bulkPut(seedLibRelationshipToBeneficiary);
        await tblLibTypeOfDisability.bulkPut(seedTypeofDisability);
        await tblLibCFWType.bulkPut(seedCFWType);
        await tblLibYearLevel.bulkPut(seedYearLevel);
        await tblLibCourses.bulkPut(seedLibCourses);
        await tblLibDeploymentArea.bulkPut(seedLibDeploymentArea);
        await tblLibTypeOfWork.bulkPut(seedLibTypeOfWork);
        await tblLibFilesToUpload.bulkPut(seedFilesToUpload);
        await tblLibIPGroup.bulkPut(seedIPGroup);
        await tblLibYearServed.bulkPut(seedYearServed);
        await tblLibProgramTypes.bulkPut(seedProgramTypes);
        await tblCFWSchedules.bulkPut(seedCFWSchedules);
        await tblCFWTimeLogs.bulkPut(seedCFWTimeLogs);
        await tblLibSchoolProfiles.bulkPut(seedLibSchoolProfiles);
        await tblLibSchoolPrograms.bulkPut(seedLibSchoolPrograms);
        return "Library seeded successfully!!!";
        // try {
        //     await dexieDb.roles.bulkPut(seedRoles);
        //     await dexieDb.modules.bulkPut(seedModules);
        //     await dexieDb.permissions.bulkPut(seedPermissions);
        //     await dexieDb.lib_modality.bulkPut(seedLibModalities);
        //     await dexieDb.lib_modality_sub_category.bulkPut(seedModalitySubCategory);
        //     await dexieDb.lib_sex.bulkPut(seedLibSex);
        //     await dexieDb.lib_civil_status.bulkPut(seedLibCivilStatus);
        //     await dexieDb.lib_extension_name.bulkPut(seedLibExtensionName);
        //     await dexieDb.lib_sectors.bulkPut(seedLibSectors);
        //     await dexieDb.lib_id_card.bulkPut(seedLibIdCard);
        //     await dexieDb.lib_educational_attainment.bulkPut(seedLibEducationalAttainment);
        //     await dexieDb.lib_relationship_to_beneficiary.bulkPut(seedLibRelationshipToBeneficiary);
        //     await dexieDb.lib_type_of_disability.bulkPut(seedTypeofDisability);
        //     await dexieDb.lib_cfw_type.bulkPut(seedCFWType);
        //     await dexieDb.lib_year_level.bulkPut(seedYearLevel);
        //     await dexieDb.lib_courses.bulkPut(seedLibCourses);
        //     await dexieDb.lib_deployment_area.bulkPut(seedLibDeploymentArea);
        //     await dexieDb.lib_type_of_work.bulkPut(seedLibTypeOfWork);
        //     await dexieDb.lib_files_to_upload.bulkPut(seedFilesToUpload);
        //     console.log("Library seeded successfully!!!");
        // } catch (error) {
        //     console.error('Transaction failed: ', error);
        //     throw error; 
        // }
    } catch (error) {
        console.error("Error library seed:", error);
        return [];
    }
}


