import { IPersonProfile } from '@/components/interfaces/personprofile';
import axios from 'axios';


class PersonProfileService {
  private apiUrl = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;

  // Method to sync data in bulk
  async syncBulkData(dataArray: IPersonProfile): Promise<any> {
    debugger;
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
