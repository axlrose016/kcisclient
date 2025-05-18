import { financeDb } from "@/db/offline/Dexie/databases/financeDb";
import { IAllocation, IAllocationUacs } from "@/db/offline/Dexie/schema/finance-service";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { v4 as uuidv4 } from 'uuid';

const _session = await getSession() as SessionPayload;

export class FinanceService {
    async getOfflineAllocationById(id: any): Promise<IAllocation | undefined> {
      try {
        const result = await financeDb.transaction('r', [financeDb.allocation], async () => {
          const allocation = await financeDb.allocation.where('id').equals(id).first();
          if (allocation) {
            return allocation;
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
    async getOfflineAllocationUacsById(id: any): Promise<IAllocationUacs | undefined>{
        try{
            const result = await financeDb.transaction('r', [financeDb.allocation_uacs], async () => {
                const uacs = await financeDb.allocation_uacs.where('id').equals(id).first();
                if(uacs){
                    return uacs;
                }else {
                    console.log('No record found with the given ID.');
                    return undefined;
                }
            });
            return result;
        }catch(error) {
            console.error('Fetch Record Failed: ', error)
            return undefined;
        }
    }
    async getOfflineAllocationUacsByAllotmentId(id: any): Promise<IAllocationUacs[] | undefined>{
       try {
        const result = await financeDb.transaction('r', [financeDb.allocation_uacs], async () => {
            const uacs = await financeDb.allocation_uacs.where('allocation_id').equals(id).toArray();
            if (uacs) {
            return uacs;
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

    async getOfflineAllocations(): Promise<IAllocation[]> {
        try {
        const result = await financeDb.transaction('r', [financeDb.allocation], async () => {
            const allocations = await financeDb.allocation.toArray();
            return allocations;
        });
        return result;
        } catch (error) {
        console.error('Fetch Records Failed: ', error);
        return [];
        }
    }

    async saveOfflineAllocation(allocation:any):Promise<any | undefined>{
        try{
            let savedItem: IAllocation | undefined;

            await financeDb.transaction('rw', [financeDb.allocation], async () => {
                let data: IAllocation = allocation;

                if(allocation.id === ""){
                    data = {
                        ...allocation,
                        id:uuidv4(),
                        created_date: new Date().toISOString(),
                        created_by: allocation.created_by,
                        push_status_id: 2,
                        remarks: "Record Created by " + _session.userData.email,
                        };
                    } else {
                        data = {
                        ...allocation,
                        last_modified_date: new Date().toISOString(),
                        last_modified_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Updated by " + _session.userData.email,
                    };
                }

                await financeDb.allocation.put(data);
                savedItem = data;
            });

            return savedItem;
        }catch(error){
            console.error('Transaction failed: ', error);
            return undefined;
        }
    }
     async saveOfflineAllocationUacs(uacs:any):Promise<any | undefined>{
        try{
            let savedItem: IAllocationUacs | undefined;

            await financeDb.transaction('rw', [financeDb.allocation_uacs], async () => {
                let data: IAllocationUacs = uacs;

                if(uacs.id === ""){
                    data = {
                        ...uacs,
                        id:uuidv4(),
                        created_date: new Date().toISOString(),
                        created_by: uacs.created_by,
                        push_status_id: 2,
                        remarks: "Record Created by " + _session.userData.email,
                        };
                    } else {
                        data = {
                        ...uacs,
                        last_modified_date: new Date().toISOString(),
                        last_modified_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Updated by " + _session.userData.email,
                    };
                }

                await financeDb.allocation_uacs.put(data);
                savedItem = data;
            });

            return savedItem;
        }catch(error){
            console.error('Transaction failed: ', error);
            return undefined;
        }
    }
}