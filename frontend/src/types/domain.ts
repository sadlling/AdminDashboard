export interface Client {
  id: string | number; 
  name: string;
  email: string;
  balanceT: number; 
}

export interface Payment {
  id: string | number;
  clientId: string | number;
  clientName?: string;
  amount: number;
  timestamp: string | Date; 
}

export interface TokenRate {
  rate: number;
  lastUpdated?: string | Date;
}

export interface Payment {
  id: string | number;        
  clientId: string | number;  
  clientName?: string;        
  amount: number;             
  timestamp: string|Date;          
  currency?: string;          
  description?: string;      
}


export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}