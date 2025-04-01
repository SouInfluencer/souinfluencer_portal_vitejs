import React from 'react';
import { 
  LayoutGrid, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Zap 
} from 'lucide-react';

// Define a type for dashboard card data
interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change: number;
  color: string;
}

// Dashboard card component
const DashboardCard: React.FC<DashboardCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  color 
}) => {
  const isPositive = change >= 0;

  return (
    <div className={`
      bg-white rounded-lg shadow-md p-6 
      transform transition-all duration-300 
      hover:scale-105 hover:shadow-xl
      border-l-4 ${color}
    `}>
      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className={`
          text-sm font-medium 
          ${isPositive ? 'text-green-600' : 'text-red-600'}
        `}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};

// Dashboard main component
const Dashboard: React.FC = () => {
  // Sample dashboard card data
  const dashboardCards: DashboardCardProps[] = [
    {
      icon: LayoutGrid,
      title: 'Total de Campanhas',
      value: '42',
      change: 12.5,
      color: 'border-blue-500 text-blue-500'
    },
    {
      icon: Users,
      title: 'Novos Seguidores',
      value: '1,256',
      change: 8.2,
      color: 'border-green-500 text-green-500'
    },
    {
      icon: DollarSign,
      title: 'Receita Total',
      value: 'R$ 45,230',
      change: 15.7,
      color: 'border-purple-500 text-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Engajamento',
      value: '68%',
      change: 5.3,
      color: 'border-orange-500 text-orange-500'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Visão geral do seu desempenho como influenciador
        </p>
      </header>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-indigo-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-800">
                Nova Campanha
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Inicie uma nova campanha de marketing
            </p>
            <button className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition-colors">
              Criar Campanha
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-800">
                Análise de Desempenho
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Visualize seus principais indicadores
            </p>
            <button className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors">
              Ver Relatórios
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-800">
                Gerenciar Seguidores
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Gerencie sua base de seguidores
            </p>
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
              Gerenciar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
