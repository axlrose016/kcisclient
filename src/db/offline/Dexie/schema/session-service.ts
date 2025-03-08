import { v4 as uuidv4 } from 'uuid';
import { sessionDb } from '../sessionDb';

//SAVE SESSION TO SESSION DB
export async function SaveSession(session: string, expiresAt: string){
    await sessionDb.open();
    debugger;
    sessionDb.transaction('rw', [sessionDb.sessions], async () => {
      try{
        const _session = {
          id: uuidv4(),
          session: session.toString(),
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt
        }
        await sessionDb.sessions.put(_session);
      } catch (error) {
          console.error('Transaction failed: ', error);
          throw error; 
      }
    })
}