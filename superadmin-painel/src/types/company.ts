export type PaymentStatus = 'active' | 'pending' | 'suspended';

export interface CompanyModules {
  catalog_mode: boolean;
  store_mode: boolean;
  ecommerce?: boolean;      // Adicionado
  reservations?: boolean;   // Adicionado
}

// Renomeamos de CompanyData para Company
export interface Company {
  id?: string;
  company_id?: number;
  access_token: string;
  name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_cpf: string;
  gtm_container_id?: string;
  spreadsheet_id?: string;
  is_active: boolean;
  payment_status: PaymentStatus;
  status_pagamento?: PaymentStatus;
  expiry_date: string;
  modules: CompanyModules;
}