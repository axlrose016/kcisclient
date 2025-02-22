import  { EntityTable } from 'dexie';
import { kcisDb } from '../dexieDb'; // Assuming dexieDb is properly initialized elsewhere
import { IUser, IUserAccess, IUserData, IUserDataAccess } from '@/components/interfaces/iuser';
import { toast } from '@/hooks/use-toast';
import { hashPassword } from '@/lib/utils';

// Ensure you're using a single instance for interacting with the users table
const tblUsers = kcisDb.table('users') as EntityTable<IUser, 'id'>;
const tblUserAccess = kcisDb.table('useraccess') as EntityTable<IUserAccess, 'id'>;

// Add user function
export async function addUser(user: IUser) {
  try {
    return await tblUsers.add(user);
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
}
export async function bulkAddUser(users: IUser[]){
    try{
        return await tblUsers.bulkPut(users);
    }catch(error){
        console.error("Error adding bulk users:", error);
        return null;
    }
}
export async function trxAddUserWithAccess(user:IUser, useraccess: IUserAccess){
    try {
    kcisDb.transaction('rw', [tblUsers, tblUserAccess], async () => {
        await tblUsers.add(user);
        await tblUserAccess.add(useraccess);
    });
    } catch (error) {
        console.error("Error adding user and access:", error);
        return null;
    }
}
export async function getUsers() {
    try {
      const users = await tblUsers.toArray(); 
      console.log('Users:', users);
      return users;
    } catch (error) {
      console.error('Error retrieving users:', error);
      return [];
    }
}

export async function getUserById(id:string){
    try{
        return await tblUsers.where("id").equals(id).first();
    }catch(error){
        return null;
    }
}

export async function getUserByEmail(email:string){
    try{
        return await tblUsers.where("email").equals(email).first();
    }catch(error){
        return null;
    }
}

// Add user access
export async function addUserAccess(useraccess: IUserAccess){
    try{
        return await tblUserAccess.add(useraccess);
    }catch(error){
        console.error("Error adding user access:", error);
        return null;
    }
}
export async function bulkAddUserAccess(useraccess: IUserAccess[]){
    try{
        return await tblUserAccess.bulkPut(useraccess);
    }catch(error){
        console.error("Error adding bulk user access:", error);
        return null;
    }
}
export async function getUserAccessById(id: string) {
    try {
        const useraccess = await tblUserAccess.where('user_id').equals(id).toArray();
        console.log('User Access:', useraccess);
        return useraccess;
    } catch (error) {
        console.error('Error retrieving user access:', error);
        return [];
    }
}
export async function getUserData(id: string): Promise<IUserData | null>{
    try{
        const user = await tblUsers.get(id);
        if(user==null)
        {
            return null;
        }
        const userrole = await kcisDb.roles.where('id').equals(user.role_id).first();
        const useraccess = await tblUserAccess.where('user_id').equals(id).toArray();
        
        const userDataAccess: IUserDataAccess[] = [];
        for (const access of useraccess) {
        const module = await kcisDb.modules.where('id').equals(access.module_id).first();
        const permission = await kcisDb.permissions.where('id').equals(access.permission_id).first();

        userDataAccess.push({
            role: userrole?.role_description,  
            module: module?.module_description,
            module_path: module?.module_path,
            permission: permission?.permission_description
        });
        }
        const userData: IUserData = {
            name: user?.username,
            email: user?.email,
            photo: "",
            role: userrole?.role_description,
            userAccess: userDataAccess
        }
        return userData;
    }catch(error){
        console.log('Failed to Get User Data:', error);
        return null;
    }
}

export async function checkUserExists(email: string, username: string) {
    const isExist = await tblUsers.where('email').equals(email)
    .or('username').equals(username)
    .count() > 0;
    return isExist;
}

