import axios from 'axios';

class LoginService {
  private apiUrl = 'https://kcnfms.dswd.gov.ph/api/auth_login/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;


  async getProfile(id: string, token: string): Promise<any> {
    debugger;
    const url = "https://kcnfms.dswd.gov.ph/api/person_profile/view/" + id;
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return false;
    }
  } 

  async onlineLogin(email:string, password: string): Promise<any> {
    // debugger;
    const creds = {
        email: email, password: password
    }
    try {
      const response = await axios.post(this.apiUrl, creds, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      return false;
    }
  }
}

export default new LoginService();
