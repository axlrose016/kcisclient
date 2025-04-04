import { IAttachments } from '@/components/interfaces/general/attachments';
import { IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector } from '@/components/interfaces/personprofile';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import axios from 'axios';

const _session = await getSession() as SessionPayload;

class PersonProfileService {
  private apiUrl = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;
  private apiUrlDisabilities = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/'; 
  private apiUrlSectors = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/'; 
  private apiUrlFamilyComposition = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/'; 
  private apiUrlProgramDetails = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/'; 
  private apiUrlAttachments = 'https://kcnfms.dswd.gov.ph/api/person_profile/create/'; 
  // Method to sync data in bulk
  async syncBulkData(dataArray: IPersonProfile): Promise<any> {
    debugger;
    try {
      console.log(dataArray);
      console.log(this.apiUrl);
      const response = await axios.post(this.apiUrl, dataArray, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      throw error;
    }
  }
  async syncBulkDisabilities(dataArray: IPersonProfileDisability): Promise<any> {
    debugger;
    try {
      console.log(dataArray);
      console.log(this.apiUrlDisabilities);
      const response = await axios.post(this.apiUrlDisabilities, dataArray, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      throw error;
    }
  }
  async syncBulkSectors(dataArray: IPersonProfileSector): Promise<any> {
    debugger;
    try {
      console.log(dataArray);
      console.log(this.apiUrlSectors);
      const response = await axios.post(this.apiUrlSectors, dataArray, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      throw error;
    }
  }
  async syncBulkFamilyComposition(dataArray: IPersonProfileFamilyComposition): Promise<any> {
    debugger;
    try {
      console.log(dataArray);
      console.log(this.apiUrlFamilyComposition);
      const response = await axios.post(this.apiUrlFamilyComposition, dataArray, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      throw error;
    }
  }
  async syncBulkProgramDetails(dataArray: IPersonProfileCfwFamProgramDetails): Promise<any> {
    debugger;
    try {
      console.log(dataArray);
      console.log(this.apiUrlProgramDetails);
      const response = await axios.post(this.apiUrlProgramDetails, dataArray, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      throw error;
    }
  }
  async syncBulkAttachments(dataArray: IAttachments): Promise<any> {
    debugger;
    try {
      console.log(dataArray);
      console.log(this.apiUrlAttachments);
      const response = await axios.post(this.apiUrlAttachments, dataArray, {
        headers: {
          Authorization: `bearer ${_session.token}`,
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
