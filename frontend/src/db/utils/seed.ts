import { modules, permissions, roles } from "../schema/libraries";
import { upsertData } from "./offline_crud";

export async function seed(db: any) {
    try{
        const _roles = [
            {
            "id": "d4003a01-36c6-47af-aae5-13d3f04e110f",
            "role_description": "Administrator",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "cae2b943-9b80-45ea-af2a-823730f288ac",
            "role_description": "Guest",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
            "role_description": "Finance",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "1c99504f-ad53-4151-9a88-52e0cffdbb6d",
            "role_description": "Engineer",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "37544f59-f3ba-45df-ae0b-c8fa4e4ce446",
            "role_description": "CFW",
            "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ]
        const _permissions = [
            {
            "id": "f38252b5-cc46-4cc1-8353-a49a78708739",
            "permission_description": "Can Add",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "98747f00-76e5-497d-beac-ba4255db066f",
            "permission_description": "Can Update",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
            "permission_description": "Can Delete",
            "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ]
        const _modules = [
            {
            "id": "9bb8ab82-1439-431d-b1c4-20630259157a",
            "module_description": "Sub-Project",
            "module_path": "subproject",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "4e658b02-705a-43eb-a051-681d54e22e2a",
            "module_description": "Person Profile",
            "module_path": "personprofile",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "19a18164-3a26-4ec3-ac6d-755df1d3b980",
            "module_description": "Finance",
            "module_path": "finance",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "78ac69e0-19b6-40d0-8b07-135df9152bd8",
            "module_description": "Procurement",
            "module_path": "procurement",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "ce67be45-b5aa-4272-bcf4-a32abc9d7068",
            "module_description": "Engineering",
            "module_path": "engineering",
            "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ]
        const result = await db.transaction(async (trx: any) => {
            await upsertData(trx, roles, _roles);
            await upsertData(trx, permissions, _permissions);
            await upsertData(trx, modules, _modules);
        })
        return { success: true, message: "Library successfully updated!", result };
    }
    catch(error){
        console.error("Failed to seed library:", error);
        return { success: false, message: "Failed to seed library.", error: error };
    }
}
