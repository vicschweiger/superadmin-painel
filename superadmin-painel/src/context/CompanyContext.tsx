import { createContext, useState, useEffect, type ReactNode } from 'react';

export interface CompanyData {
  company_id: number;
  name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_cpf: string;
  access_token: string;
  gtm_container_id: string | null;
  is_active: boolean;
  status_pagamento: 'active' | 'pending' | 'suspended';
  expiry_date: string;
  modules: {
    catalog_mode: boolean;
    store_mode: boolean;
  };
}

export interface CompanyContextType {
  companyData: CompanyData | null;
  gtmContainerId: string;
  loading: boolean;
  fetchCompanyData: (token: string) => Promise<boolean>;
  fetchGtmConfig: (token: string) => Promise<string>;
}

export const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [gtmContainerId, setGtmContainerId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = async (token: string) => {
    try {
      const response = await fetch(`https://web-production-6e1d8.up.railway.app/api/company/${token}/`);
      if (response.ok) {
        const data: CompanyData = await response.json();
        setCompanyData(data);
        return true;
      } else {
        console.error('Falha ao buscar dados da empresa:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da empresa:', error);
    }
    return false;
  };

  const fetchGtmConfig = async (token: string) => {
    try {
      const response = await fetch(`https://web-production-6e1d8.up.railway.app/api/company/get-config/${token}/`);
      if (response.ok) {
        const data = await response.json();
        const gtmValue = data?.gtm_container_id ?? data?.gtm_id;
        // Garante que o valor seja uma string e remove espaços, tratando null/undefined como ''
        const normalizedValue = gtmValue ? String(gtmValue).trim() : '';
        setGtmContainerId(normalizedValue);
        return normalizedValue;
      } else {
        // Se a resposta não for OK (ex: 404), assume que não há GTM configurado.
        setGtmContainerId('');
        return '';
      }
    } catch (error) {
      console.error('Erro ao buscar configuração do GTM:', error);
      setGtmContainerId('');
      return '';
    }
  };

  useEffect(() => {
    // Uma sessão antiga nunca deve autenticar automaticamente ao abrir o painel.
    const token = null;

    const initialize = async () => {
      if (token) {
        setLoading(true);
        // Executa as duas chamadas em paralelo para otimizar o carregamento
        await Promise.all([fetchCompanyData(token), fetchGtmConfig(token)]);
        setLoading(false);
      } else {
        // Se não houver token, o carregamento termina imediatamente.
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companyData,
        fetchCompanyData,
        gtmContainerId,
        fetchGtmConfig,
        loading,
      }}>
      {children}
    </CompanyContext.Provider>
  );
};
