import { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, Globe, FileText, Tag, DollarSign } from 'lucide-react';
import { Subscription, Category, CURRENCIES, BILLING_CYCLES } from '../types';
import { format, addMonths, addYears, addWeeks, addQuarters } from 'date-fns';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => void;
  subscription: Subscription | null;
  categories: Category[];
}

const COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6',
  '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
  '#F43F5E', '#6B7280', '#374151',
];

export default function SubscriptionModal({ isOpen, onClose, onSubmit, subscription, categories }: SubscriptionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: categories[0]?.id || 'streaming',
    billing_cycle: 'monthly' as const,
    cost: '',
    currency: 'CNY',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    next_billing_date: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    payment_method: '',
    website: '',
    notes: '',
    color: COLORS[0],
    active: true,
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        description: subscription.description || '',
        category: subscription.category,
        billing_cycle: subscription.billing_cycle as any,
        cost: subscription.cost.toString(),
        currency: subscription.currency,
        start_date: subscription.start_date.split('T')[0],
        next_billing_date: subscription.next_billing_date.split('T')[0],
        payment_method: subscription.payment_method || '',
        website: subscription.website || '',
        notes: subscription.notes || '',
        color: subscription.color || COLORS[0],
        active: subscription.active,
      });
    }
  }, [subscription]);

  const handleBillingCycleChange = (cycle: string) => {
    const startDate = new Date(formData.start_date);
    let nextDate = startDate;

    switch (cycle) {
      case 'weekly':
        nextDate = addWeeks(startDate, 1);
        break;
      case 'monthly':
        nextDate = addMonths(startDate, 1);
        break;
      case 'quarterly':
        nextDate = addQuarters(startDate, 1);
        break;
      case 'yearly':
        nextDate = addYears(startDate, 1);
        break;
    }

    setFormData(prev => ({
      ...prev,
      billing_cycle: cycle as any,
      next_billing_date: format(nextDate, 'yyyy-MM-dd'),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('请输入订阅名称');
      return;
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      alert('请输入有效的金额');
      return;
    }

    onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category,
      billing_cycle: formData.billing_cycle,
      cost: parseFloat(formData.cost),
      currency: formData.currency,
      start_date: new Date(formData.start_date).toISOString(),
      next_billing_date: new Date(formData.next_billing_date).toISOString(),
      payment_method: formData.payment_method || undefined,
      website: formData.website || undefined,
      notes: formData.notes || undefined,
      color: formData.color,
      active: formData.active,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {subscription ? '编辑订阅' : '添加订阅'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">基本信息</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    订阅名称 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例如：Netflix"
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="例如：标准会员"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">颜色标识</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">价格信息</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    金额 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="0.00"
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">货币</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="select"
                  >
                    {CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">计费周期</label>
                  <select
                    value={formData.billing_cycle}
                    onChange={(e) => handleBillingCycleChange(e.target.value)}
                    className="select"
                  >
                    {BILLING_CYCLES.map(cycle => (
                      <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">时间设置</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">下次续费日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.next_billing_date}
                      onChange={(e) => setFormData({ ...formData, next_billing_date: e.target.value })}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">附加信息</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">支付方式</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      placeholder="例如：支付宝、信用卡"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">网站链接</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://..."
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="添加备注信息..."
                      rows={3}
                      className="input pl-10 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                启用此订阅
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            {subscription ? '保存修改' : '添加订阅'}
          </button>
        </div>
      </div>
    </div>
  );
}
