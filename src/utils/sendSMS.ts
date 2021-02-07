import axios from 'axios';
import { config } from '../config';

const { smsEndpoint, smsAPIKey, smsSender } = config;

export const sendSMS = async (to: string, message: string) => {
  const res = await axios.get(
    `${smsEndpoint}key=${smsAPIKey}&to=${to}&msg=${message}&sender_id=${smsSender}`
  );
  return res.data;
};
