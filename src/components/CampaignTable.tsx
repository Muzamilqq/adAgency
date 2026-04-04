import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from './StatusBadge';
import type { Campaign, CampaignFilters, SortConfig } from '@/types';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CampaignTableProps {
  campaigns: Campaign[];
  filters: CampaignFilters;
  sortConfig: SortConfig;
  uniqueClients: string[];
  isDarkMode: boolean;
  onFilterChange: (filters: Partial<CampaignFilters>) => void;
  onSort: (key: keyof Campaign) => void;
}

export function CampaignTable({
  campaigns,
  filters,
  sortConfig,
  uniqueClients,
  isDarkMode,
  onFilterChange,
  onSort,
}: CampaignTableProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFilterChange({ search: value });
  };

  // Get sort icon
  const getSortIcon = (key: keyof Campaign) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4" /> 
      : <ArrowDown className="w-4 h-4" />;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number
  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Calculate CTR
  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return '0.00%';
    return `${((clicks / impressions) * 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search campaigns or clients..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`
              pl-10
              ${isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                : 'bg-white border-gray-200'
              }
            `}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => onFilterChange({ status: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className={`w-[140px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : ''}`}>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>

        {/* Client Filter */}
        <Select
          value={filters.client || 'all'}
          onValueChange={(value) => onFilterChange({ client: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className={`w-[180px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : ''}`}>
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {uniqueClients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className={`
        rounded-lg border overflow-hidden
        ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}
      `}>
        <Table>
          <TableHeader>
            <TableRow className={isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50/50'}>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSort('name')}
                  className="flex items-center gap-1"
                >
                  Campaign
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSort('client')}
                  className="flex items-center gap-1"
                >
                  Client
                  {getSortIcon('client')}
                </Button>
              </TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSort('status')}
                  className="flex items-center gap-1"
                >
                  Status
                  {getSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSort('budget')}
                  className="flex items-center gap-1"
                >
                  Budget
                  {getSortIcon('budget')}
                </Button>
              </TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSort('spend')}
                  className="flex items-center gap-1"
                >
                  Spend
                  {getSortIcon('spend')}
                </Button>
              </TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>CTR</TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSort('conversions')}
                  className="flex items-center gap-1"
                >
                  Conv.
                  {getSortIcon('conversions')}
                </Button>
              </TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSort('roas')}
                  className="flex items-center gap-1"
                >
                  ROAS
                  {getSortIcon('roas')}
                </Button>
              </TableHead>
              <TableHead className={isDarkMode ? 'text-slate-300' : ''}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={9} 
                  className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}
                >
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow 
                  key={campaign.id}
                  className={isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}
                >
                  <TableCell className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>
                    {campaign.name}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-slate-300' : ''}>
                    {campaign.client}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={campaign.status} />
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-slate-300' : ''}>
                    {formatCurrency(campaign.budget)}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-slate-300' : ''}>
                    {formatCurrency(campaign.spend)}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-slate-300' : ''}>
                    {calculateCTR(campaign.clicks, campaign.impressions)}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-slate-300' : ''}>
                    {formatNumber(campaign.conversions)}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-slate-300' : ''}>
                    {campaign.roas > 0 ? `${campaign.roas.toFixed(1)}x` : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
        Showing {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
