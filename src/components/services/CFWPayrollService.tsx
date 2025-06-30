
import axios from 'axios';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { ICFWPayrollBene, ISubmissionLog } from '../interfaces/cfw-payroll';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';

export class CFWPayrollService {
  private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

  async syncDLCFWPayrollReady(url: string, filter?: any): Promise<ICFWPayrollBene[] | any | undefined> {
    try {
      const session = await getSession() as SessionPayload

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      const raw = filter
        ? await axios.post<ICFWPayrollBene[] | any>(this.apiUrl + url, filter, { headers })
        : await axios.get<ICFWPayrollBene[] | any>(this.apiUrl + url, { headers });

      const data = raw.data;
      await dexieDb.cfwpayroll_bene.bulkPut(data)

      console.log(`data synced to Dexie : syncDLCFWPayrollReady> ${url} :`, data.length);
      return data
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }


  async syncDLCFWPayrollBene(url: string, filter?: any): Promise<ICFWPayrollBene[] | undefined> {
    try {
      const session = await getSession() as SessionPayload

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      const dtr = filter
        ? await axios.post<ICFWPayrollBene[]>(this.apiUrl + url, filter, { headers })
        : await axios.get<ICFWPayrollBene[]>(this.apiUrl + url, { headers });

      const data = dtr.data;


      console.log('syncDLCFWPayrollBene > data', data)
      await dexieDb.transaction('rw', [dexieDb.cfwpayroll_bene],
        async () => {
          await dexieDb.cfwpayroll_bene.bulkPut(data);
        }
      )

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return await dexieDb.cfwpayroll_bene.toArray();
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }
}
