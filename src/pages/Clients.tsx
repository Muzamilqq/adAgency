import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Globe, Users } from 'lucide-react';

// Mock clients data - replace with API call
const mockClients = [
  {
    id: 'cl001',
    name: 'Lumiere Skincare',
    industry: 'Beauty & Personal Care',
    email: 'marketing@lumiere.com',
    website: 'https://lumiere.com',
    activeCampaigns: 2,
    totalSpend: 82450,
  },
  {
    id: 'cl002',
    name: 'TechFlow Inc',
    industry: 'Technology',
    email: 'ads@techflow.io',
    website: 'https://techflow.io',
    activeCampaigns: 1,
    totalSpend: 42100,
  },
  {
    id: 'cl003',
    name: 'GreenLife Products',
    industry: 'Consumer Goods',
    email: 'marketing@greenlife.com',
    website: 'https://greenlife.com',
    activeCampaigns: 0,
    totalSpend: 18750,
  },
  {
    id: 'cl004',
    name: 'FitPro Athletics',
    industry: 'Sports & Fitness',
    email: 'growth@fitpro.com',
    website: 'https://fitpro.com',
    activeCampaigns: 0,
    totalSpend: 44800,
  },
  {
    id: 'cl005',
    name: 'LuxStay Hotels',
    industry: 'Hospitality',
    email: 'marketing@luxstay.com',
    website: 'https://luxstay.com',
    activeCampaigns: 1,
    totalSpend: 28500,
  },
];

export function Clients() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout, user } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Sidebar isDarkMode={isDarkMode} user={user} />
      
      <div className="lg:ml-64">
        <Header 
          isDarkMode={isDarkMode} 
          onDarkModeToggle={toggleDarkMode}
          onLogout={logout}
          user={user}
        />
        
        <main className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Clients
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Manage your client accounts
            </p>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockClients.map((client) => (
              <Card 
                key={client.id}
                className={`
                  transition-all duration-200 hover:shadow-lg cursor-pointer
                  ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
                `}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'}
                    `}>
                      <Building2 className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${client.activeCampaigns > 0 
                        ? 'bg-green-100 text-green-700' 
                        : isDarkMode 
                          ? 'bg-slate-700 text-slate-400'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {client.activeCampaigns} active
                    </div>
                  </div>
                  <CardTitle className={`mt-4 ${isDarkMode ? 'text-white' : ''}`}>
                    {client.name}
                  </CardTitle>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {client.industry}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                      {client.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                      {client.website}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                      Total Spend: {formatCurrency(client.totalSpend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
