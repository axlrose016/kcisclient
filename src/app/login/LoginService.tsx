import axios from 'axios';

class LoginService {
  private apiUrl = 'https://kcnfms.dswd.gov.ph/api/auth_login/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;

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
