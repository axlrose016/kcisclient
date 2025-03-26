export interface IPersonProfile {
  id: string;
  modality_id: number; 
  cwf_category_id: number | null;
  cfwp_id_no: string | null;
  has_philsys_id: boolean | null;
  philsys_id_no: string;
  first_name: string;
  has_middle_name: boolean | false;
  middle_name: string;
  last_name: string;
  extension_name_id: number;
  sex_id: number;
  civil_status_id: number;
  birthdate: string;
  age: number;
  no_of_children: number | null;
  birthplace: string;
  is_pantawid: boolean;
  is_pantawid_leader: boolean;
  is_slp: boolean;
  has_immediate_health_concern: boolean | null;
  immediate_health_concern: string;
  address: string | null;
  sitio: string | null;
  region_code: string;
  province_code: string;
  city_code: string;
  brgy_code: string;
  brgy_code_current: string | null;
  sitio_present_address: string | null,
  region_code_present_address: string | null,
  province_code_present_address: string | null,
  city_code_present_address: string | null,
  brgy_code_present_address: string | null,
  cellphone_no: string | null;
  cellphone_no_secondary: string | null;
  email: string;
  hasOccupation: boolean | false,
  current_occupation: string;
  is_lgu_official: boolean;
  is_mdc: boolean;
  is_bdc: boolean;
  is_bspmc: boolean;
  is_bdrrmc_bdc_twg: boolean;
  is_bdrrmc_expanded_bdrrmc: boolean;
  is_mdrrmc: boolean;
  is_hh_head: boolean;
  academe: number;
  business: number;
  differently_abled: number;
  farmer: number;
  fisherfolks: number;
  government: number;
  is_ip: boolean | false;
  ip_group_id: number;
  ngo: number;
  po: number;
  religious: number;
  senior_citizen: number;
  women: number;
  solo_parent: number;
  out_of_school_youth: number;
  children_and_youth_in_need_of_special_protection: number;
  family_heads_in_need_of_assistance: number;
  affected_by_disaster: number;
  persons_with_disability: number;
  others: string | null;
  school_name: string;
  is_graduate: boolean | false;
  campus: string;
  school_address: string;
  course_id: number;
  year_graduated: string;
  year_level_id: number;
  skills: string;
  family_member_name: string | null;
  relationship_to_family_member: string | null;
  is_permanent_same_as_current_address: boolean | null;
  id_card: number | 0;
  occupation_id_card_number: string;
  deployment_area_name: string | "",
  deployment_area_id: number | 0;
  deployment_area_address: string;
  preffered_type_of_work_id: number | 0;
  modality_sub_category_id: number | null;
  is_pwd: boolean | false;
  is_pwd_representative: boolean | null;
  profile_picture: string;
  hasProgramDetails: boolean | false;

  //CFW Representative
  representative_last_name: string | null;
  representative_first_name: string | null;
  representative_middle_name: string | null;
  representative_extension_name_id: number | null;
  representative_sitio: string | null;
  representative_brgy_code: string | null;
  representative_relationship_to_beneficiary: number | null;
  representative_birthdate: string | null;
  representative_age: number | null;
  representative_occupation: string | null;
  representative_monthly_salary: number | null;
  representative_educational_attainment_id: number | null;
  representative_sex_id: number | null;
  representative_contact_number: string | null;
  representative_id_card_id: number | null;
  representative_id_card_number: string | null;
  representative_address: string | null;
  representative_civil_status_id: string | null;
  representative_has_health_concern: string | null;
  representative_health_concern_details: string | null;
  representative_skills: string | null;

  //Audit Trail
  user_id: string;
  created_by: string;
  created_date: string;
  last_modified_by: string | null;
  last_modified_date: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string;
}

export interface IPersonProfileSector {
  id: string;
  person_profile_id: string;
  sector_id: number;
  user_id: string;
  created_by: string;
  created_date: string;
  last_modified_by: string | null;
  last_modified_date: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string;
}

export interface IPersonProfileDisability {
  id: string;
  person_profile_id: string;
  type_of_disability_id: number;
  user_id: string;
  created_by: string;
  created_date: string;
  last_modified_by: string | null;
  last_modified_date: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string;
}

export interface IPersonProfileFamilyComposition {
  id: string;
  person_profile_id: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  extension_name_id: number | null;
  birthdate: string;
  age: number | null;
  contact_number: string | null;
  highest_educational_attainment_id: number | null;
  monthly_income: string | null;
  relationship_to_the_beneficiary_id: number | null;
  work: string | null;
  user_id: string;
  created_by: string;
  created_date: string;
  last_modified_by: string | null;
  last_modified_date: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string;
}

export interface IPersonProfileCfwFamProgramDetails {
  id: string;
  person_profile_id?: string | null;
  family_composition_id?: string | null;
  program_type_id?: number | null;
  year_served_id?: number | null;
  user_id: string;
  created_by: string;
  created_date: string;
  last_modified_by: string | null;
  last_modified_date: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string;
}