import apiClient from '../config/apiClient';
import type { TokenRate } from '../types/domain';

export const getCurrentRate = async (): Promise<TokenRate> => {
  const response = await apiClient.get<TokenRate>('/rate');
  return response.data;
};

export const updateRate = async (newRate: number): Promise<TokenRate> => {
  const response = await apiClient.post<TokenRate>('/rate', { newRate }); 
  return response.data;
};

// let mockCurrentRate: TokenRate = { rate: 10.55 };

// export const getCurrentRate = async (): Promise<TokenRate> => {
//   // console.log('[MOCK API] Fetching current rate...');
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // console.log('[MOCK API] Current rate fetched:', mockCurrentRate);
//       resolve(mockCurrentRate);
//     }, 500);
//   });
//   // Реальный вызов:
//   // const response = await apiClient.get<TokenRate>('/rate');
//   // return response.data;
// };

// export const updateRate = async (newRate: number): Promise<TokenRate> => {
//   // console.log(`[MOCK API] Updating rate to: ${newRate}...`);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       mockCurrentRate = { rate: newRate };
//       // console.log('[MOCK API] Rate updated:', mockCurrentRate);
//       resolve(mockCurrentRate);
//     }, 700);
//   });
// }