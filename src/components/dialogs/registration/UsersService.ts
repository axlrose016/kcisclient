import axios from 'axios';

// Define the data structure using TypeScript interface
interface Users {
  username: string;
  email: string;
  password: string;
  role_id: string;
  created_date: string;
  created_by: string;
  last_modified_date?: string;
  last_modified_by?: string;
  push_status_id: number;
  push_date?: string;
  deleted_date?: string;
  deleted_by?: string;
  is_deleted: boolean;
  remarks?: string;
}

class PersonProfileService {
  private apiUrl: string;

  constructor() {
    // http://127.0.0.1:8000/
    this.apiUrl = 'http://10.10.10.162:9000/api/users/';
    // this.apiUrl = 'http://127.0.0.1:8000/api/person_profile/';
  }

  // Method to sync data in bulk
  async syncBulkData(dataArray: Users[]): Promise<any> {
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
