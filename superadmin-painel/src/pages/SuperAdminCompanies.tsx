import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/sapo-pet.png';
import { 
  Building2, 
  User, 
  CalendarClock, 
  BookOpen, 
  ShoppingCart, 
  Pencil, 
  LogIn, 
  PlusCircle, 
  Search,
  Loader2,
  Trash2,
  PowerOff,
  LogOut,
  ChevronDown
} from 'lucide-react';

import type { Company } from '../types/company'; 
import { StatusBadge } from '../components/ui/StatusBadge';
import { CompanyModal } from '../components/admin/CompanyModal';

export default function SuperAdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const API_URL = 'https://web-production-6e1d8.up.railway.app/api/companies/';

  useEffect(() => {
    const isSuperAdmin = localStorage.getItem('is_superadmin');
    if (!isSuperAdmin) {
      navigate('/admin'); // Redireciona de volta para o login se não estiver autenticado
    }
  }, [navigate]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          console.error("Erro ao buscar empresas:", response.status);
        }
      } catch (error) {
        console.error("Falha na conexão com a API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCompanies();
  }, []);

  const handleOpenModal = (company: Company | null = null) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleSaveCompany = useCallback(async (companyData: Company) => {
    try {
      const isEditing = !!editingCompany && editingCompany.access_token;
      const url = isEditing ? `${API_URL}${editingCompany.access_token}/` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });

      if (response.ok) {
        const savedCompany = await response.json();
        if (isEditing) {
          setCompanies((prev) => prev.map(c => c.access_token === savedCompany.access_token ? savedCompany : c));
        } else {
          setCompanies((prev) => [...prev, savedCompany]);
        }
        handleCloseModal();
      } else {
        alert("Erro ao salvar as informações da empresa no servidor.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Falha na comunicação com o servidor.");
    }
  }, [editingCompany]);

  const handleDeleteCompany = async (token: string, companyName: string) => {
    if (!window.confirm(`TEM CERTEZA ABSOLUTA?\nIsso irá deletar a empresa "${companyName}" do banco de dados para sempre!`)) return;

    try {
      const response = await fetch(`${API_URL}${token}/`, { method: 'DELETE' });
      if (response.ok) {
        setCompanies(prev => prev.filter(c => c.access_token !== token));
      } else {
        alert("Erro ao tentar excluir a empresa.");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Falha na comunicação com o servidor.");
    }
  };

  const handleImpersonate = (token: string) => {
    localStorage.setItem('tenant_token', token);
    navigate('/dashboard');
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('is_superadmin');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_token');
    navigate('/admin', { replace: true });
  }, [navigate]);

  const adminUsername = useMemo(() => localStorage.getItem('admin_username') || 'Admin', []);

  const filteredCompanies = useMemo(() => 
    companies.filter((company) =>
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.access_token?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [companies, searchTerm]);

  return (
    <div className="bg-slate-50/50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-3">
              <img src={logo} alt='Logo' className='h-5 w-auto object-contain' />
              Super Admin
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              Gerenciador de Clientes
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Visualize, gerencie e assuma o controle de todas as empresas do SaaS.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => handleOpenModal(null)} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none transition-all duration-300 w-full sm:w-auto justify-center">
              <PlusCircle size={18} strokeWidth={2.5} />
              Nova Empresa
            </button>

            {/* User menu and Logout */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(prev => !prev)} 
                className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-sm">
                  {(adminUsername.charAt(0) || 'A').toUpperCase()}
                </div>
                <span className="font-bold text-sm text-slate-700 hidden md:inline">{adminUsername}</span>
                <ChevronDown size={16} className="text-slate-400 hidden md:inline mr-1" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 z-10">
                  <div className="px-2.5 py-2">
                    <p className="text-xs text-slate-500">Logado como</p>
                    <p className="text-sm font-bold text-slate-800 truncate" title={adminUsername}>{adminUsername}</p>
                  </div>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-md transition-colors focus:outline-none focus:bg-rose-50"
                  >
                    <LogOut size={16} strokeWidth={2.5} />
                    <span>Sair do Painel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 rounded-3xl overflow-hidden transition-all">
          <div className="p-5 sm:px-8 sm:py-6 border-b border-slate-100/80 bg-white/50 backdrop-blur-xl">
            <div className="relative max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 text-slate-400 group-focus-within:text-indigo-500">
                <Search className="h-5 w-5" />
              </div>
              <input type="text" placeholder="Buscar por empresa, cliente ou token..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl leading-5 bg-slate-50/50 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-sm hover:border-slate-300" />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-indigo-600">
                <Loader2 size={36} className="animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Buscando dados da API...</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Empresa</th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Token</th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Vencimento</th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Módulos Ativos</th>
                    <th className="px-8 py-5 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {filteredCompanies.map((company) => {
                    const statusDePagamento = company.payment_status || company.status_pagamento || 'pending';
                    
                    return (
                    <tr key={company.access_token} className={`transition-colors duration-200 ${company.is_active ? 'hover:bg-indigo-50/30' : 'bg-slate-50/50 opacity-60'}`}>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-2xl shadow-sm border ${company.is_active ? 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100/50 text-indigo-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                            {company.is_active ? <Building2 size={22} strokeWidth={1.5} /> : <PowerOff size={22} strokeWidth={1.5} />}
                          </div>
                          <div>
                            <div className={`text-sm font-bold ${company.is_active ? 'text-slate-800' : 'text-slate-500'}`}>{company.name || 'Sem nome'}</div>
                            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                              <User size={13} className="text-slate-400"/> {company.client_name || 'Desconhecido'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-100/80 text-slate-600 border border-slate-200/60 selection:bg-slate-200">
                          {company.access_token}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <StatusBadge status={statusDePagamento} />
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg w-fit border border-slate-100 text-sm text-slate-600">
                          <CalendarClock size={16} className="text-slate-400" />
                          <span className="font-semibold">
                            {company.expiry_date ? new Date(company.expiry_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap justify-center itens-center">
                        <div className="flex items-center gap-1.5 bg-slate-50/80 w-fit p-1 rounded-xl border border-slate-100/50">
                          <div className={`p-2 rounded-lg transition-all ${company.modules?.catalog_mode ? 'bg-white shadow-sm border border-slate-200/60 text-indigo-600' : 'text-slate-300'}`} title="Catálogo Ativo">
                            <BookOpen size={16} strokeWidth={2} />
                          </div>
                          <div className={`p-2 rounded-lg transition-all ${company.modules?.store_mode ? 'bg-white shadow-sm border border-slate-200/60 text-indigo-600' : 'text-slate-300'}`} title="E-commerce Ativo">
                            <ShoppingCart size={16} strokeWidth={2} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2.5">
                          <button onClick={() => handleDeleteCompany(company.access_token, company.name)} className="p-2.5 text-rose-600 bg-white border border-rose-100 shadow-sm hover:bg-rose-600 hover:text-white rounded-xl transition-all focus:outline-none hover:shadow-md hover:shadow-rose-500/20 active:scale-95" title="Deletar Empresa">
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                          
                          <button onClick={() => handleOpenModal(company)} className="p-2.5 text-indigo-600 bg-white border border-indigo-100 shadow-sm hover:bg-indigo-600 hover:text-white rounded-xl transition-all focus:outline-none hover:shadow-md hover:shadow-indigo-500/20 active:scale-95" title="Editar Empresa">
                            <Pencil size={16} strokeWidth={2.5} />
                          </button>
                          
                          <button onClick={() => handleImpersonate(company.access_token)} className="p-2.5 text-emerald-600 bg-white border border-emerald-100 shadow-sm hover:bg-emerald-600 hover:text-white rounded-xl transition-all focus:outline-none hover:shadow-md hover:shadow-emerald-500/20 active:scale-95" title="Acessar Painel do Cliente">
                            <LogIn size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                  
                  {filteredCompanies.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={6} className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                            <Search size={28} className="text-slate-300" />
                          </div>
                          <p className="text-lg font-bold text-slate-700">Nenhuma empresa encontrada</p>
                          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                            Não encontramos nenhum resultado para a sua busca ou o banco de dados está vazio.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <CompanyModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCompany}
        company={editingCompany}
      />
    </div>
  );
}