import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Subscription, Category } from '../types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  categories: Category[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionList({ subscriptions, categories, onEdit, onDelete }: SubscriptionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'date'>('date');

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || { name: categoryId, color: '#6B7280' };
  };

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

  const getBillingCycleLabel = (cycle: string) => {
    const labels: Record<string, string> = {
      weekly: '每周',
      monthly: '每月',
      quarterly: '每季度',
      yearly: '每年',
    };
    return labels[cycle] || cycle;
  };

  const getDaysUntilRenewal = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return differenceInDays(date, new Date());
    } catch {
      return null;
    }
  };

  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term)
      );
    }

    if (filterCategory !== 'all') {
      result = result.filter(s => s.category === filterCategory);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cost':
          return b.cost - a.cost;
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [subscriptions, searchTerm, filterCategory, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索订阅..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select w-40"
          >
            <option value="all">全部分类</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'cost' | 'date')}
            className="select w-32"
          >
            <option value="date">最新添加</option>
            <option value="name">名称</option>
            <option value="cost">价格</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        共 {filteredSubscriptions.length} 个订阅
      </div>

      {/* Subscription Grid */}
      {filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((sub) => {
            const cat = getCategoryInfo(sub.category);
            const daysUntil = getDaysUntilRenewal(sub.next_billing_date);

            return (
              <div
                key={sub.id}
                className="card hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: sub.color || cat.color }}
                    >
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${cat.color}20`,
                          color: cat.color
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(sub)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(sub.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(sub.cost, sub.currency)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getBillingCycleLabel(sub.billing_cycle)}
                    </span>
                  </div>

                  {sub.description && (
                    <p className="text-sm text-gray-500">{sub.description}</p>
                  )}

                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        下次续费: {format(parseISO(sub.next_billing_date), 'MM月dd日', { locale: zhCN })}
                      </span>
                    </div>

                    {daysUntil !== null && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          daysUntil <= 3
                            ? 'bg-red-100 text-red-700'
                            : daysUntil <= 7
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                        }`}>
                          {daysUntil === 0
                            ? '今天到期'
                            : daysUntil === 1
                              ? '明天到期'
                              : `${daysUntil}天后到期`
                          }
                        </span>
                      </div>
                    )}

                    {sub.payment_method && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CreditCard className="w-4 h-4" />
                        <span>{sub.payment_method}</span>
                      </div>
                    )}
                  </div>

                  {sub.website && (
                    <a
                      href={sub.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      访问网站
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到订阅</h3>
          <p className="text-gray-500">尝试调整搜索条件或添加新订阅</p>
        </div>
      )}
    </div>
  );
}
