import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { CampaignTable } from '@/components/CampaignTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function CampaignsPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout, user } = useAuth();
  const {
    campaigns,
    isLoading,
    filters,
    sortConfig,
    uniqueClients,
    toggleSort,
    updateFilters,
    clearFilters,
  } = useCampaigns();

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Campaigns
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Manage and track all your campaigns
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>

          {/* Campaigns Table */}
          <div className={`
            rounded-lg border p-6
            ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
          `}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                All Campaigns
              </h2>
              <button
                onClick={clearFilters}
                className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
              >
                Clear filters
              </button>
            </div>
            <CampaignTable
              campaigns={campaigns}
              filters={filters}
              sortConfig={sortConfig}
              uniqueClients={uniqueClients}
              isDarkMode={isDarkMode}
              onFilterChange={updateFilters}
              onSort={toggleSort}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
