import { EntityTable } from "dexie";
import { kcisDb } from "../dexieDb";
import { IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";

const tblRoles = kcisDb.table('roles') as EntityTable<IRoles, 'id'>;
const tblModules = kcisDb.table('modules') as EntityTable<IModules, 'id'>;
const tblPermissions = kcisDb.table('permissions') as EntityTable<IPermissions, 'id'>;


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

export async function seedData() {
    try {
        await tblRoles.bulkPut(seedRoles);
        await tblModules.bulkPut(seedModules);
        await tblPermissions.bulkPut(seedPermissions);
        return "Library seeded successfully!!!";
    } catch (error) {
        console.error("Error library seed:", error);
        return [];
    }
}


