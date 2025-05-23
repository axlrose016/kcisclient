export interface IPositionItem {
    id: string,
    item_code: string,
    position_id: number,
    salary_grade_id: number,
    employment_status_id: number,
    modality_id: number,
    date_abolished: string | null,
    created_date: string,
    created_by: string,
    last_modified_date: string | null,
    last_modified_by: string | null,
    push_status_id: number,
    push_date: string | null,
    deleted_date: string | null,
    deleted_by: string | null,
    is_deleted: boolean,
    remarks: string | null,
  }

  export interface IPositionItemDistribution{
    id: string,
    position_item_id: string,
    level_id: number,
    region_code: string,
    province_code: string,
    city_code: string,
    office_id: number,
    division_id: number,
    parenthetical_title:string,
    date_distributed: string | null,
    created_date: string,
    created_by: string,
    last_modified_date: string | null,
    last_modified_by: string | null,
    push_status_id: number,
    push_date: string | null,
    deleted_date: string | null,
    deleted_by: string | null,
    is_deleted: boolean,
    remarks: string | null,
  }