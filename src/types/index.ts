export interface Subscription {
  id: string;
  name: string;
  description?: string;
  category: string;
  billing_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  cost: number;
  currency: string;
  start_date: string;
  next_billing_date: string;
  payment_method?: string;
  website?: string;
  notes?: string;
  color?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CategoryStat {
  category: string;
  amount: number;
  percentage: number;
}

export interface DashboardStats {
  total_monthly: number;
  total_yearly: number;
  active_subscriptions: number;
  upcoming_renewals: number;
  category_breakdown: CategoryStat[];
}

export type ViewType = 'dashboard' | 'subscriptions' | 'analytics' | 'settings';

export const CURRENCIES = [
  { code: 'CNY', symbol: '¥', name: '人民币' },
  { code: 'USD', symbol: '$', name: '美元' },
  { code: 'EUR', symbol: '€', name: '欧元' },
  { code: 'GBP', symbol: '£', name: '英镑' },
  { code: 'JPY', symbol: '¥', name: '日元' },
  { code: 'KRW', symbol: '₩', name: '韩元' },
  { code: 'HKD', symbol: '$', name: '港币' },
  { code: 'TWD', symbol: 'NT$', name: '新台币' },
] as const;

export const BILLING_CYCLES = [
  { value: 'weekly', label: '每周', multiplier: 4.33 },
  { value: 'monthly', label: '每月', multiplier: 1 },
  { value: 'quarterly', label: '每季度', multiplier: 0.33 },
  { value: 'yearly', label: '每年', multiplier: 0.083 },
] as const;
