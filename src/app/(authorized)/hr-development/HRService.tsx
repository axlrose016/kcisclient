import { hrDb } from "@/db/offline/Dexie/databases/hrDb";
import { IPositionItem } from "@/db/offline/Dexie/schema/hr-service";
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

    async getOfflinePositionItems(): Promise<IPositionItem[]> {
      try {
        const result = await hrDb.transaction('r', [hrDb.position_item], async () => {
          const positionItems = await hrDb.position_item.toArray();
          return positionItems;
        });
        return result;
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
            data = {
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
  }
  