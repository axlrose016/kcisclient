import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { hrDb } from "@/db/offline/Dexie/databases/hrDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { IPositionItem, IPositionItemDistribution } from "@/db/offline/Dexie/schema/hr-service";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
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

        const modalityList = await dexieDb.lib_modality.toArray();
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
  
        await hrDb.transaction('rw', [hrDb.position_item], async () => {

          let data: IPositionItem = positionItem;

          if (positionItem.id === "") {
            data = {
              ...positionItem,
              id: uuidv4(),
              created_date: new Date().toISOString(),
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
              last_modified_date: new Date().toISOString(),
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
        await hrDb.transaction('rw', [hrDb.position_item_distribution], async () => {
          let data: IPositionItemDistribution = postionDistribution;

          if (postionDistribution.id === "") {
            data = {
              ...postionDistribution,
              id: uuidv4(),
              created_date: new Date().toISOString(),
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
              last_modified_date: new Date().toISOString(),
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
          return {
            ...item,
            level: level ? level.level_description : null,
            item_code: positionItem ? positionItem.item_code : null,
            region: item.region_code,
            province: item.province_code,
            city: item.city_code,
            office: item.office_id,
            division: item.division_id,
          };
        })
      );
      return resolvedData;
    }
}