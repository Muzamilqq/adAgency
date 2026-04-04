// Campaign types
export interface Campaign {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'paused' | 'completed' | 'draft' | 'scheduled';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  roas: number;
}

export interface PerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

// AI Brief Form types
export interface ClientDetails {
  name: string;
  industry: string;
  website: string;
  competitors: string[];
}

export interface CampaignObjective {
  objective: 'awareness' | 'consideration' | 'conversion';
  targetAudience: string;
  budget: number;
  duration: string;
}

export interface CreativePreferences {
  tone: string;
  imageryStyle: string;
  colorDirection: string;
  dos: string[];
  donts: string[];
}

export interface AIBriefData {
  clientDetails: ClientDetails;
  campaignObjective: CampaignObjective;
  creativePreferences: CreativePreferences;
}

// AI Response types
export interface AIRecommendation {
  campaignTitle: string;
  headlines: string[];
  toneOfVoice: string;
  channels: ChannelRecommendation[];
  visualDirection: string;
}

export interface ChannelRecommendation {
  name: string;
  budgetAllocation: number;
  reasoning: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Filter/Sort types
export interface CampaignFilters {
  status?: string;
  client?: string;
  search?: string;
  dateRange?: { start: string; end: string };
}

export interface SortConfig {
  key: keyof Campaign;
  direction: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
