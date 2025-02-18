import  { EntityTable } from 'dexie';
import { dexieDb } from '../dexieDb'; // Assuming dexieDb is properly initialized elsewhere
import { IUser, IUserAccess } from '@/components/interfaces/iuser';
import { toast } from '@/hooks/use-toast';
import { hashPassword } from '@/lib/utils';

// Ensure you're using a single instance for interacting with the users table
const tblUsers = dexieDb.table('users') as EntityTable<IUser, 'id'>;
const tblUserAccess = dexieDb.table('useraccess') as EntityTable<IUserAccess, 'id'>;

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
    dexieDb.transaction('rw', [tblUsers, tblUserAccess], async () => {
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


