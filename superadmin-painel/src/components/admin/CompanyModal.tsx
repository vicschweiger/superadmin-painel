import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Database } from 'lucide-react';
import type { CompanyData } from '../../types/company';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: CompanyData) => void;
  company: CompanyData | null;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSave, company }) => {
  const initialFormData: CompanyData = {
    access_token: '',
    name: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_cpf: '',
    payment_status: 'pending',
    expiry_date: '',
    gtm_container_id: '',
    spreadsheet_id: '',
    is_active: true,
    modules: {
      catalog_mode: true,
      store_mode: false,
    }
  };

  const [formData, setFormData] = useState<CompanyData>(initialFormData);

  useEffect(() => {
    if (company) {
      setFormData({
        ...initialFormData,
        ...company,
        payment_status: company.payment_status || company.status_pagamento || 'pending',
        modules: company.modules || { catalog_mode: true, store_mode: false }
      });
    } else {
      const tempToken = `GRIM${Date.now().toString().slice(-6).toUpperCase()}`;
      setFormData({ ...initialFormData, access_token: tempToken });
    }
  }, [company, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: keyof CompanyData, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (moduleName: 'catalog_mode' | 'store_mode', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleName]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6 transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="text-indigo-600" size={24} />
            {company ? 'Editar Empresa e Integrações' : 'Cadastrar Nova Empresa'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="company-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LADO ESQUERDO: DADOS CADASTRAIS */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Empresa</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Estabelecimento</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" placeholder="Ex: Hortifruti do João" />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <ToggleSwitch label="Empresa Ativa no Sistema" enabled={formData.is_active} onChange={(val) => handleToggleChange('is_active', val)} />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Dados do Contratante</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Responsável</label>
                      <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                      <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (WhatsApp)</label>
                      <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ</label>
                      <input type="text" name="client_cpf" value={formData.client_cpf} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
                </section>
              </div>

              {/* LADO DIREITO: INTEGRAÇÕES E CONFIGURAÇÕES */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Integrações do Cliente</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ID da Planilha (Google Sheets)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon size={16} className="text-emerald-500" />
                        </div>
                        <input type="text" name="spreadsheet_id" value={formData.spreadsheet_id} onChange={handleChange} placeholder="Ex: 1lkKpSJqx4uCsL-TJ..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Usado pela automação do Make para salvar os pedidos deste cliente.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Tag Manager (GTM)</label>
                      <input type="text" name="gtm_container_id" value={formData.gtm_container_id} onChange={handleChange} placeholder="GTM-XXXXXX" className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Plano e Pagamento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Token de Acesso (Login do Cliente)</label>
                      <input type="text" name="access_token" value={formData.access_token} readOnly className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono text-center font-bold tracking-widest focus:ring-indigo-500 focus:border-3 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Data de Vencimento</label>
                      <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Status Financeiro</label>
                      <select name="payment_status" value={formData.payment_status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                        <option value="active">Ativo</option>
                        <option value="pending">Pendente</option>
                        <option value="suspended">Suspenso</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Liberação de Módulos (Features)</h3>
                  <div className="space-y-4">
                    <ToggleSwitch label="Módulo: Catálogo Digital" enabled={formData.modules.catalog_mode} onChange={(val) => handleModuleChange('catalog_mode', val)} />
                    <div className="h-px bg-slate-200 w-full"></div>
                    <ToggleSwitch label="Módulo: E-commerce (Carrinho)" enabled={formData.modules.store_mode} onChange={(val) => handleModuleChange('store_mode', val)} />
                  </div>
                </section>
              </div>

            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none transition-colors">
            Cancelar
          </button>
          <button type="submit" form="company-form" className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-lg shadow-md shadow-indigo-600/20 hover:bg-indigo-700 focus:outline-none transition-colors">
            Salvar Alterações
          </button>
        </div>

      </div>
    </div>
  );
};