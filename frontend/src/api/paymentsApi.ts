import apiClient from "../config/apiClient";
import type { Payment,PaginatedResponse } from "../types/domain";

export interface GetPaymentsParams {
  page?: number;
  pageSize?: number;
}

export const getPayments = async (params: GetPaymentsParams = {}): Promise<PaginatedResponse<Payment>> => {
  const response = await apiClient.get<PaginatedResponse<Payment>>('/payments', { 
    params: { 
      pageNumber: params.page, 
      pageSize: params.pageSize 
    }
  });
  return response.data;
};
