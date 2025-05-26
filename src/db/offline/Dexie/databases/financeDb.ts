import Dexie, { Table } from "dexie";
import { IAllocation, IAllocationUacs, IMonthlyObligationPlan } from "../schema/finance-service";

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';

class FinanceDatabase extends Dexie {
    allocation!: Table<IAllocation, string>;
    allocation_uacs!: Table<IAllocationUacs, string>;
    monthly_obligation_plan!: Table<IMonthlyObligationPlan, string>;

    constructor() {
        super('financeDb');
        this.version(1).stores({
            allocation: `id, date_allocation, region_code, pap_id, budget_year_id, appropriation_source_id, appropriation_type_id, record_status_id, ${commonFields}`,
            allocation_uacs: `id, allocation_id, allotment_class_id, component_id, expense_id, allocation_amount, ${commonFields}`,
            monthly_obligation_plan: `id, allocation_uacs_id, amt_jan, amt_feb, amt_mar, amt_apr, amt_may, amt_jun, amt_jul, amt_aug, aug_sep, aug_oct, aug_nov, aug_dec, ${commonFields}`
        })
    }
}

export const financeDb = new FinanceDatabase();
