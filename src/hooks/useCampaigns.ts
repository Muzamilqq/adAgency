import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Campaign, CampaignFilters, SortConfig } from '@/types';
import campaignsData from '@/data/campaigns.json';

// Custom hook for campaign data management
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);

  // Load campaigns from mock data
  useEffect(() => {
    // Simulate API call
    const loadCampaigns = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setCampaigns(campaignsData.campaigns as Campaign[]);
      setIsLoading(false);
    };

    loadCampaigns();
  }, []);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      // Status filter
      if (filters.status && campaign.status !== filters.status) {
        return false;
      }

      // Client filter
      if (filters.client && campaign.client !== filters.client) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = campaign.name.toLowerCase().includes(searchLower);
        const matchesClient = campaign.client.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesClient) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange) {
        const campaignStart = new Date(campaign.startDate);
        const campaignEnd = new Date(campaign.endDate);
        const filterStart = new Date(filters.dateRange.start);
        const filterEnd = new Date(filters.dateRange.end);

        if (campaignEnd < filterStart || campaignStart > filterEnd) {
          return false;
        }
      }

      return true;
    });
  }, [campaigns, filters]);

  // Sort campaigns
  const sortedCampaigns = useMemo(() => {
    const sorted = [...filteredCampaigns];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCampaigns, sortConfig]);

  // Toggle sort
  const toggleSort = useCallback((key: keyof Campaign) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<CampaignFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get unique clients for filter dropdown
  const uniqueClients = useMemo(() => {
    const clients = new Set(campaigns.map(c => c.client));
    return Array.from(clients).sort();
  }, [campaigns]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    
    const totalImpressions = activeCampaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = activeCampaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = activeCampaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalBudget = activeCampaigns.reduce((sum, c) => sum + c.budget, 0);
    
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgRoas = activeCampaigns.length > 0 
      ? activeCampaigns.reduce((sum, c) => sum + c.roas, 0) / activeCampaigns.length 
      : 0;

    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      ctr,
      conversions: totalConversions,
      spend: totalSpend,
      budget: totalBudget,
      roas: avgRoas,
      activeCount: activeCampaigns.length,
    };
  }, [campaigns]);

  return {
    campaigns: sortedCampaigns,
    allCampaigns: campaigns,
    isLoading,
    filters,
    sortConfig,
    uniqueClients,
    kpis,
    toggleSort,
    updateFilters,
    clearFilters,
  };
}
