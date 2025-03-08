import { EntityTable } from "dexie";
import { dexieDb } from "../dexieDb";
import { ILibCFWType, ILibCivilStatus, ILibCourses, ILibDeploymentArea, ILibEducationalAttainment, ILibExtensionName, ILibFilesToUpload, ILibIdCard, ILibModality, ILibModalitySubCategory, ILibRelationshipToBeneficiary, ILibSectors, ILibSex, ILibTypeOfDisability, ILibTypeOfWork, ILibYearLevel, IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";

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
const tblLibCourses = dexieDb.table('lib_courses') as EntityTable<ILibCourses,'id'>;
const tblLibDeploymentArea = dexieDb.table('lib_deployment_area') as EntityTable<ILibDeploymentArea, 'id'>;
const tblLibTypeOfWork = dexieDb.table('lib_type_of_work') as EntityTable<ILibTypeOfWork,'id'>;
const tblLibFilesToUpload = dexieDb.table('lib_files_to_upload') as EntityTable<ILibFilesToUpload, 'id'>;

//Roles Service
export async function addRole(role: IRoles){
    try{
        return await tblRoles.add(role);
    }catch(error){
        return null;
    }
}
export async function bulkAddRole(roles: IRoles[]){
    try{
        return await tblRoles.bulkAdd(roles);
    }catch(error){
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
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    },
    {
        "id": "cae2b943-9b80-45ea-af2a-823730f288ac",
        "role_description": "Guest",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    },
    {
        "id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
        "role_description": "Finance",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    },
    {
        "id": "1c99504f-ad53-4151-9a88-52e0cffdbb6d",
        "role_description": "Engineer",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    },
    {
        "id": "37544f59-f3ba-45df-ae0b-c8fa4e4ce446",
        "role_description": "CFW",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    }
]

//Modules Service
export async function addModule(module: IModules){
    try{
        return await tblModules.add(module);
    }catch(error){
        return null;
    }
}
export async function bulkAddModule(modules: IModules[]){
    try{
        return await tblModules.bulkAdd(modules);
    }catch(error){
        return null;
    }
}
export async function getModules(){
    try{
        return await tblModules.toArray();
    }catch(error){
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
    "push_status_id":2,
    "push_date":"",
    "deleted_by":"",
    "deleted_date":"",
    "is_deleted":false,
    "remarks":"Seeded"
    },
    {
    "id": "4e658b02-705a-43eb-a051-681d54e22e2a",
    "module_description": "Person Profile",
    "module_path": "personprofile",
    "created_by": "00000000-0000-0000-0000-000000000000",
    "created_date": new Date().toISOString(),
    "last_modified_by": "",
    "last_modified_date": "",
    "push_status_id":2,
    "push_date":"",
    "deleted_by":"",
    "deleted_date":"",
    "is_deleted":false,
    "remarks":"Seeded"
    },
    {
    "id": "19a18164-3a26-4ec3-ac6d-755df1d3b980",
    "module_description": "Finance",
    "module_path": "finance",
    "created_by": "00000000-0000-0000-0000-000000000000",
    "created_date": new Date().toISOString(),
    "last_modified_by": "",
    "last_modified_date": "",
    "push_status_id":2,
    "push_date":"",
    "deleted_by":"",
    "deleted_date":"",
    "is_deleted":false,
    "remarks":"Seeded"
    },
    {
    "id": "78ac69e0-19b6-40d0-8b07-135df9152bd8",
    "module_description": "Procurement",
    "module_path": "procurement",
    "created_by": "00000000-0000-0000-0000-000000000000",
    "created_date": new Date().toISOString(),
    "last_modified_by": "",
    "last_modified_date": "",
    "push_status_id":2,
    "push_date":"",
    "deleted_by":"",
    "deleted_date":"",
    "is_deleted":false,
    "remarks":"Seeded"
    },
    {
    "id": "ce67be45-b5aa-4272-bcf4-a32abc9d7068",
    "module_description": "Engineering",
    "module_path": "engineering",
    "created_by": "00000000-0000-0000-0000-000000000000",
    "created_date": new Date().toISOString(),
    "last_modified_by": "",
    "last_modified_date": "",
    "push_status_id":2,
    "push_date":"",
    "deleted_by":"",
    "deleted_date":"",
    "is_deleted":false,
    "remarks":"Seeded"
    },
    {
    "id": "866e6bcb-041f-4d58-94bf-6c54e4855f85",
    "module_description": "Settings",
    "module_path": "settings",
    "created_by": "00000000-0000-0000-0000-000000000000",
    "created_date": new Date().toISOString(),
    "last_modified_by": "",
    "last_modified_date": "",
    "push_status_id":2,
    "push_date":"",
    "deleted_by":"",
    "deleted_date":"",
    "is_deleted":false,
    "remarks":"Seeded"
    }
]

//Permissions Service
export async function addPermission(permission: IPermissions){
    try{
        return await tblPermissions.add(permission);
    }catch(error){
        return null;
    }
}
export async function bulkAddPermission(permissions: IPermissions[]){
    try{
        return await tblPermissions.bulkAdd(permissions);
    }catch(error){
        return null;
    }
}
export async function getPermissions(){
    try{
        return await tblPermissions.toArray();
    }catch(error){
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
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    },
    {
        "id": "98747f00-76e5-497d-beac-ba4255db066f",
        "permission_description": "Can Update",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    },
    {
        "id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
        "permission_description": "Can Delete",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded"
    }
]

//Modality Service
export async function addModality(modality: ILibModality){
    try{
        return await tblLibModality.add(modality);
    }catch(error){
        return null;
    }
}
export async function bulkAddModality(modalities: ILibModality[]){
    try{
        return await tblLibModality.bulkAdd(modalities);
    }catch(error){
        return null;
    }
}
export async function getModalities(){
    try{
        return await tblLibModality.toArray();
    }catch(error){
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
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 2,
        "modality_name": "PAMANA (2016 and earlier)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 3,
        "modality_name": "MCC",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 4,
        "modality_name": "AF (Old)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 5,
        "modality_name": "AUSAid",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 6,
        "modality_name": "PODER",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 7,
        "modality_name": "NCDDP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 8,
        "modality_name": "BUB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 9,
        "modality_name": "JFPR",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 10,
        "modality_name": "DFAT",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 11,
        "modality_name": "GIG",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 12,
        "modality_name": "CCL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 13,
        "modality_name": "GOP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 14,
        "modality_name": "L&E",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 15,
        "modality_name": "IP-CDD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 16,
        "modality_name": "MAKILAHOK",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 17,
        "modality_name": "KKB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 18,
        "modality_name": "KSB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 19,
        "modality_name": "PAMANA (2020 onwards)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 20,
        "modality_name": "KKB 2020",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 21,
        "modality_name": "NCDDP-AF",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 22,
        "modality_name": "PMNP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 23,
        "modality_name": "KKB-CDD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 24,
        "modality_name": "PAG-ABOT",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    },
    {
        "id": 25,
        "modality_name": "CFW",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
        "is_active": true
    }
]
export const seedModalitySubCategory: ILibModalitySubCategory[] = [
    { 
        "id": 1, 
        "modality_id": 25, 
        "modality_sub_category_name": "CFW - SUC",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    { 
        "id": 2, 
        "modality_id": 25, 
        "modality_sub_category_name": "CFW - PWD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
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
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    { 
        "id": 2, 
        "sex_description": "Male",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
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
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 2, 
        "civil_status_description": "Legally Separated",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 3, 
        "civil_status_description": "Married",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 4, 
        "civil_status_description": "Single",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 5, 
        "civil_status_description": "Widowed",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
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
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 2, 
        "extension_name": "Sr.",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 3, 
        "extension_name": "II",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 4, 
        "extension_name": "III",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 5, 
        "extension_name": "IV",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
]
export const seedLibSectors: ILibSectors[] = [
    {
        "id": 1, 
        "sector_name": "Women",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 2, 
        "sector_name": "Out of School Youth (OSY)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 3, 
        "sector_name": "Persons with Disabilities (PWD)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 4, 
        "sector_name": "Indigenous People",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 5, 
        "sector_name": "Indigenous People",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 6, 
        "sector_name": "Senior Citizen",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 7, 
        "sector_name": "Solo Parent",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 8, 
        "sector_name": "Affected by Disaster",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 9, 
        "sector_name": "Children and Youth in Need of Special Protection",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
]
export const seedLibIdCard: ILibIdCard[] = [
    {
        "id": 1, 
        "id_card_name": "National ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 2, 
        "id_card_name": "Passport",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 3, 
        "id_card_name": "Driver's License",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 4, 
        "id_card_name": "SSS ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 5, 
        "id_card_name": "GSIS ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 6, 
        "id_card_name": "PRC ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 7, 
        "id_card_name": "Philhealth ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 8, 
        "id_card_name": "Voter's ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 9, 
        "id_card_name": "Senior Citizen ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 10, 
        "id_card_name": "PWD ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
]
export const seedLibEducationalAttainment: ILibEducationalAttainment[] = [
    {
        "id": 1, 
        "educational_attainment_description": "College Graduate",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 2, 
        "educational_attainment_description": "College Level",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 3, 
        "educational_attainment_description": "Doctorate Level",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 4, 
        "educational_attainment_description": "Elementary Graduate",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 5, 
        "educational_attainment_description": "Elementary Level",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 6, 
        "educational_attainment_description": "Highschool Graduate",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 7, 
        "educational_attainment_description": "Highschool Level",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 8, 
        "educational_attainment_description": "Master Degree Graduate",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 9, 
        "educational_attainment_description": "No Formal Education",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 10, 
        "educational_attainment_description": "With Units in Masteral Degree",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
    {
        "id": 11, 
        "educational_attainment_description": "Vocational",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000", 
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id":2,
        "push_date":"",
        "deleted_by":"",
        "deleted_date":"",
        "is_deleted":false,
        "remarks":"Seeded",
    },
]
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
export const seedCFWType:ILibCFWType[] = [
    { "id": 1, "cfw_type_name": "CFW for Disaster", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "cfw_type_name": "Tara Basa", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
];
export const seedYearLevel: ILibYearLevel[] = [
    { "id": 1, "year_level_name": "First Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "year_level_name": "Second Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "year_level_name": "Third Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "year_level_name": "Fourth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "year_level_name": "Fifth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "year_level_name": "More than Fifth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedLibCourses: ILibCourses[] = [
    {
        "id": 1,
        "course_code": "BSIT",
        "course_name": "Bachelor of Science in Information Technology",
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
        "id": 2,
        "course_code": "BSTM",
        "course_name": "Bachelor of Science in Tourism Management",
        "course_description": "A program designed to prepare students for careers in the tourism industry, including hospitality, travel services, and event management.",
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
        "course_code": "BSBA",
        "course_name": "Bachelor of Science in Business Administration",
        "course_description": "Focuses on business management, marketing, finance, and entrepreneurship.",
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
        "course_code": "BSN",
        "course_name": "Bachelor of Science in Nursing",
        "course_description": "A program that trains students to become professional nurses with a focus on healthcare and patient care.",
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
    { "id": 1, "deployment_name": "Metro Manila", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "deployment_name": "Central Visayas", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "deployment_name": "Northern Mindanao", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "deployment_name": "CALABARZON", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedLibTypeOfWork: ILibTypeOfWork[] = [
    { "id": 1, "work_name": "Office Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "work_name": "Field Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "work_name": "Clerical Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedFilesToUpload: ILibFilesToUpload[] = [
    { "id": 1, "file_name": "Primary ID", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "file_name": "Secondary ID", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "file_name": "PWD ID", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "file_name": "School ID", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "file_name": "Certificate of Registration from School", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "file_name": "TOR/Diploma/Certification from the School Registrar", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "file_name": "Certificate of Indigency", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "file_name": "1x1 Picture", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "file_name": "Display Picture", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
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
        return "Library seeded successfully!!!";
    } catch (error) {
        console.error("Error library seed:", error);
        return [];
    }
}


