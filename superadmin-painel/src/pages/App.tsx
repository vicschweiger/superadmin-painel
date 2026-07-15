import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminCompanies from '../pages/SuperAdminCompanies.tsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superadmin/companies" replace />} />
      <Route path="/superadmin/companies" element={<SuperAdminCompanies />} />
      <Route path="/dashboard" element={<SuperAdminCompanies />} />
    </Routes>
  );
}

export default App;