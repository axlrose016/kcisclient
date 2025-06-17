import { ICFWTimeLogs } from "@/components/interfaces/iuser";
import { IPersonProfile } from "@/components/interfaces/personprofile";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import axios from 'axios';
import { cloneDeep } from "lodash";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

export class ARService {


  async syncDLWorkplan(url: string, filter?: any): Promise<any> {
    try {
      const session = await getSession() as SessionPayload
      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };
      const dr = filter
        ? await axios.post<any[]>(apiUrl + url, filter, { headers })
        : await axios.get<any[]>(apiUrl + url, { headers });

      const data = dr.data;
      (data || []).forEach(element => {
        (async () => {
          const p = cloneDeep(element) as any
          console.log('syncDLWorkplan > p', p)
          console.log('syncDLWorkplan > work_plan > p', p.work_plan)
          await dexieDb.work_plan.bulkPut(p.work_plan)
          console.log('syncDLWorkplan > work_plan_tasks > p', p.work_plan_task)
          await dexieDb.work_plan_tasks.bulkPut(p.work_plan_task)
          delete p.work_plan
          delete p.work_plan_task
          await dexieDb.cfwassessment.put(p)
          // await dexieDb.transaction('rw', [dexieDb.person_profile],
          //   async () => {
          //     await dexieDb.person_profile.bulkPut(data);
          //   }
          // )
        })()
      });

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }


  async syncDLTimeLogs(url: string, filter?: any): Promise<ICFWTimeLogs[] | undefined> {
    try {
      const session = await getSession() as SessionPayload

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      const dtr = filter
        ? await axios.post<ICFWTimeLogs[]>(apiUrl + url, filter, { headers })
        : await axios.get<ICFWTimeLogs[]>(apiUrl + url, { headers });

      const data = dtr.data;
      await dexieDb.transaction('rw', [dexieDb.cfwtimelogs],
        async () => {
          await dexieDb.cfwtimelogs.bulkPut(data);
        }
      )

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }

  async syncDLProfile(url: string, filter?: any): Promise<IPersonProfile[] | undefined> {
    try {
      const session = await getSession() as SessionPayload
      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };
      const dr = filter
        ? await axios.post<IPersonProfile[]>(apiUrl + url, filter, { headers })
        : await axios.get<IPersonProfile[]>(apiUrl + url, { headers });

      const data = dr.data;
      await dexieDb.transaction('rw', [dexieDb.person_profile],
        async () => {
          await dexieDb.person_profile.bulkPut(data);
        }
      )

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }

}
