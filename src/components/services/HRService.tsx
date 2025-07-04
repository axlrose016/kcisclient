import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { hrDb } from "@/db/offline/Dexie/databases/hrDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { IApplicant, IHiringProcedure, IPositionItem, IPositionItemDistribution } from "@/db/offline/Dexie/schema/hr-service";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

const _session = await getSession() as SessionPayload;

export class HRService {
    async getOfflinePositionItemById(id: any): Promise<IPositionItem | undefined> {
      try {
        const result = await hrDb.transaction('r', [hrDb.position_item], async () => {
          const positionItem = await hrDb.position_item.where('id').equals(id).first();
          if (positionItem) {
            return positionItem;
          } else {
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      } catch (error) {
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }

    async getOfflinePositionDistributionById(id: any): Promise<IPositionItemDistribution | undefined> {
      try {
        const result = await hrDb.transaction('r', [hrDb.position_item_distribution], async () => {
          const positionItemDistribution = await hrDb.position_item_distribution.where('id').equals(id).first();
          if (positionItemDistribution) {
            return positionItemDistribution;
          } else {
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      }
      catch (error) {
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }

    async getOfflinePositionItems(): Promise<IPositionItem[]> {
      try {
        const positionList = await libDb.lib_position.toArray();
        const positionMap = new Map(positionList.map((item) => [item.id, item.position_description || ""]));

        const employmentList = await libDb.lib_employment_status.toArray();
        const employmentMap = new Map(employmentList.map((item) => [item.id, item.employment_status_description || ""]));

        const modalityList = await libDb.lib_modality.toArray();
        const modalityMap = new Map(modalityList.map((item) => [item.id, item.modality_name || ""]));

        return await hrDb.transaction('r', [hrDb.position_item], async () => {
          const positionItems = await hrDb.position_item.toArray();
          return positionItems.map((item) => ({
            ...item,
            position_description: positionMap.get(item.position_id) || "",
            employment_status_description: employmentMap.get(item.employment_status_id) || "",
            modality_name: modalityMap.get(item.modality_id) || "",
          }));
        });
      } catch (error) {
        console.error('Fetch Records Failed: ', error);
        return [];
      }
    }

    async saveOfflinePositionItem(positionItem: any): Promise<any | undefined> {
      try {
        let savedItem: IPositionItem | undefined;
  
        await hrDb.transaction('rw', [hrDb.position_item], async trans => {
        trans.meta = {
            needsAudit: true,
        };

          let data: IPositionItem = positionItem;

          if (positionItem.id === "") {
            data = {
              ...positionItem,
              id: uuidv4(),
              created_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              created_by: positionItem.created_by,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          } else {
            const existing = await hrDb.position_item.get(positionItem.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...positionItem,
              last_modified_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            };
          }
  
          await hrDb.position_item.put(data);
          savedItem = data;
        });
  
        return savedItem;
      } catch (error) {
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }

    async saveOfflinePositionDistribution(postionDistribution: any): Promise<any | undefined> {
      try{
        let savedItem: IPositionItemDistribution | undefined;
        await hrDb.transaction('rw', [hrDb.position_item_distribution], async trans => {
          trans.meta = {
            needsAudit: true,
          };
          let data: IPositionItemDistribution = postionDistribution;

          if (postionDistribution.id === "") {
            data = {
              ...postionDistribution,
              id: uuidv4(),
              created_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              created_by: postionDistribution.created_by,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          } else {
            const existing = await hrDb.position_item_distribution.get(postionDistribution.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...postionDistribution,
              last_modified_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            };
          }

          await hrDb.position_item_distribution.put(data);
          savedItem = data;
        });
        return savedItem;
      } catch (error) {
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }

    async getOfflinePositionItemDistributionMasterlist(): Promise<any[] | undefined> {
      await hrDb.open();
      await libDb.open();

      const data = await hrDb.position_item_distribution.toArray();

      const resolvedData = await Promise.all(
        data.map(async (item: any) => {
          const level = await libDb.lib_level.get(item.level_id);
          const positionItem = await hrDb.position_item.get(item.position_item_id);
          const office = await libDb.lib_office.get(item.office_id);
          const division = await libDb.lib_division.get(item.division_id);
          return {
            ...item,
            level: level ? level.level_description : null,
            item_code: positionItem ? positionItem.item_code : null,
            region: item.region_code,
            province: item.province_code,
            city: item.city_code,
            office: office ? office.office_description : null,
            division: division ? division.division_description : null,
          };
        })
      );
      return resolvedData;
    }

    async getOfflineHiringProceduresByDitributionId(distributionId: string): Promise<any[] | undefined> {
      await hrDb.open();
      await libDb.open();

      const data = await hrDb.hiring_procedure.where('position_item_distribution_id').equals(distributionId).toArray();
      const resolvedData = await Promise.all(
        data.map(async (item: any) => {
          const lib_hiring_procedure = await libDb.lib_hiring_procedure.get(item.hiring_procedure_id);
          return {
            ...item,
            date_target_from: item.date_target_from ? new Date(item.date_target_from).toLocaleDateString() : null,
            date_target_to: item.date_target_to ? new Date(item.date_target_to).toLocaleDateString() : null,
            date_actual_from: item.date_actual_from ? new Date(item.date_actual_from).toLocaleDateString() : null,
            date_actual_to: item.date_actual_to ? new Date(item.date_actual_to).toLocaleDateString() : null,
            hiring_procedure_description: lib_hiring_procedure ? lib_hiring_procedure.hiring_procedure_description : null,
          };
        })
      );
      return resolvedData;
    }

    async getOfflineHiringProcedureById(id:any): Promise<any | undefined> {
      try{
        const result = await hrDb.transaction('r', [hrDb.hiring_procedure], async() => {
          const hiringProcedure = await hrDb.hiring_procedure.where('id').equals(id).first();
          if (hiringProcedure) {
            return hiringProcedure;
          }else{
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      }catch (error) {
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }

    async saveOfflineHiringProcedure(hiringProcedure: any): Promise<any | undefined> {
      try {
        let savedItem: any | undefined;
        await hrDb.transaction('rw', [hrDb.hiring_procedure], async trans => {
          trans.meta = {
            needsAudit: true,
          };
          let data: IHiringProcedure = hiringProcedure;
          if (hiringProcedure.id === "" || hiringProcedure.id === undefined) {
            data = {
              ...hiringProcedure,
              id: uuidv4(),
              created_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await hrDb.hiring_procedure.get(hiringProcedure.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }
            data = {
              ...existing,
              ...hiringProcedure,
              last_modified_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
          };
        }
        await hrDb.hiring_procedure.put(data);
        savedItem = data;
      });
      return savedItem;
    }catch(error){
      console.error('Transaction failed: ', error);
      return undefined;
    }
    }

    async getOfflineApplicantById(id: any): Promise<IApplicant | undefined> {
      try{
        const result = await hrDb.transaction('r', [hrDb.applicant], async () => {
          const applicant = await hrDb.applicant.where('id').equals(id).first();
          if (applicant) {
            return applicant;
          } else {
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }

    async getOfflineApplicantsByDistributionId(distributionId: string): Promise<IApplicant[] | undefined> {
      try{
        const result = await hrDb.transaction('r', [hrDb.applicant], async () => {
          const applicants = await hrDb.applicant.where('position_item_distribution_id').equals(distributionId).toArray();
          if (applicants.length > 0) {
            return applicants;
          } else {
            console.log('No records found for the given distribution ID.');
            return [];
          }
        });
        return result;
      }catch(error){
        console.error('Fetch Records Failed: ', error);
        return undefined;
      }
    }

  async getOfflineApplicants(): Promise<any[] | undefined> {
    await Promise.all([hrDb.open(), dexieDb.open(), libDb.open()]);

    const [applicants, extensionNames, sexes, civilStatuses] = await Promise.all([
      hrDb.applicant.toArray(),
      libDb.lib_extension_name.toArray(),
      libDb.lib_sex.toArray(),
      libDb.lib_civil_status.toArray()
    ]);

    // Convert to maps for faster lookup
    const extensionMap = new Map(extensionNames.map(e => [e.id, e.extension_name]));
    const sexMap = new Map(sexes.map(s => [s.id, s.sex_description]));
    const civilStatusMap = new Map(civilStatuses.map(c => [c.id, c.civil_status_description]));

    return applicants.map(item => ({
      ...item,
      extension_name: extensionMap.get(item.extension_name_id ?? 0),
      sex: sexMap.get(item.sex_id ?? 0),
      civil_status: civilStatusMap.get(item.civil_status_id ?? 0)
    }));
  }


    async saveOfflineApplicant(applicant: any): Promise<any | undefined> {
      try {
        let savedItem: any | undefined;
        await hrDb.transaction('rw', [hrDb.applicant], async trans => {
          trans.meta = {
            needsAudit: true,
          };
          let data: IApplicant = applicant;
          if(applicant.id === "" || applicant.id === undefined) {
            data = {
              ...applicant,
              id: uuidv4(),
              created_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await hrDb.applicant.get(applicant.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }
            data = {
              ...existing,
              ...applicant,
              last_modified_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            };
          }
          await hrDb.applicant.put(data);
          savedItem = data;
        });
        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
}