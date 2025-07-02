import { IAttachments } from '@/components/interfaces/general/attachments';
import { IAccomplishmentReport, IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector } from '@/components/interfaces/personprofile';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import axios from 'axios';
import LoginService from "@/components/services/LoginService";
import { cloneDeep, forEach } from 'lodash';
import { ICFWPayrollBene, ISubmissionLog } from '../interfaces/cfw-payroll';
import { ICFWTimeLogs } from '../interfaces/iuser';
const _session = await getSession() as SessionPayload;

class PersonProfileService {
  // private apiUrl = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;
  // private apiUrlDisabilities = 'https://kcnfms.dswd.gov.ph/api/person_profile_disability/create/'
  // private apiUrlSectors = 'https://kcnfms.dswd.gov.ph/api/person_profile_sector/create/'
  // private apiUrlFamilyComposition = 'https://kcnfms.dswd.gov.ph/api/person_profile_family_composition/create/'
  // private apiUrlProgramDetails = 'https://kcnfms.dswd.gov.ph/api/person_profile_engagement_history/create/'
  // private apiUrlCFWAssessment = 'https://kcnfms.dswd.gov.ph/api/cfw_assessment/create/'
  // private apiUrlCFWAssessmentPatch = 'https://kcnfms.dswd.gov.ph/api/cfw_assessment/status/patch/'
  private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile/create/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;
  private apiUrlDisabilities = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_disability/create/'
  private apiUrlSectors = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_sector/create/'
  private apiUrlFamilyComposition = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_family_composition/create/'
  private apiUrlProgramDetails = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_engagement_history/create/'
  private apiUrlCFWAssessment = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'cfw_assessment/create/'
  private apiUrlCFWAssessmentPatch = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'cfw_assessment/status/patch/'
  // Method to sync data in bulk
  async syncBulkData(formPersonProfile?: IPersonProfile): Promise<{ success: number; failed: number }> {
    try {
      const unsyncedData = await dexieDb.person_profile
        .where("push_status_id")
        .equals(2)
        .toArray();

      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }

      const results = await Promise.allSettled(
        unsyncedData.map((record) => {

          const formattedDate = new Date(record.created_date).toISOString().split("T")[0];

          const formattedRecord = {
            ...record,
            created_date: formattedDate,
          };

          console.log("Record", JSON.stringify(formattedRecord));

          console.log("Syncing record:", formattedRecord);

          return axios.post(this.apiUrl, formattedRecord, {
            headers: {
              Authorization: `bearer ${_session.token}`,
              "Content-Type": "application/json",
            },
          });
        })
      );

      let success = 0;
      let failed = 0;

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const record = unsyncedData[i];

        if (result.status === "fulfilled") {
          success++;
          // mark as synced
          await dexieDb.person_profile.update(record.id, { push_status_id: 1 });
        } else {
          failed++;
          console.error("Failed to sync record:", record.id, result.reason);
        }
      }

