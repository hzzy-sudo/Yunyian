import React, { useState } from 'react';
import { Wrench, Play, Pause, Settings, Activity, AlertCircle, CheckCircle, Clock, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface McpTool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'online' | 'offline' | 'error';
  endpoint: string;
  avgResponseTime: number;
  successRate: number;
  todayCalls: number;
  lastCall?: string;
  parameters: Array<{ name: string; type: string; required: boolean }>;
}

interface ToolCallLog {
  id: string;
  toolId: string;
  toolName: string;
  sessionId: string;
  userId: string;
  parameters: Record<string, any>;
  responseTime: number;
  status: 'success' | 'error' | 'timeout';
  timestamp: string;
  errorMessage?: string;
}

const mockTools: McpTool[] = [
  {
    id: 'mcp_001',
    name: 'mcp_query_balance',
    description: '查询用户账户余额',
    category: '查询类',
    status: 'online',
    endpoint: 'https://api.example.com/balance',
    avgResponseTime: 234,
    successRate: 99.8,
    todayCalls: 1234,
    lastCall: '2024-01-16 10:35:23',
    parameters: [
      { name: 'account_id', type: 'string', required: true },
      { name: 'include_detail', type: 'boolean', required: false },
    ],
  },
  {
    id: 'mcp_002',
    name: 'mcp_query_meter',
    description: '查询表具信息',
    category: '查询类',
    status: 'online',
    endpoint: 'https://api.example.com/meter',
    avgResponseTime: 189,
    successRate: 99.5,
    todayCalls: 876,
    lastCall: '2024-01-16 10:34:12',
    parameters: [
      { name: 'meter_id', type: 'string', required: true },
    ],
  },
  {
    id: 'mcp_003',
    name: 'mcp_data_diagnosis',
    description: '执行数据诊断分析',
    category: '分析类',
    status: 'online',
    endpoint: 'https://api.example.com/diagnosis',
    avgResponseTime: 1245,
    successRate: 97.2,
    todayCalls: 345,
    lastCall: '2024-01-16 10:30:45',
    parameters: [
      { name: 'metric', type: 'string', required: true },
      { name: 'time_range', type: 'string', required: true },
      { name: 'dimension', type: 'array', required: false },
    ],
  },
  {
    id: 'mcp_004',
    name: 'mcp_create_ticket',
    description: '创建工单',
    category: '操作类',
    status: 'online',
    endpoint: 'https://api.example.com/ticket',
    avgResponseTime: 567,
    successRate: 98.9,
    todayCalls: 234,
    lastCall: '2024-01-16 10:28:30',
    parameters: [
      { name: 'type', type: 'string', required: true },
      { name: 'description', type: 'string', required: true },
      { name: 'priority', type: 'string', required: false },
    ],
  },
  {
    id: 'mcp_005',
    name: 'mcp_payment_record',
    description: '查询缴费记录',
    category: '查询类',
    status: 'online',
    endpoint: 'https://api.example.com/payment',
    avgResponseTime: 312,
    successRate: 99.1,
    todayCalls: 567,
    lastCall: '2024-01-16 10:25:15',
    parameters: [
      { name: 'account_id', type: 'string', required: true },
      { name: 'start_date', type: 'string', required: false },
      { name: 'end_date', type: 'string', required: false },
    ],
  },
  {
    id: 'mcp_006',
    name: 'mcp_fault_report',
    description: '故障报修',
    category: '操作类',
    status: 'error',
    endpoint: 'https://api.example.com/fault',
    avgResponseTime: 2345,
    successRate: 85.3,
    todayCalls: 89,
    lastCall: '2024-01-16 10:20:00',
    parameters: [
      { name: 'meter_id', type: 'string', required: true },
      { name: 'fault_type', type: 'string', required: true },
      { name: 'description', type: 'string', required: false },
    ],
  },
];

const mockLogs: ToolCallLog[] = [
  {
    id: 'log_001',
    toolId: 'mcp_001',
    toolName: 'mcp_query_balance',
    sessionId: 'scs_20240116_001',
    userId: 'EMP10086',
    parameters: { account_id: '10012345' },
    responseTime: 234,
    status: 'success',
    timestamp: '2024-01-16 10:35:23',
  },
  {
    id: 'log_002',
    toolId: 'mcp_002',
    toolName: 'mcp_query_meter',
    sessionId: 'scs_20240116_002',
    userId: 'USER20234',
    parameters: { meter_id: 'M456789' },
    responseTime: 189,
    status: 'success',
    timestamp: '2024-01-16 10:34:12',
  },
  {
    id: 'log_003',
    toolId: 'mcp_006',
    toolName: 'mcp_fault_report',
    sessionId: 'scs_20240116_003',
    userId: 'USER20235',
    parameters: { meter_id: 'M789012', fault_type: 'no_reading' },
    responseTime: 5000,
    status: 'timeout',
    timestamp: '2024-01-16 10:30:45',
    errorMessage: 'Request timeout after 5000ms',
  },
];

