import { IUser, IUserAccess } from "@/components/interfaces/iuser";
import { IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { v4 as uuidv4 } from 'uuid';

const _session = await getSession() as SessionPayload;

export class UserService{
    async saveOfflineUser(user: any): Promise<any | undefined> {
        try {
            let savedItem: IUser | undefined;
    
            await dexieDb.transaction('rw', [dexieDb.users], async () => {
    
              let data: IUser = user;
             
              if (user.id === "") {
                data = {
                  ...user,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session.userData.email,
                };
              } else {
                data = {
                  ...user,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session.userData.email,
                };
              }
    
              await dexieDb.users.put(data);
              savedItem = data;
            });
    
            return savedItem;
          } catch (error) {
            console.error('Transaction failed: ', error);
            return undefined;
          }
    }
    async getOfflineUserById(id: any): Promise<IUser | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.users], async () => {
            const user = await dexieDb.users.where('id').equals(id).first();
            if (user) {
            return user;
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
    async getOfflineUserAccessById(id: any): Promise<IUserAccess[] | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.useraccess], async () => {
            const userAccess = await dexieDb.useraccess.where('user_id').equals(id).toArray();
            if (userAccess) {
            return userAccess;
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
}