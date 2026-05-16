import { useState } from 'react';
import { 
  Globe, 
  Bell, 
  Database, 
  Shield, 
  Info,
  ChevronRight,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';

export default function SettingsPanel() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [notifications, setNotifications] = useState({
    renewalReminders: true,
    budgetAlerts: true,
    priceChanges: false,
  });
  const [currency, setCurrency] = useState('CNY');
  const [language, setLanguage] = useState('zh-CN');

  const settingsGroups = [
    {
      title: '外观',
      icon: Sun,
      items: [
        {
          label: '主题模式',
          description: '选择您喜欢的界面主题',
          control: (
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    theme === t
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t === 'light' ? '浅色' : t === 'dark' ? '深色' : '跟随系统'}
                </button>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: '通知',
      icon: Bell,
      items: [
        {
          label: '续费提醒',
          description: '在订阅到期前发送提醒',
          control: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.renewalReminders}
                onChange={(e) => setNotifications({ ...notifications, renewalReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          ),
        },
        {
          label: '预算警报',
          description: '当支出接近预算上限时提醒',
          control: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.budgetAlerts}
                onChange={(e) => setNotifications({ ...notifications, budgetAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          ),
        },
        {
          label: '价格变动',
          description: '当订阅价格发生变化时通知',
          control: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.priceChanges}
                onChange={(e) => setNotifications({ ...notifications, priceChanges: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          ),
        },
      ],
    },
    {
      title: '区域与语言',
      icon: Globe,
      items: [
        {
          label: '默认货币',
          description: '设置显示金额的默认货币',
          control: (
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="select w-32"
            >
              <option value="CNY">人民币 (¥)</option>
              <option value="USD">美元 ($)</option>
              <option value="EUR">欧元 (€)</option>
              <option value="GBP">英镑 (£)</option>
              <option value="JPY">日元 (¥)</option>
            </select>
          ),
        },
        {
          label: '界面语言',
          description: '选择应用显示语言',
          control: (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select w-32"
            >
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁体中文</option>
              <option value="en">English</option>
            </select>
          ),
        },
      ],
    },
    {
      title: '数据管理',
      icon: Database,
      items: [
        {
          label: '导出数据',
          description: '将所有订阅数据导出为JSON文件',
          control: (
            <button className="btn-secondary text-sm">
              导出
            </button>
          ),
        },
        {
          label: '导入数据',
          description: '从JSON文件导入订阅数据',
          control: (
            <button className="btn-secondary text-sm">
              导入
            </button>
          ),
        },
        {
          label: '清除所有数据',
          description: '删除所有订阅数据（不可恢复）',
          control: (
            <button className="btn-danger text-sm">
              清除
            </button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      {settingsGroups.map((group) => {
        const Icon = group.icon;
        return (
          <div key={group.title} className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
            </div>

            <div className="space-y-6">
              {group.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between ${
                    index !== group.items.length - 1 ? 'pb-6 border-b border-gray-100' : ''
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                  <div>{item.control}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* About */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">关于</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">SubTrack</p>
                <p className="text-sm text-gray-500">版本 1.0.0</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-700">使用条款</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-700">隐私政策</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-700">开源许可</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-700">检查更新</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="pt-4 text-center text-sm text-gray-400">
            <p>© 2025 SubTrack. All rights reserved.</p>
            <p className="mt-1">Made with ❤️ for subscription management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
