import axios from 'axios';

// Define the data structure using TypeScript interface
interface PersonProfile {
  cwf_category_id: number;
  cfwp_id_no: string;  
  philsys_id_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  extension_name: number;
  sex_id: number;
  civil_status_id: number;
  birthdate: string;
  age: number;
  no_of_children: number;
  birthplace: string;
  is_pantawid: boolean;
  is_pantawid_leader: boolean;
  is_slp: boolean;
  has_immediate_health_concern: boolean;
  address: string;
  sitio: string;
  brgy_code: string;
  sitio_current: string;
  brgy_code_current: string;
  cellphone_no: string;
  cellphone_no_secondary: string;
  email: string;
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
  ip: number;
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
  others: string;
  school_name: string;
  campus: string;
  school_address: string;
  course_id: number;
  year_graduated: string;
  year_level_id: number;
  skills: string;
  family_member_name: string;
  relationship_to_family_member: string;
  created_by: string;
  last_modified_by: string;
  push_status_id: number;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string;
  person_profile_id: string;
}

class PersonProfileService {
  private apiUrl: string;

  constructor() {
    // http://127.0.0.1:8000/
    this.apiUrl = 'https://kcnfms.dswd.gov.ph/api/person_profile/';
    // this.apiUrl = 'http://10.10.10.162:9000/api/person_profile/';
    // this.apiUrl = 'http://127.0.0.1:8000/api/person_profile/';
  }

  // Method to sync data in bulk
  async syncBulkData(dataArray: PersonProfile[]): Promise<any> {
    try {
      console.log(dataArray);
      console.log(this.apiUrl);
      const response = await axios.post(this.apiUrl, dataArray, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      throw error;
    }
  }
}

export default new PersonProfileService();
