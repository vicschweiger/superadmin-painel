import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminCompanies from '../pages/SuperAdminCompanies.tsx';
import SuperAdminLogin from '../pages/SuperAdminLogin.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<SuperAdminLogin />} />
        <Route path="/" element={<Navigate to="/superadmin/companies" replace />} />
        <Route path="/superadmin/companies" element={<SuperAdminCompanies />} />
        <Route path="/dashboard" element={<SuperAdminCompanies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;