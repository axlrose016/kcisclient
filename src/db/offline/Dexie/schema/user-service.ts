import Dexie, { EntityTable } from 'dexie';
import { dexieDb } from '../dexieDb'; // Assuming dexieDb is properly initialized elsewhere
import { IUser } from '@/components/interfaces/iuser';
import { useLiveQuery } from 'dexie-react-hooks';

// Ensure you're using a single instance for interacting with the users table
const usersTbl = dexieDb.table('users') as EntityTable<IUser, 'id'>;

// Add user function
async function addUser(user: IUser) {
  try {
    return await usersTbl.add(user);
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
}

// Function to get the list of users
async function getUsers() {
    try {
      const users = await usersTbl.toArray(); // Returns all users in the table
      console.log('Users:', users);
      return users;
    } catch (error) {
      console.error('Error retrieving users:', error);
      return [];
    }
  }

export { usersTbl, addUser, getUsers };
