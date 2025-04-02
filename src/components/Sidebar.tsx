import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Trophy,
  LayoutDashboard,
  UserCog,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Define a more comprehensive menu item type
interface MenuItem {
  icon: React.ComponentType<{ size?: string | number, className?: string }>;
  text: string;
  path: string;
  section?: 'main' | 'secondary';
  requiredPermission?: string; // For future permission-based rendering
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Expanded menu items with sections
const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    text: 'Dashboard',
    path: '/dashboard',
    section: 'main'
  },
  {
    icon: UserCog,
    text: 'Meu Cadastro',
    path: '/meu-cadastro',
    section: 'main'
  },
  {
    icon: Settings,
    text: 'Configurações',
    path: '/configuracoes',
    section: 'secondary'
  },
  {
    icon: HelpCircle,
    text: 'Ajuda',
    path: '/ajuda',
    section: 'secondary'
  }
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Enhanced navigation handler with optional close on mobile
  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine if a menu item is active
  const isActiveMenuItem = (itemPath: string) => {
    return location.pathname === itemPath ||
        (itemPath !== '/dashboard' && location.pathname.startsWith(itemPath));
  };

  // Render menu items grouped by section
  const renderMenuSection = (section: 'main' | 'secondary') => {
    return menuItems
        .filter(item => item.section === section)
        .map((item) => (
            <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
            flex items-center space-x-3 w-full p-3 rounded transition-colors 
            ${isActiveMenuItem(item.path)
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-700 hover:text-white'}
          `}
            >
              <item.icon size={20} />
              <span className="whitespace-nowrap">{item.text}</span>
            </button>
        ));
  };

  return (
      <>
        {/* Overlay for mobile */}
        <div
            className={`
          fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden 
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
            onClick={toggleSidebar}
        />

        {/* Sidebar */}
        <aside
            className={`
          fixed top-0 left-0 h-full w-64 bg-blue-800 text-white 
          transform transition-transform duration-300 ease-in-out 
          z-50 lg:relative lg:translate-x-0 flex flex-col shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        >
          {/* Header */}
          <div className="p-5 border-b border-blue-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy size={24} />
              <h2 className="text-2xl font-bold">Template</h2>
            </div>
            {/* Optional close button for mobile */}
            <button
                className="lg:hidden"
                onClick={toggleSidebar}
                aria-label="Fechar menu"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Main Menu Section */}
          <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent hover:scrollbar-thumb-blue-600">
            <nav className="px-4 space-y-1">
              <div className="mb-2 px-3 text-blue-200 text-xs uppercase font-semibold">
                Menu Principal
              </div>
              {renderMenuSection('main')}
            </nav>

            {/* Secondary Menu Section */}
            <nav className="px-4 space-y-1 mt-4">
              <div className="mb-2 px-3 text-blue-200 text-xs uppercase font-semibold">
                Configurações
              </div>
              {renderMenuSection('secondary')}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-700">
            <button
                className="
              flex items-center space-x-3 w-full p-3 rounded
              hover:bg-blue-700 transition-colors text-left
            "
                onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </aside>
      </>
  );
}
