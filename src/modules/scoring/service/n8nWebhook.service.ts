import axios from 'axios';

export class N8nService {
  async sendEvaluation(data: any): Promise<any> {
    // const url = process.env.N8N_WEBHOOK_URL; 
    const url= "https://n8n.srv864892.hstgr.cloud/webhook-test/trust-pme-evaluation"
    try {
      const response = await axios.post(url, data);
      if(response && response.data){
        return response.data;
      }else{
        return false
      }
    } catch (error) {
      return error
      // console.error('Erreur lors de l’appel à n8n', error);
      // throw new Error('Erreur n8n');
    }
  }
}
