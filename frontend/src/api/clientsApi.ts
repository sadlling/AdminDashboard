import apiClient from '../config/apiClient';
import type { Client, PaginatedResponse } from '../types/domain'; 


export interface GetClientsParams {
  pageNumber?: number; 
  pageSize?: number;
}


export type CreateClientPayload = Omit<Client, 'id'>;


export type UpdateClientPayload = Omit<Client, 'id'>; 

export const getClients = async (params: GetClientsParams = {}): Promise<PaginatedResponse<Client>> => {
  const response = await apiClient.get<PaginatedResponse<Client>>('/clients', { params });
  return response.data;
};


export const createClient = async (payload: CreateClientPayload): Promise<Client> => {
 
  const response = await apiClient.post<Client>('/clients', payload); 
  return response.data;
};


export const updateClient = async (id: Client['id'], payload: UpdateClientPayload): Promise<Client> => {
  const response = await apiClient.put<Client>(`/clients/${id}`, payload); 
  return response.data;
};


export const deleteClient = async (id: Client['id']): Promise<void> => { 
  await apiClient.delete(`/clients/${id}`);
 
};
