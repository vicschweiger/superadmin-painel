import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/grimlogo.png';
import { Lock, User, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function SuperAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://web-production-6e1d8.up.railway.app/api/superadmin/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const rawText = await response.text();
      let data: any = {};
      
      try {
          data = JSON.parse(rawText);
      } catch (parseError) {
          throw new Error("Erro de resposta do servidor.");
      }

      if (response.ok) {
        localStorage.setItem('is_superadmin', 'true');
        localStorage.setItem('admin_username', data.username || username);
        
        if (data.admin_token) {
           localStorage.setItem('admin_token', data.admin_token);
        }

        navigate('/superadmin/companies', { replace: true }); 
      } else {
        setError(data.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Falha na comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-auto w-50 bg-white p-1 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
             <img src={logo} alt="Logo" className="" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
          Super Admin
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-slate-100/80">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-1.5">Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
                  placeholder="Seu usuário admin"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-indigo-600 focus:outline-none">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 p-4 border border-rose-100 flex items-center text-sm font-medium text-rose-800">
                <ShieldCheck className="h-5 w-5 mr-2 text-rose-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-500/40 transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : 'Acessar Painel Central'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}