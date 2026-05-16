import { useMemo } from 'react';
import { 
  Wallet, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  Plus,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Subscription, DashboardStats, Category } from '../types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DashboardProps {
  stats: DashboardStats | null;
  subscriptions: Subscription[];
  categories: Category[];
  onAddClick: () => void;
}

export default function Dashboard({ stats, subscriptions, categories, onAddClick }: DashboardProps) {
  const formatCurrency = (amount: number, currency: string = 'CNY') => {
    const symbols: Record<string, string> = {
      CNY: '¥',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || { name: categoryId, color: '#6B7280', icon: 'Circle' };
  };

  const upcomingRenewals = useMemo(() => {
    return subscriptions
      .filter(s => s.active)
      .map(s => ({
        ...s,
        daysUntil: differenceInDays(parseISO(s.next_billing_date), new Date())
      }))
      .filter(s => s.daysUntil >= 0 && s.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5);
  }, [subscriptions]);

  const statCards = [
    {
      title: '月度支出',
      value: stats ? formatCurrency(stats.total_monthly) : '¥0.00',
      subtitle: '本月预计',
      icon: Wallet,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: '年度支出',
      value: stats ? formatCurrency(stats.total_yearly) : '¥0.00',
      subtitle: '全年预计',
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: null,
    },
    {
      title: '活跃订阅',
      value: stats?.active_subscriptions.toString() || '0',
      subtitle: '个订阅服务',
      icon: CreditCard,
      color: 'bg-purple-500',
      trend: null,
    },
    {
      title: '即将续费',
      value: stats?.upcoming_renewals.toString() || '0',
      subtitle: '7天内到期',
      icon: Calendar,
      color: 'bg-orange-500',
      trend: null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                </div>
                <div className={`${card.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              {card.trend && (
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <span className="text-green-600 font-medium">{card.trend}</span>
                  <span className="text-gray-400">较上月</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">支出分类</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {stats && stats.category_breakdown.length > 0 ? (
            <div className="space-y-4">
              {stats.category_breakdown.map((item, index) => {
                const cat = getCategoryInfo(item.category);
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{cat.name}</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: cat.color 
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>暂无分类数据</p>
            </div>
          )}
        </div>

        {/* Upcoming Renewals */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">即将续费</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          {upcomingRenewals.length > 0 ? (
            <div className="space-y-4">
              {upcomingRenewals.map((sub) => {
                const cat = getCategoryInfo(sub.category);
                return (
                  <div key={sub.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <span 
                        className="text-sm font-bold"
                        style={{ color: cat.color }}
                      >
                        {sub.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{sub.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(sub.cost, sub.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        sub.daysUntil <= 3 
                          ? 'bg-red-100 text-red-700' 
                          : sub.daysUntil <= 7 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {sub.daysUntil === 0 
                          ? '今天' 
                          : sub.daysUntil === 1 
                            ? '明天' 
                            : `${sub.daysUntil}天后`
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">暂无即将到期的订阅</p>
              <p className="text-sm text-gray-400">所有订阅都在安全期内</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onAddClick}
            className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-primary-900">添加订阅</p>
              <p className="text-sm text-primary-600">记录新的订阅服务</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-green-900">查看报告</p>
              <p className="text-sm text-green-600">分析支出趋势</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-purple-900">预算设置</p>
              <p className="text-sm text-purple-600">管理月度预算</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
