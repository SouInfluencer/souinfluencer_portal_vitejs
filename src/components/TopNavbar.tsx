import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Bell
} from 'lucide-react';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { useAuth } from '../contexts/AuthContext';

// Enhanced type with more detailed account information
interface Account {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status?: 'online' | 'away' | 'offline';
  department?: string;
}

interface TopNavbarProps {
  toggleSidebar: () => void;
}

// More comprehensive page title mapping
const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/meu-cadastro': 'Meu Cadastro',
  '/configuracoes': 'Configurações',
  '/ajuda': 'Ajuda',
};

export default function TopNavbar({ toggleSidebar }: TopNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get page title with fallback
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  // State management
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  // Refs for managing outside clicks
  const accountSwitcherRef = useRef<HTMLDivElement>(null);

  // Status color mapping
  const getStatusColor = (status?: Account['status']) => {
    switch (status) {
      case 'online': return 'bg-blue-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
        accountSwitcherRef.current &&
        !accountSwitcherRef.current.contains(event.target as Node)
    ) {
      setShowAccountSwitcher(false);
    }
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fallback avatar if not provided
  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`;

  return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side: Menu toggle and page title */}
            <div className="flex items-center gap-4">
              <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                  aria-label="Toggle sidebar"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                {pageTitle}
              </h1>
            </div>

            {/* Right side: Actions and user menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Account Switcher */}
              <div className="relative" ref={accountSwitcherRef}>
                <button
                    className="flex items-center space-x-2 group"
                    onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                >
                  <div className="relative">
                    <img
                        src={userAvatar}
                        alt="User avatar"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-colors"
                    />
                    <div
                        className={`
                      absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 
                      rounded-full border-2 border-white 
                      ${getStatusColor('online')}
                    `}
                    ></div>
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <ChevronDown
                          size={16}
                          className={`
                        text-gray-500 transition-transform duration-200 
                        ${showAccountSwitcher ? 'transform rotate-180' : ''}
                      `}
                      />
                    </div>
                    <p className="text-xs text-gray-500 group-hover:text-gray-700">
                      {user?.profile}
                    </p>
                  </div>
                </button>
              </div>

              {/* More Options Dropdown */}
              <Dropdown
                  trigger={
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  }
              >
                <DropdownItem
                    icon={<User size={16} />}
                    onClick={() => navigate('/meu-cadastro')}
                >
                  Minha Conta
                </DropdownItem>
                <DropdownItem
                    icon={<Settings size={16} />}
                    onClick={() => navigate('/configuracoes')}
                >
                  Configurações
                </DropdownItem>
                <div className="border-t border-gray-100">
                  <DropdownItem
                      icon={<LogOut size={16} />}
                      onClick={handleLogout}
                  >
                    Sair
                  </DropdownItem>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
  );
}
