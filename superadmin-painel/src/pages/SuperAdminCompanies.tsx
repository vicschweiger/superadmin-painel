// src/pages/SuperAdminCompanies.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  User, 
  BadgeCheck, 
  BadgeAlert, 
  BadgeX, 
  CalendarClock, 
  BookOpen, 
  ShoppingCart, 
  Pencil, 
  LogIn, 
  PlusCircle, 
  Search,
  X,
  CalendarPlus
} from 'lucide-react';

// 1. TIPAGEM DOS DADOS DA EMPRESA (INQUILINO)
// =================================================================
type PaymentStatus = 'active' | 'pending' | 'suspended';

interface Company {
  id: string; // Usaremos o access_token como ID único no frontend
  access_token: string;
  name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_cpf: string;
  payment_status: PaymentStatus;
  expiry_date: string; // Formato YYYY-MM-DD
  gtm_container_id?: string;
  module_catalog: boolean;
  module_ecommerce: boolean;
  module_reservations: boolean;
}

// 2. MOCK DATA INICIAL
// =================================================================
const mockCompanies: Company[] = [
  {
    id: '2A6G3D',
    access_token: '2A6G3D',
    name: 'Pizzaria Bella Napoli',
    client_name: 'Giovanni Rossi',
    client_email: 'giovanni@bellanapoli.com',
    client_phone: '11987654321',
    client_cpf: '123.456.789-00',
    payment_status: 'active',
    expiry_date: '2024-12-31',
    module_catalog: true,
    module_ecommerce: true,
    module_reservations: true,
    gtm_container_id: 'GTM-XXXXXX'
  },
  {
    id: '8B4H9K',
    access_token: '8B4H9K',
    name: 'Hamburgueria Smash',
    client_name: 'Juliana Silva',
    client_email: 'juliana@smash.com',
    client_phone: '21912345678',
    client_cpf: '987.654.321-99',
    payment_status: 'pending',
    expiry_date: '2024-08-15',
    module_catalog: true,
    module_ecommerce: false,
    module_reservations: false,
  },
  {
    id: '5C1J7M',
    access_token: '5C1J7M',
    name: 'Sushi House',
    client_name: 'Kenji Tanaka',
    client_email: 'kenji@sushihouse.jp',
    client_phone: '41955558888',
    client_cpf: '456.789.123-11',
    payment_status: 'suspended',
    expiry_date: '2024-07-01',
    module_catalog: false,
    module_ecommerce: false,
    module_reservations: false,
  },
];

// Componente para o Badge de Status
const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const statusConfig = {
    active: { text: 'Ativo', icon: <BadgeCheck size={14} />, classes: 'bg-green-100 text-green-800' },
    pending: { text: 'Pendente', icon: <BadgeAlert size={14} />, classes: 'bg-yellow-100 text-yellow-800' },
    suspended: { text: 'Suspenso', icon: <BadgeX size={14} />, classes: 'bg-red-100 text-red-800' },
  };
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.classes}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

// Componente para o Toggle Switch
const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
);


