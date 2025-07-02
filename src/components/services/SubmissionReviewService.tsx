
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import axios from 'axios';
import { cloneDeep } from "lodash";
import { ICFWPayrollBene, ISubmissionLog } from "../interfaces/cfw-payroll";
import { CFWPayrollService } from "./CFWPayrollService";
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

export class SubmissionReviewService {


  async getSubmissions(id: string, session: SessionPayload): Promise<any[] | undefined> {

    const requestby = session!.userData.role;

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS
    try {
      let personProfile = undefined
      let api = undefined
      let data: any[] = []
      personProfile = await dexieDb.person_profile.where('id').equals(id).first();

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      if (["CFW Immediate Supervisor", "CFW Administrator", "Administrator"].includes(requestby!)) {
        const pb = await axios.get<ICFWPayrollBene[]>(apiUrl + `cfw_payroll_beneficiary/by_supervisor/report/${requestby == "CFW Immediate Supervisor" ? `${id}/` : ``}`, { headers });
        if (pb.status == 200 && pb.data.length !== 0) {
          pb.data.forEach(item => {
            (async () => {
              console.log('cfwpayroll_bene > item', item)
              const p = cloneDeep(item) as any
              await dexieDb.cfwpayroll_bene.put(p)
            })()
          })
        }

        const sl = await axios.get<ISubmissionLog[]>(apiUrl + `submission_logs/view/by_supervisor/${requestby == "CFW Immediate Supervisor" ? `${id}/` : ''}`, { headers });
        if (sl.status == 200 && sl.data.length !== 0) {
          sl.data.forEach(item => {
            (async () => {
              console.log('submission_log > item', item)
              const p = cloneDeep(item) as any
              await dexieDb.submission_log.put(p)
            })()
          })
        }
      } else if (requestby == "CFW Beneficiary") {
        const user = await dexieDb.person_profile.where('user_id')
          .equals(id!).first();
        const sl = await axios.get<ISubmissionLog[]>(apiUrl + `submission_logs/view/by_supervisor/${user?.id}/`, { headers });
        if (sl.status == 200 && sl.data.length !== 0) {
          sl.data.forEach(item => {
            (async () => {
              const p = cloneDeep(item) as any
              await dexieDb.submission_log.put(p)
            })()
          })
        }

        console.log('CFW Beneficiary > submission_log > item', sl, { id, user })
        const pb = await new CFWPayrollService().syncDLCFWPayrollBene(`cfw_payroll_beneficiary/view/${user?.id}/`)
        if (pb?.length !== 0) {
          console.log('CFW Beneficiary > cfwpayroll_bene > item', pb, { id, user })
        }
      }
      return data;
    } catch (error) {
      console.error(`Error fetching person profile with id ${id}:`, error);
      return undefined;
    }
  }

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
