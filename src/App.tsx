import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Settings,
  Bell,
  Plus
} from 'lucide-react';
import { ViewType, Subscription, DashboardStats, Category } from './types';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import Analytics from './components/Analytics';
import SettingsPanel from './components/SettingsPanel';
import SubscriptionModal from './components/SubscriptionModal';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [subs, dashboardStats, cats] = await Promise.all([
        invoke<Subscription[]>('get_subscriptions'),
        invoke<DashboardStats>('get_dashboard_stats'),
        invoke<Category[]>('get_categories'),
      ]);
      setSubscriptions(subs);
      setStats(dashboardStats);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSub = await invoke<Subscription>('add_subscription', { subscription });
      setSubscriptions([...subscriptions, newSub]);
      await refreshStats();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add subscription:', error);
      alert('添加订阅失败: ' + error);
    }
  };

  const handleUpdateSubscription = async (id: string, subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updated = await invoke<Subscription>('update_subscription', { id, subscription });
      setSubscriptions(subscriptions.map(s => s.id === id ? updated : s));
      await refreshStats();
      setIsModalOpen(false);
      setEditingSubscription(null);
    } catch (error) {
      console.error('Failed to update subscription:', error);
      alert('更新订阅失败: ' + error);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('确定要删除这个订阅吗？')) return;
    
    try {
      await invoke('delete_subscription', { id });
      setSubscriptions(subscriptions.filter(s => s.id !== id));
      await refreshStats();
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      alert('删除订阅失败: ' + error);
    }
  };

  const refreshStats = async () => {
    try {
      const newStats = await invoke<DashboardStats>('get_dashboard_stats');
      setStats(newStats);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  const openAddModal = () => {
    setEditingSubscription(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const navItems = [
    { id: 'dashboard' as ViewType, label: '概览', icon: LayoutDashboard },
    { id: 'subscriptions' as ViewType, label: '订阅', icon: CreditCard },
    { id: 'analytics' as ViewType, label: '分析', icon: BarChart3 },
    { id: 'settings' as ViewType, label: '设置', icon: Settings },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard stats={stats} subscriptions={subscriptions} categories={categories} onAddClick={openAddModal} />;
      case 'subscriptions':
        return (
          <SubscriptionList 
            subscriptions={subscriptions} 
            categories={categories}
            onEdit={openEditModal}
            onDelete={handleDeleteSubscription}
          />
        );
      case 'analytics':
        return <Analytics stats={stats} subscriptions={subscriptions} categories={categories} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SubTrack</h1>
              <p className="text-xs text-gray-500">订阅管理助手</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={openAddModal}
            className="w-full btn-primary gap-2"
          >
            <Plus className="w-5 h-5" />
            添加订阅
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {navItems.find(item => item.id === currentView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              {stats && stats.upcoming_renewals > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="fade-in">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSubscription(null);
          }}
          onSubmit={editingSubscription 
            ? (data) => handleUpdateSubscription(editingSubscription.id, data)
            : handleAddSubscription
          }
          subscription={editingSubscription}
          categories={categories}
        />
      )}
    </div>
  );
}

export default App;
