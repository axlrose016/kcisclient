import Dexie, { Table } from "dexie";
import { IAllocation, IAllocationUacs } from "../schema/finance-service";

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';

class FinanceDatabase extends Dexie {
    allocation!: Table<IAllocation, string>;
    allocation_uacs!: Table<IAllocationUacs, string>;

    constructor() {
        super('financeDb');
        this.version(1).stores({
            allocation: `id, date_allocation, region_code, pap_id, budget_year_id, appropriation_source_id, appropriation_type_id, record_status_id, ${commonFields}`,
            allocation_uacs: `id, allocation_id, allotment_class_id, component_id, expense_id, allocation_amount, ${commonFields}`
        })
    }
}

export const financeDb = new FinanceDatabase();