      return { success, failed };
    } catch (error) {
      console.error("Error syncing bulk data:", error);
      throw error;
    }
  }

  async syncBulkDisabilities(): Promise<{ success: number; failed: number }> {
    const unsyncedData = await dexieDb.person_profile_disability
      .where("push_status_id")
      .equals(2)
      .toArray();

    try {
      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }

      // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));

      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));

      // Send in bulk
      const response = await axios.post(this.apiUrlDisabilities, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      });

      // If backend responds with success
      if (response.status === 200 || response.status === 201) {
        // mark all as synced
        const updatePromises = unsyncedData.map((record) =>
          dexieDb.person_profile_disability.update(record.id, { push_status_id: 1 })
        );
        await Promise.all(updatePromises);

        return { success: unsyncedData.length, failed: 0 };
      } else {
        console.error("Unexpected response:", response.status, response.data);
        return { success: 0, failed: unsyncedData.length };
      }
    } catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }

  async syncBulkSectors(): Promise<{ success: number; failed: number }> {
    const unsyncedData = await dexieDb.person_profile_sector
      .where("push_status_id")
      .equals(2)
      .toArray();

    try {
      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }

      // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));

      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));

      const response = await axios.post(this.apiUrlSectors, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200 || response.status === 201) {
        const updatePromises = unsyncedData.map((record) =>
          dexieDb.person_profile_sector.update(record.id, { push_status_id: 1 })
        );
        await Promise.all(updatePromises);

        return { success: unsyncedData.length, failed: 0 };
      } else {
        console.error("Unexpected response:", response.status, response.data);
        return { success: 0, failed: unsyncedData.length };
      }
    }
    catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }

  async syncBulkFamilyComposition(): Promise<{ success: number; failed: number }> {
    const unsyncedData = await dexieDb.person_profile_family_composition
      .where("push_status_id")
      .equals(2)
      .toArray();

    try {
      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }

      // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));

      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));

      const response = await axios.post(this.apiUrlFamilyComposition, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200 || response.status === 201) {
        const updatePromises = unsyncedData.map((record) =>
          dexieDb.person_profile_family_composition.update(record.id, { push_status_id: 1 })
        );
        await Promise.all(updatePromises);

        return { success: unsyncedData.length, failed: 0 };
      } else {
        console.error("Unexpected response:", response.status, response.data);
        return { success: 0, failed: unsyncedData.length };
      }
    }
    catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }

  async syncBulkProgramDetails(): Promise<{ success: number; failed: number }> {
    const unsyncedData = await dexieDb.person_profile_cfw_fam_program_details
      .where("push_status_id")
      .equals(2)
      .toArray();
    debugger
    try {
      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }

      // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));

      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));

      const response = await axios.post(this.apiUrlProgramDetails, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200 || response.status === 201) {
        const updatePromises = unsyncedData.map((record) =>
          dexieDb.person_profile_cfw_fam_program_details.update(record.id, { push_status_id: 1 })
        );
        await Promise.all(updatePromises);

        return { success: unsyncedData.length, failed: 0 };
      } else {
        console.error("Unexpected response:", response.status, response.data);
        return { success: 0, failed: unsyncedData.length };
      }
    }
    catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }
  async syncBulkCFWAssessment(): Promise<{ success: number; failed: number }> {
    debugger;
    const unsyncedData = await dexieDb.cfwassessment
      .where("push_status_id")
      .equals(2)
      .toArray();

    try {
      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }

      // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));

      console.log("Bulk Syncing Records CFW Assessment:", JSON.stringify(formattedData));
      const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
      const response = await axios.patch(this.apiUrlCFWAssessmentPatch, formattedData, {
        headers: {
          Authorization: `bearer ${onlinePayload.token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200 || response.status === 201) {
        const updatePromises = unsyncedData.map((record) =>
          dexieDb.cfwassessment.update(record.id, { push_status_id: 1 })
        );
        await Promise.all(updatePromises);

        return { success: unsyncedData.length, failed: 0 };
      } else {
        console.error("Unexpected response:", response.status, response.data);
        return { success: 0, failed: unsyncedData.length };
      }
    }
    catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }

  async getPersonProfileById(id: string): Promise<IPersonProfile | undefined> {
    try {
      const personProfile = await dexieDb.person_profile.where('user_id').equals(id).first();
      if (!personProfile) {
        console.warn(`No person profile found with id: ${id}`);
        return undefined;
      }
      return personProfile;
    } catch (error) {
      console.error(`Error fetching person profile with id ${id}:`, error);
      return undefined;
    }
  }

  async getPersonProfileId(id: string): Promise<IPersonProfile | undefined> {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS
    try {
      let personProfile = undefined

      personProfile = await dexieDb.person_profile.where('id').equals(id).first();

      if (!personProfile) {
        console.warn(`No person profile found with id: ${id}`);
        const session = await getSession() as SessionPayload
        const headers = {
          'Authorization': `bearer ${session.token}`,
          'Content-Type': 'application/json',
        };

        const d = await axios.get<IPersonProfile>(apiUrl + 'person_profile/view/' + id + '/', { headers });
        const data = d.data;

        console.log('getPersonProfileId > data', data)

        if (data) {
          const p = cloneDeep(data) as any
          delete p.attachments
          delete p.cfw_assessment
          delete p.person_profile_cfw_fam_program_details
          delete p.person_profile_disability
          delete p.person_profile_engagement_history
          delete p.person_profile_family_composition
          delete p.person_profile_file_upload
          delete p.person_profile_sector
          await dexieDb.person_profile.put(p)
          personProfile = p
        }
      }
      return personProfile;
    } catch (error) {
      console.error(`Error fetching person profile with id ${id}:`, error);
      return undefined;
    }
  }


  async syncDLProfile(url: string, filter?: any): Promise<IPersonProfile[] | undefined> {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS
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

  async getAPIBenes(url: string, filter?: any): Promise<any[] | undefined> {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS
    try {
      const session = await getSession() as SessionPayload
      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };
      const dr = filter
        ? await axios.post<any[]>(apiUrl + url, filter, { headers })
        : await axios.get<any[]>(apiUrl + url, { headers });

      const data: any = dr.data;
      console.log(`data synced to Dexie > ${url} :`, data);
      return data.data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }

  async getBeneficiaries(id: string, session: SessionPayload): Promise<any[] | undefined> {

    const requestby = session!.userData.role;

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS
    try {
      let personProfile = undefined
      let api = undefined
      let data: IPersonProfile[] = []
      personProfile = await dexieDb.person_profile.where('id').equals(id).first();

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      if (requestby == "CFW Immediate Supervisor") {
        api = await axios.get<IPersonProfile[]>(apiUrl + `person_profile/view/by_supervisor/${id}/`, { headers });
        data = api.data;

        console.log({ p: data, })

        if (data) {
          data.forEach(item => {
            (async () => {
              console.log('getPersonProfileId > item', item)
              const p = cloneDeep(item) as any
              delete p.attachments
              delete p.cfw_assessment
              delete p.person_profile_cfw_fam_program_details
              delete p.person_profile_disability
              delete p.person_profile_engagement_history
              delete p.person_profile_family_composition
              delete p.person_profile_file_upload
              delete p.person_profile_sector
              await dexieDb.person_profile.put(p)
            })()
          })
        }
        data = await dexieDb.person_profile.where('modality_id')
          .equals(25).toArray()
      } else if (requestby == "CFW Administrator") {
        const h = {
          ...headers,
          body: JSON.stringify({
            "page_number": 1,
            "page_size": 10000
          })
        }
        api = await axios.post<IPersonProfile[]>(apiUrl + `person_profile/view/pages/`, { headers: h });
        data = api.data;
      } else {
        data = await dexieDb.person_profile.where('modality_id')
          .equals(25).toArray()
      }
      console.log('getBeneficiaries > data', data)
      return data;
    } catch (error) {
      console.error(`Error fetching person profile with id ${id}:`, error);
      return undefined;
    }
  }
  

}



export default new PersonProfileService();
