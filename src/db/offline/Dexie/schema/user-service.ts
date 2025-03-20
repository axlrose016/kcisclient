import  { EntityTable } from 'dexie';
import { dexieDb } from '../databases/dexieDb'; // Assuming dexieDb is properly initialized elsewhere
import { IUser, IUserAccess, IUserData, IUserDataAccess } from '@/components/interfaces/iuser';
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
export async function getUserData(id: string): Promise<IUserData | null>{
    try{
        const user = await tblUsers.get(id);
        if(user==null)
        {
            return null;
        }
        const userrole = await dexieDb.roles.where('id').equals(user.role_id).first();
        const useraccess = await tblUserAccess.where('user_id').equals(id).toArray();
        
        const userDataAccess: IUserDataAccess[] = [];
        for (const access of useraccess) {
        const module = await dexieDb.modules.where('id').equals(access.module_id).first();
        const permission = await dexieDb.permissions.where('id').equals(access.permission_id).first();

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




const saltObj = {
    "0": 86,
    "1": 57,
    "2": 55,
    "3": 56,
    "4": 50,
    "5": 43,
    "6": 121,
    "7": 200,
    "8": 151,
    "9": 255,
    "10": 140,
    "11": 219,
    "12": 85,
    "13": 63,
    "14": 158,
    "15": 105
}
const saltArray = new Uint8Array(Object.values(saltObj));

export const seedUser: IUser[] = [
    {
        "id": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "username": "axlrose016",
        "email": "axlrose.villanueva.0416@gmail.com",
        "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
        "salt": Array.from(saltArray ),
        "role_id": "d4003a01-36c6-47af-aae5-13d3f04e110f",
        "created_date": "2025-03-11T06:18:58.077Z",
        "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "last_modified_date": "",
        "last_modified_by": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_date": "",
        "deleted_by": "",
        "is_deleted": false,
        "remarks": ""
    }
];

export const seedUserAccess: IUserAccess[] = [
    {
        "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "created_date": "2025-03-11T06:18:58.077Z",
        "deleted_by": "",
        "deleted_date": "",
        "id": "c4976bbd-8d88-48b2-80eb-e62d9ebaf144",
        "is_deleted": false,
        "last_modified_by": "",
        "last_modified_date": "",
        "module_id": "4e658b02-705a-43eb-a051-681d54e22e2a",
        "permission_id": "f38252b5-cc46-4cc1-8353-a49a78708739",
        "push_date": "",
        "push_status_id": 2,
        "remarks": "",
        "user_id": "78636dd9-bca4-46d1-b6aa-75168e7009f1"
    },
    {
        "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "created_date": "2025-03-11T06:18:58.077Z",
        "deleted_by": "",
        "deleted_date": "",
        "id": "b666b58c-b47e-450b-a21e-71951854b7b7",
        "is_deleted": false,
        "last_modified_by": "",
        "last_modified_date": "",
        "module_id": "9bb8ab82-1439-431d-b1c4-20630259157a",
        "permission_id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
        "push_date": "",
        "push_status_id": 2,
        "remarks": "",
        "user_id": "78636dd9-bca4-46d1-b6aa-75168e7009f1"
    },
    {
        "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "created_date": "2025-03-11T06:18:58.077Z",
        "deleted_by": "",
        "deleted_date": "",
        "id": "3f7fd931-6c08-4706-9847-f5c7bf663807",
        "is_deleted": false,
        "last_modified_by": "",
        "last_modified_date": "",
        "module_id": "866e6bcb-041f-4d58-94bf-6c54e4855f85",
        "permission_id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
        "push_date": "",
        "push_status_id": 2,
        "remarks": "",
        "user_id": "78636dd9-bca4-46d1-b6aa-75168e7009f1"
    }

];



export async function seedUserData() {
    try {
        await tblUsers.bulkPut(seedUser);
        await tblUserAccess.bulkPut(seedUserAccess);
        
        return "User and User Access seeded successfully!!!";
    } catch (error) {
        console.error("Error User seed:", error);
        return [];
    }
}