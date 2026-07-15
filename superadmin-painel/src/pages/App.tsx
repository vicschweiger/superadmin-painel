import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminCompanies from './pages/SuperAdminCompanies';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superadmin/companies" replace />} />
      <Route path="/superadmin/companies" element={<SuperAdminCompanies />} />
      <Route path="/dashboard" element={<ClientDashboard />} />
    </Routes>
  );
}

export default App;