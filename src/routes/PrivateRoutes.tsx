import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../pages/Dashboard';
import MeuCadastro from '../pages/MeuCadastro';
import {NotificationProvider} from "../components/ui/NotificationProvider.tsx";

export function PrivateRoutes() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <NotificationProvider>
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar 
          toggleSidebar={toggleSidebar} 
        />

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-0 md:p-4 lg:p-6">
          <div className="bg-white rounded-xl shadow-sm h-full overflow-y-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meu-cadastro" element={<MeuCadastro />} />
              
              {/* Default redirect for authenticated routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
      </NotificationProvider>
  );
}