// 3. COMPONENTE DO MODAL DE CRIAÇÃO/EDIÇÃO
// =================================================================
interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Company) => void;
  company: Company | null;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSave, company }) => {
  const initialFormData: Company = {
    id: '', access_token: '', name: '', client_name: '', client_email: '', client_phone: '', client_cpf: '', 
    payment_status: 'pending', expiry_date: '', module_catalog: true, module_ecommerce: false, gtm_container_id: '', module_reservations: false
  };

  const [formData, setFormData] = useState<Company>(initialFormData);

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      // TODO: No modo de criação, você pode querer gerar um token temporário ou deixar em branco
      // para o backend gerar.
      const tempToken = `GRIM${Date.now().toString().slice(-6)}`;
      setFormData({ ...initialFormData, id: tempToken, access_token: tempToken });
    }
  }, [company, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: keyof Company, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">{company ? 'Editar Empresa' : 'Criar Nova Empresa'}</h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Sessão 1: Dados do Estabelecimento */}
            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-semibold text-gray-600 px-2">Dados do Estabelecimento</legend>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </fieldset>

            {/* Sessão 2: Dados do Contratante */}
            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-semibold text-gray-600 px-2">Dados do Contratante</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                  <input type="text" name="client_name" id="client_name" value={formData.client_name} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input type="email" name="client_email" id="client_email" value={formData.client_email} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                  <input type="tel" name="client_phone" id="client_phone" value={formData.client_phone} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="client_cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                  <input type="text" name="client_cpf" id="client_cpf" value={formData.client_cpf} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
            </fieldset>

            {/* Sessão 3: Configurações de Assinatura */}
            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-semibold text-gray-600 px-2">Configurações de Assinatura</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="access_token" className="block text-sm font-medium text-gray-700 mb-1">Token de Acesso</label>
                  <input type="text" name="access_token" id="access_token" value={formData.access_token} readOnly className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                  <input type="date" name="expiry_date" id="expiry_date" value={formData.expiry_date} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 mb-1">Status Financeiro</label>
                  <select name="payment_status" id="payment_status" value={formData.payment_status} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="active">Ativo</option>
                    <option value="pending">Pendente</option>
                    <option value="suspended">Suspenso</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gtm_container_id" className="block text-sm font-medium text-gray-700 mb-1">Tag do GTM (Opcional)</label>
                  <input type="text" name="gtm_container_id" id="gtm_container_id" value={formData.gtm_container_id} onChange={handleChange} placeholder="GTM-XXXXXX" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
            </fieldset>

            {/* Sessão 4: Liberação de Módulos */}
            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-semibold text-gray-600 px-2">Liberação de Módulos (Feature Flags)</legend>
              <div className="space-y-4">
                <ToggleSwitch label="Habilitar Módulo de Cardápio" enabled={formData.module_catalog} onChange={(val) => handleToggleChange('module_catalog', val)} />
                <ToggleSwitch label="Habilitar E-commerce/Pagamento" enabled={formData.module_ecommerce} onChange={(val) => handleToggleChange('module_ecommerce', val)} />
                <ToggleSwitch label="Habilitar Módulo de Reservas" enabled={formData.module_reservations} onChange={(val) => handleToggleChange('module_reservations', val)} />
              </div>
            </fieldset>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// 4. COMPONENTE PRINCIPAL DA PÁGINA
// =================================================================
const SuperAdminCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Efeito para buscar os dados da API
  useEffect(() => {
    // TODO: Substituir o mock pela chamada real da API (GET /api/superadmin/companies)
    console.log("Fetching companies from API...");
    // fetch('/api/superadmin/companies')
    //   .then(res => res.json())
    //   .then(data => setCompanies(data))
    //   .catch(err => console.error("Failed to fetch companies:", err));
    
    // Usando mock data por enquanto
    setCompanies(mockCompanies);
  }, []);

  const handleOpenModal = (company: Company | null = null) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleSaveCompany = useCallback((companyData: Company) => {
    if (editingCompany) {
      // TODO: Lógica de UPDATE (PUT /api/superadmin/companies/{id})
      console.log("Updating company:", companyData);
      setCompanies(prev => prev.map(c => c.id === companyData.id ? companyData : c));
    } else {
      // TODO: Lógica de CREATE (POST /api/superadmin/companies)
      console.log("Creating new company:", companyData);
      setCompanies(prev => [...prev, companyData]);
    }
    handleCloseModal();
  }, [editingCompany]);
  
  // TODO: Implementar a função de DELETE se necessário
  // const handleDeleteCompany = (companyId: string) => {
  //   console.log("Deleting company:", companyId);
  //   // fetch(`/api/superadmin/companies/${companyId}`, { method: 'DELETE' })
  //   //   .then(() => setCompanies(prev => prev.filter(c => c.id !== companyId)))
  // }

  const handleImpersonate = (token: string) => {
    console.log(`Impersonating company with token: ${token}. Navigating to /dashboard...`);
    localStorage.setItem('tenant_token', token);
    navigate('/dashboard');
  };

  const filteredCompanies = useMemo(() => 
    companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.access_token.toLowerCase().includes(searchTerm.toLowerCase())
    ), [companies, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Página */}
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gerenciador de Clientes (Tenants)
            </h1>
            <p className="mt-1 text-sm text-gray-500">Visualize e gerencie todas as empresas da plataforma.</p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => handleOpenModal(null)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle size={18} />
              Nova Empresa
            </button>
          </div>
        </div>

        {/* Card Principal com a Tabela */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Barra de Ferramentas da Tabela (Busca) */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, cliente ou token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Tabela de Empresas */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa / Cliente</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Módulos</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-600">
                          <Building2 size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <User size={12} /> {company.client_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{company.access_token}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={company.payment_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarClock size={14} />
                        {new Date(company.expiry_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 ${company.module_catalog ? 'text-green-600' : 'text-gray-400'}`} title="Módulo de Cardápio">
                          <BookOpen size={18} />
                        </div>
                        <div className={`flex items-center gap-1 ${company.module_ecommerce ? 'text-green-600' : 'text-gray-400'}`} title="Módulo de E-commerce">
                          <ShoppingCart size={18} />
                        </div>
                        <div className={`flex items-center gap-1 ${company.module_reservations ? 'text-green-600' : 'text-gray-400'}`} title="Módulo de Reservas">
                          <CalendarPlus size={18} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleOpenModal(company)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100" title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleImpersonate(company.access_token)} className="text-sky-600 hover:text-sky-900 p-1 rounded-full hover:bg-sky-100" title="Acessar Painel">
                        <LogIn size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                 {filteredCompanies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Nenhuma empresa encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Renderização do Modal */}
      <CompanyModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCompany}
        company={editingCompany}
      />
    </div>
  );
};

export default SuperAdminCompanies;
