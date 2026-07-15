import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminCompanies from '../pages/SuperAdminCompanies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/superadmin/companies" replace />} />
        <Route path="/superadmin/companies" element={<SuperAdminCompanies />} />
        <Route path="/dashboard" element={<SuperAdminCompanies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;