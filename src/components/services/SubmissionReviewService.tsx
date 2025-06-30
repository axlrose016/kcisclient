 
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import axios from 'axios';
import { cloneDeep } from "lodash";  
import { ISubmissionLog } from "../interfaces/cfw-payroll";
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

export class SubmissionReviewService {


  async syncDLSReviewLogs(url: string, filter?: any): Promise<ISubmissionLog[] | undefined> {
    try {
      const session = await getSession() as SessionPayload

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      const dtr = filter
        ? await axios.post<ISubmissionLog[]>(apiUrl + url, filter, { headers })
        : await axios.get<ISubmissionLog[]>(apiUrl + url, { headers });

      const data = dtr.data;

      for (const item of data) {
        const p = cloneDeep(item) as any
        await dexieDb.submission_log.put(p)
      }

      console.log('syncDLSReviewLogs > data', data)
      // await dexieDb.transaction('rw', [dexieDb.accomplishment_report],
      //   async () => {
      //     await dexieDb.accomplishment_report.bulkPut(data);
      //   }
      // )

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return await dexieDb.submission_log.toArray();
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  } 
}
