import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/Config';

export interface TicketData {
  id: string;
  buyerName: string;
  ticketName: string;
  eventName: string;
  eventDate: string;
  quantity: number;
  status: string;
  isUsed: boolean;
  scannedAt?: string;
}

export const useTicketVerify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const verifyTicket = async (ticketId: string): Promise<TicketData | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/tickets/verify/${ticketId}`);
      if (response.data.valid) {
        return response.data.ticket;
      } else {
        setError(response.data.message || 'Invalid ticket');
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const scanTicket = async (ticketId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeaders();
      const response = await axios.post(`${API_BASE_URL}/tickets/scan/${ticketId}`, {}, { headers });
      return response.data.success;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Scan failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verifyTicket, scanTicket, loading, error };
};
