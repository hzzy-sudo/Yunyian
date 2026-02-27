import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, Users, AlertCircle, CheckCircle, Clock, Filter, Layers } from 'lucide-react';

const sessionTrendData = [
  { date: '01-10', sessions: 245, activeUsers: 189 },
  { date: '01-11', sessions: 312, activeUsers: 234 },
  { date: '01-12', sessions: 278, activeUsers: 201 },
  { date: '01-13', sessions: 395, activeUsers: 287 },
  { date: '01-14', sessions: 421, activeUsers: 315 },
  { date: '01-15', sessions: 378, activeUsers: 298 },
  { date: '01-16', sessions: 456, activeUsers: 342 },
];

const intentDistributionData = [
  { name: '余额查询', value: 1234, color: '#3b82f6' },
  { name: '数据诊断', value: 987, color: '#10b981' },
  { name: '工单处理', value: 756, color: '#f59e0b' },
  { name: '报修申请', value: 543, color: '#ef4444' },
  { name: '其他', value: 321, color: '#8b5cf6' },
];

const feedbackData = [
  { rating: '5星', count: 2345 },
  { rating: '4星', count: 1876 },
  { rating: '3星', count: 543 },
  { rating: '2星', count: 234 },
  { rating: '1星', count: 123 },
];

// 新增：按应用分类的数据
const applicationData = [
  { name: '智能客服助手', sessions: 1234, users: 234, avgRating: 4.6 },
  { name: '数据诊断助手', sessions: 345, users: 89, avgRating: 4.4 },
  { name: '用户助手', sessions: 2345, users: 456, avgRating: 4.7 },
];

export function Dashboard() {
  const [selectedApp, setSelectedApp] = React.useState<string>('all');

  const stats = [
    {
      label: '今日会话数',
      value: '456',
      change: '+12.5%',
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      label: '活跃用户数',
      value: '342',
      change: '+8.3%',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: '平均满意度',
      value: '4.6',
      change: '+0.2',
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    {
      label: '敏感词拦截',
      value: '23',
      change: '-15.2%',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      label: '平均响应时间',
      value: '1.2s',
      change: '-0.3s',
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      label: 'Token消耗',
      value: '145K',
      change: '+18.7%',
      icon: TrendingUp,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Application Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">应用筛选:</span>
          <select
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部应用</option>
            <option value="CUSTOMER_SERVICE">智能客服助手</option>
            <option value="DATA_DIAGNOSIS">数据诊断助手</option>
            <option value="USER_ASSISTANT">用户助手</option>
          </select>
          <span className="text-xs text-gray-500 ml-2">
            {selectedApp === 'all' ? '显示所有应用的聚合数据' : `仅显示${selectedApp}的数据`}
          </span>
        </div>
      </div>

      {/* Application Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {applicationData.map((app, index) => (
          <div key={index} className="bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{app.name}</h3>
                <p className="text-xs text-gray-500">Dify工作流应用</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500">会话数</p>
                <p className="text-lg font-semibold text-gray-900">{app.sessions}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">用户数</p>
                <p className="text-lg font-semibold text-gray-900">{app.users}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">满意度</p>
                <p className="text-lg font-semibold text-yellow-600">★{app.avgRating}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
                <span className={`text-xs font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Trend */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">会话趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} name="会话数" />
              <Line type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={2} name="活跃用户" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Intent Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">意图分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={intentDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {intentDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">用户反馈分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="rating" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="数量" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">实时活动</h3>
          <div className="space-y-3">
            {[
              { time: '09:35:23', user: '张三', action: '创建新会话', tenant: 'TENANT_SCS', type: 'success' },
              { time: '09:34:18', user: '李四', action: '查询余额', tenant: 'TENANT_CUSTOMER', type: 'info' },
              { time: '09:33:45', user: '王五', action: '触发敏感词', tenant: 'TENANT_SCS', type: 'warning' },
              { time: '09:32:12', user: '赵六', action: '会话超时', tenant: 'TENANT_CUSTOMER', type: 'error' },
              { time: '09:31:08', user: '钱七', action: 'MCP工具调用', tenant: 'TENANT_SCS', type: 'info' },
              { time: '09:30:45', user: '孙八', action: '提交反馈', tenant: 'TENANT_CUSTOMER', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.tenant}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dify服务状态</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API响应时间</span>
              <span className="text-sm font-medium text-green-600">正常 (89ms)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">成功率</span>
              <span className="text-sm font-medium text-green-600">99.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">今日调用次数</span>
              <span className="text-sm font-medium text-gray-900">12,456</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MCP服务状态</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">在线工具数</span>
              <span className="text-sm font-medium text-green-600">15/15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">平均调用时间</span>
              <span className="text-sm font-medium text-green-600">234ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">今日调用次数</span>
              <span className="text-sm font-medium text-gray-900">8,923</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">存储状态</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Redis缓存</span>
              <span className="text-sm font-medium text-green-600">正常</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">归档存储</span>
              <span className="text-sm font-medium text-green-600">78% 可用</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">今日归档会话</span>
              <span className="text-sm font-medium text-gray-900">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}