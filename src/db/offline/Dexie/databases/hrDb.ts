import Dexie, { Table } from 'dexie';
import { IPositionItem, IPositionItemDistribution } from "../schema/hr-service";

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';

class HRDatabase extends Dexie {
    position_item!: Table<IPositionItem, string>;
    position_item_distribution!: Table<IPositionItemDistribution, string>;

    constructor() {
        super('hrdb');
        this.version(1).stores({
            position_item: `id, item_code, position_id, salary_grade_id, employment_status_id, modality_id, date_abolished, ${commonFields}`,
            position_item_distribution: `id, position_item_id, level_id, region_code, province_code, city_code, office_id, division_id, parenthetical_title, date_distributed, ${commonFields}`,
        })
    }
}
export const hrDb = new HRDatabase();