const performanceTrendData = [
  { date: '01-10', avgTime: 245, calls: 1234 },
  { date: '01-11', avgTime: 234, calls: 1456 },
  { date: '01-12', avgTime: 256, calls: 1345 },
  { date: '01-13', avgTime: 223, calls: 1567 },
  { date: '01-14', avgTime: 267, calls: 1789 },
  { date: '01-15', avgTime: 234, calls: 1654 },
  { date: '01-16', avgTime: 245, calls: 890 },
];

const categoryDistributionData = [
  { category: '查询类', count: 2677 },
  { category: '分析类', count: 345 },
  { category: '操作类', count: 323 },
];

export function McpToolManagement() {
  const [activeTab, setActiveTab] = useState<'tools' | 'logs' | 'analytics'>('tools');
  const [selectedTool, setSelectedTool] = useState<McpTool | null>(null);
  const [showAddTool, setShowAddTool] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            在线
          </span>
        );
      case 'offline':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
            离线
          </span>
        );
      case 'error':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            异常
          </span>
        );
      default:
        return null;
    }
  };

  const getCallStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'timeout':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">MCP工具管理与调度</h2>
        <p className="text-sm text-gray-500 mt-1">管理和监控Model Context Protocol工具调用</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">工具总数</p>
              <p className="text-2xl font-semibold text-gray-900">{mockTools.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">在线工具</p>
              <p className="text-2xl font-semibold text-green-600">
                {mockTools.filter(t => t.status === 'online').length}/{mockTools.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">今日调用</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockTools.reduce((sum, t) => sum + t.todayCalls, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">平均响应</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(
                  mockTools.reduce((sum, t) => sum + t.avgResponseTime, 0) / mockTools.length
                )}ms
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">成功率</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(mockTools.reduce((sum, t) => sum + t.successRate, 0) / mockTools.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'tools'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              工具列表
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              调用日志
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              性能分析
            </button>
          </div>
        </div>

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">共 {mockTools.length} 个工具</p>
              <button
                onClick={() => setShowAddTool(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加工具
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTools.map((tool) => (
                <div key={tool.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="font-semibold text-blue-600 text-sm">{tool.name}</code>
                        {getStatusBadge(tool.status)}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                        {tool.category}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedTool(tool)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                        {tool.status === 'online' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">响应时间</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{tool.avgResponseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">成功率</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{tool.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">今日调用</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{tool.todayCalls}</p>
                    </div>
                  </div>

                  {tool.lastCall && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">最后调用: {tool.lastCall}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">最近 {mockLogs.length} 条调用记录</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工具名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">会话ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">参数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">响应时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs font-mono text-blue-600">{log.toolName}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs font-mono text-gray-600">{log.sessionId}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.userId}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-50 px-2 py-1 rounded">
                          {JSON.stringify(log.parameters)}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={log.responseTime > 1000 ? 'text-red-600' : 'text-gray-900'}>
                          {log.responseTime}ms
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getCallStatusBadge(log.status)}
                          {log.errorMessage && (
                            <span className="text-xs text-red-600">{log.errorMessage}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">性能趋势</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgTime" stroke="#3b82f6" strokeWidth={2} name="平均响应时间(ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">分类调用量</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="category" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="调用次数" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">工具性能排行</h3>
              <div className="space-y-3">
                {mockTools
                  .sort((a, b) => b.todayCalls - a.todayCalls)
                  .slice(0, 5)
                  .map((tool, index) => (
                    <div key={tool.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <code className="text-sm font-mono text-blue-600">{tool.name}</code>
                        <p className="text-xs text-gray-500 mt-1">{tool.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{tool.todayCalls} 次</p>
                        <p className="text-xs text-gray-500">{tool.avgResponseTime}ms</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">{tool.successRate}%</p>
                        <p className="text-xs text-gray-500">成功率</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">工具配置</h3>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">工具名称</label>
                <input
                  type="text"
                  value={selectedTool.name}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">描述</label>
                <input
                  type="text"
                  value={selectedTool.description}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">分类</label>
                  <input
                    type="text"
                    value={selectedTool.category}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">状态</label>
                  <select
                    value={selectedTool.status}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="online">在线</option>
                    <option value="offline">离线</option>
                    <option value="error">异常</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">API端点</label>
                <input
                  type="text"
                  value={selectedTool.endpoint}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">参数配置</label>
                <div className="space-y-2">
                  {selectedTool.parameters.map((param, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <code className="font-mono text-sm text-blue-600 flex-1">{param.name}</code>
                      <span className="text-xs text-gray-600">{param.type}</span>
                      {param.required && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">必填</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  保存更改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
