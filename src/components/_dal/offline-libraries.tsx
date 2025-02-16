import { getDb } from "@/db/offline/sqlJsInit";
import { modules, permissions, roles } from "@/db/schema/libraries";
import { cache } from "react";
const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchOfflineLibrary = cache(async (endpoint: string, errorMessage: string, offline_table: any = null) => {
    const drizzleDb = await getDb(); // Get the initialized DB
    console.log("SQLDB: ", drizzleDb);
    try{
        const response = await fetch(api_base_url + endpoint);
        if(!response.ok){
            if(offline_table){
                const offlineData = await drizzleDb.select().from(offline_table).all();
                return offlineData;
            }else{
                throw new Error(errorMessage);
            }
        }
        return await response.json();
    } catch(error){
        if(offline_table){
            const offlineData = await drizzleDb.select().from(offline_table).all();
            return offlineData;
        }else{
            throw new Error(errorMessage);
        }
    }
});

const createFetchOfflineLibrary = (endpoint: string, errorMessage: string, offline_table?: any) => {
    return async () => fetchOfflineLibrary(endpoint, errorMessage, offline_table);
}

export const fetchOfflineRoles = createFetchOfflineLibrary("/api/roles/","Failed to fetch Offline Data: Roles",roles);
export const fetchOfflineModules = createFetchOfflineLibrary("/api/modules/","Failed to fetch Offline Data: Modules", modules);
export const fetchOfflinePermissions = createFetchOfflineLibrary("/api/permissions/", "Failed to fetch Offline Data: Permissions", permissions);