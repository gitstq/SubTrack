import { useMemo } from 'react';
import { TrendingUp, PieChart, Calendar, DollarSign } from 'lucide-react';
import { Subscription, DashboardStats, Category } from '../types';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface AnalyticsProps {
  stats: DashboardStats | null;
  subscriptions: Subscription[];
  categories: Category[];
}

export default function Analytics({ stats, subscriptions, categories }: AnalyticsProps) {
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
    return categories.find(c => c.id === categoryId) || { name: categoryId, color: '#6B7280' };
  };

  // Calculate monthly spending trend
  const monthlyTrend = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTotal = subscriptions
        .filter(s => s.active)
        .reduce((total, sub) => {
          const subStart = parseISO(sub.start_date);
          if (subStart <= monthEnd) {
            const monthlyCost = (() => {
              switch (sub.billing_cycle) {
                case 'monthly': return sub.cost;
                case 'yearly': return sub.cost / 12;
                case 'quarterly': return sub.cost / 3;
                case 'weekly': return sub.cost * 4.33;
                default: return sub.cost;
              }
            })();
            return total + monthlyCost;
          }
          return total;
        }, 0);

      return {
        month: format(month, 'yyyy年MM月', { locale: zhCN }),
        amount: monthTotal,
      };
    });
  }, [subscriptions]);

  // Calculate top subscriptions by cost
  const topSubscriptions = useMemo(() => {
    return [...subscriptions]
      .filter(s => s.active)
      .sort((a, b) => {
        const aMonthly = (() => {
          switch (a.billing_cycle) {
            case 'monthly': return a.cost;
            case 'yearly': return a.cost / 12;
            case 'quarterly': return a.cost / 3;
            case 'weekly': return a.cost * 4.33;
            default: return a.cost;
          }
        })();
        const bMonthly = (() => {
          switch (b.billing_cycle) {
            case 'monthly': return b.cost;
            case 'yearly': return b.cost / 12;
            case 'quarterly': return b.cost / 3;
            case 'weekly': return b.cost * 4.33;
            default: return b.cost;
          }
        })();
        return bMonthly - aMonthly;
      })
      .slice(0, 10);
  }, [subscriptions]);

  // Calculate yearly projection
  const yearlyProjection = useMemo(() => {
    return stats?.total_yearly || 0;
  }, [stats]);

  const maxMonthly = Math.max(...monthlyTrend.map(m => m.amount), 1);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">年度预计支出</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(yearlyProjection)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均月支出</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency((stats?.total_yearly || 0) / 12)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">订阅分类数</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.category_breakdown.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend Chart */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">月度支出趋势</h3>
          </div>

          <div className="space-y-4">
            {monthlyTrend.map((item, index) => {
              const percentage = (item.amount / maxMonthly) * 100;
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-24 shrink-0">{item.month}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    >
                      {percentage > 20 && (
                        <span className="text-xs text-white font-medium">
                          {formatCurrency(item.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-20 text-right">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Subscriptions */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">支出排行</h3>
          </div>

          <div className="space-y-3">
            {topSubscriptions.map((sub, index) => {
              const cat = getCategoryInfo(sub.category);
              const monthlyCost = (() => {
                switch (sub.billing_cycle) {
                  case 'monthly': return sub.cost;
                  case 'yearly': return sub.cost / 12;
                  case 'quarterly': return sub.cost / 3;
                  case 'weekly': return sub.cost * 4.33;
                  default: return sub.cost;
                }
              })();

              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-bold text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: sub.color || cat.color }}
                  >
                    {sub.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{sub.name}</p>
                    <p className="text-xs text-gray-500">{cat.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(monthlyCost)}/月
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(sub.cost, sub.currency)}/{sub.billing_cycle === 'monthly' ? '月' : sub.billing_cycle === 'yearly' ? '年' : '期'}
                    </p>
                  </div>
                </div>
              );
            })}

            {topSubscriptions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>暂无订阅数据</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">分类支出分布</h3>

        {stats && stats.category_breakdown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.category_breakdown.map((item, index) => {
              const cat = getCategoryInfo(item.category);
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <span className="text-xl font-bold" style={{ color: cat.color }}>
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.amount)}/月
                    </p>
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

      {/* Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">智能洞察</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-600 font-medium mb-1">支出建议</p>
            <p className="text-sm text-blue-800">
              您当前每月订阅支出为 {formatCurrency(stats?.total_monthly || 0)}，
              建议定期审查不常用的订阅服务以节省开支。
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-green-600 font-medium mb-1">年度预算</p>
            <p className="text-sm text-green-800">
              按当前订阅计算，您每年将支出约 {formatCurrency(yearlyProjection)}。
              建议设置预算上限以控制订阅开销。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
