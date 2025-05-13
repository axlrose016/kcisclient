import { ILibEmploymentStatus, ILibPosition, IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { v4 as uuidv4 } from 'uuid';

const _session = await getSession() as SessionPayload;

export class LibrariesService{
    async saveOfflineRole(role: any): Promise<any | undefined> {
        try {
            let savedItem: IRoles | undefined;
      
            await dexieDb.transaction('rw', [dexieDb.roles], async () => {
    
              let data: IRoles = role;
            
              if (role.id === "") {
                data = {
                  ...role,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session.userData.email,
                };
              } else {
                data = {
                  ...role,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session.userData.email,
                };
              }
      
              await dexieDb.roles.put(data);
              savedItem = data;
            });
      
            return savedItem;
          } catch (error) {
            console.error('Transaction failed: ', error);
            return undefined;
          }
    }
    async getOfflineRoleById(id: any): Promise<IRoles | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.roles], async () => {
            const role = await dexieDb.roles.where('id').equals(id).first();
            if (role) {
            return role;
            } else {
            console.log('No record found with the given ID.');
            return undefined;
            }
        });
        return result;
        } catch (error) {
        console.error('Fetch Record Failed: ', error);
        return undefined;
        }
    }
    async getOfflineRoles(): Promise<IRoles[]> {
        try {
            const result = await dexieDb.transaction('r', [dexieDb.roles], async () => {
            const roles = await dexieDb.roles.toArray();
            return roles;
            });
            return result;
        } catch (error) {
            console.error('Fetch Records Failed: ', error);
            return [];
        }
    }
    async saveOfflinePermission(permission: any): Promise<any | undefined> {
        try {
            let savedItem: IPermissions | undefined;
      
            await dexieDb.transaction('rw', [dexieDb.permissions], async () => {
    
              let data: IPermissions = permission;
            
              if (permission.id === "") {
                data = {
                  ...permission,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session.userData.email,
                };
              } else {
                data = {
                  ...permission,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session.userData.email,
                };
              }
      
              await dexieDb.permissions.put(data);
              savedItem = data;
            });
      
            return savedItem;
          } catch (error) {
            console.error('Transaction failed: ', error);
            return undefined;
          }
    }
    async getOfflinePermissionById(id: any): Promise<IPermissions | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.permissions], async () => {
            const permission = await dexieDb.permissions.where('id').equals(id).first();
            if (permission) {
            return permission;
            } else {
            console.log('No record found with the given ID.');
            return undefined;
            }
        });
        return result;
        } catch (error) {
        console.error('Fetch Record Failed: ', error);
        return undefined;
        }
    }
    async getOfflinePermissions(): Promise<IPermissions[]> {
        try {
            const result = await dexieDb.transaction('r', [dexieDb.permissions], async () => {
            const permissions = await dexieDb.permissions.toArray();
            return permissions;
            });
            return result;
        } catch (error) {
            console.error('Fetch Records Failed: ', error);
            return [];
        }
    }
    async saveOfflineModule(module: any): Promise<any | undefined> {
        try {
            let savedItem: IModules | undefined;
      
            await dexieDb.transaction('rw', [dexieDb.modules], async () => {
    
              let data: IModules = module;
            
              if (module.id === "") {
                data = {
                  ...module,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session.userData.email,
                };
              } else {
                data = {
                  ...module,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session.userData.email,
                };
              }
      
              await dexieDb.modules.put(data);
              savedItem = data;
            });
      
            return savedItem;
          } catch (error) {
            console.error('Transaction failed: ', error);
            return undefined;
          }
    }
    async getOfflineModuleById(id: any): Promise<IModules | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.modules], async () => {
            const module = await dexieDb.modules.where('id').equals(id).first();
            if (module) {
            return module;
            } else {
            console.log('No record found with the given ID.');
            return undefined;
            }
        });
        return result;
        } catch (error) {
        console.error('Fetch Record Failed: ', error);
        return undefined;
        }
    }
    async getOfflineModules(): Promise<IModules[]> {
        try {
            const result = await dexieDb.transaction('r', [dexieDb.modules], async () => {
            const modules = await dexieDb.modules.toArray();
            return modules;
            });
            return result;
        } catch (error) {
            console.error('Fetch Records Failed: ', error);
            return [];
        }
    }
    
    //HR Libraries
    async getOfflineLibEmploymentStatus(): Promise<ILibEmploymentStatus[]> {
        try {
            await libDb.open();
            const result = await libDb.transaction('r', [libDb.lib_employment_status], async () => {
                const employment_status = await libDb.lib_employment_status.toArray();
                return employment_status;
            });
            return result;
        } catch (error) {
        console.error('Fetch Records Failed: ', error);
        return [];
        }
    }
    async getOfflineLibPosition(): Promise<ILibPosition[]>{
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_position], async () => {
          const positions = await libDb.lib_position.toArray();
          return positions;
        });
        return result;
      }catch(error){
        console.error('Fetch Records Failed: ', error);
        return [];
      }
    }
    async getOfflineLibEmploymentStatusById(id:number): Promise<ILibEmploymentStatus | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_employment_status], async () => {
            const employment_status = await libDb.lib_employment_status.where('id').equals(id).first();
            if(employment_status){
              return employment_status;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async getOfflineLibPositionById(id:number): Promise<ILibPosition | undefined>{
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_position], async () => {
          const position = await libDb.lib_position.where('id').equals(id).first();
          if(position){
            return position;
          }else{
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineEmploymentStatus(emp: any): Promise<any | undefined>{
      try{
        let savedItem: ILibEmploymentStatus | undefined;

        await libDb.transaction('rw',[libDb.lib_employment_status], async () => {
          let data: ILibEmploymentStatus = emp;

          if(!emp.id || emp.id === ""){
            data = {
              ...emp,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            data = {
              ...emp,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_employment_status.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflinePosition(pos: any): Promise<any | undefined>{
      try{
        let savedItem: ILibPosition | undefined;
        await libDb.transaction('rw', [libDb.lib_position], async () => {
          let data: ILibPosition = pos;

          if(!pos.id || pos.id === ""){
            data = {
              ...pos,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            data = {
              ...pos, 
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_position.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
  }