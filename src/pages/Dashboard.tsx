// Dashboard page - Main analytics and campaign overview
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { KPICard } from '@/components/KPICard';
import { PerformanceChart } from '@/components/PerformanceChart';
import { CampaignTable } from '@/components/CampaignTable';
import { DateRangePicker } from '@/components/DateRangePicker';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useAuth } from '@/hooks/useAuth';
import campaignsData from '@/data/campaigns.json';
import { 
  Eye, 
  MousePointer, 
  Target, 
  TrendingUp, 
  DollarSign, 
  BarChart3 
} from 'lucide-react';

export function Dashboard() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout, user } = useAuth();
  const {
    campaigns,
    isLoading,
    filters,
    sortConfig,
    uniqueClients,
    kpis,
    toggleSort,
    updateFilters,
    clearFilters,
  } = useCampaigns();

  // Handle date range change
  const handleDateRangeChange = (range: { start: string; end: string } | undefined) => {
    updateFilters({ dateRange: range });
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar isDarkMode={isDarkMode} user={user} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header 
          isDarkMode={isDarkMode} 
          onDarkModeToggle={toggleDarkMode}
          onLogout={logout}
          user={user}
        />

        {/* Page Content */}
        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Overview of your advertising campaigns
              </p>
            </div>
            <DateRangePicker 
              onChange={handleDateRangeChange}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <KPICard
              title="Impressions"
              value={kpis.impressions}
              change={12.5}
              icon={Eye}
              isDarkMode={isDarkMode}
              format="number"
            />
            <KPICard
              title="Clicks"
              value={kpis.clicks}
              change={8.3}
              icon={MousePointer}
              isDarkMode={isDarkMode}
              format="number"
            />
            <KPICard
              title="CTR"
              value={kpis.ctr}
              change={-2.1}
              icon={BarChart3}
              isDarkMode={isDarkMode}
              format="percentage"
            />
            <KPICard
              title="Conversions"
              value={kpis.conversions}
              change={15.7}
              icon={Target}
              isDarkMode={isDarkMode}
              format="number"
            />
            <KPICard
              title="Spend"
              value={kpis.spend}
              change={5.2}
              icon={DollarSign}
              isDarkMode={isDarkMode}
              format="currency"
            />
            <KPICard
              title="ROAS"
              value={kpis.roas}
              change={7.8}
              icon={TrendingUp}
              isDarkMode={isDarkMode}
              format="number"
            />
          </div>

          {/* Performance Chart */}
          <div className={`
            rounded-lg border p-6 mb-6
            ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
          `}>
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Performance Trends (30 Days)
            </h2>
            <PerformanceChart 
              data={campaignsData.performanceData}
              isDarkMode={isDarkMode}
              metrics={['impressions', 'clicks', 'conversions']}
            />
          </div>

          {/* Campaigns Table */}
          <div className={`
            rounded-lg border p-6
            ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
          `}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Campaigns
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
