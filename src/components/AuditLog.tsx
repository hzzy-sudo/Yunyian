import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Eye, Calendar } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  tenant: string;
  action: string;
  module: string;
  resource: string;
  result: 'success' | 'failure';
  ip: string;
  details?: string;
}

const mockLogs: AuditLog[] = [
  {
    id: 'audit_20240116_001',
    timestamp: '2024-01-16 10:35:23',
    userId: 'admin',
    userName: '系统管理员',
    tenant: 'TENANT_SCS',
    action: '创建会话',
    module: '会话管理',
    resource: 'scs_20240116_001',
    result: 'success',
    ip: '192.168.1.100',
    details: '用户 EMP10086 创建新会话',
  },
  {
    id: 'audit_20240116_002',
    timestamp: '2024-01-16 10:30:45',
    userId: 'EMP10087',
    userName: '李四',
    tenant: 'TENANT_SCS',
    action: '修改敏感词',
    module: '敏感词管理',
    resource: 'sw_003',
    result: 'success',
    ip: '192.168.1.101',
    details: '修改敏感词 "广告推销" 的处理策略',
  },
  {
    id: 'audit_20240116_003',
    timestamp: '2024-01-16 10:28:12',
    userId: 'EMP10086',
    userName: '张三',
    tenant: 'TENANT_SCS',
    action: '查看审计日志',
    module: '审计日志',
    resource: 'audit_logs',
    result: 'success',
    ip: '192.168.1.100',
  },
  {
    id: 'audit_20240116_004',
    timestamp: '2024-01-16 10:25:30',
    userId: 'USER20234',
    userName: '王五',
    tenant: 'TENANT_CUSTOMER',
    action: '触发敏感词',
    module: '敏感词管理',
    resource: '会话内容',
    result: 'failure',
    ip: '114.114.114.114',
    details: '触发二级敏感词，消息已拦截',
  },
  {
    id: 'audit_20240116_005',
    timestamp: '2024-01-16 10:20:15',
    userId: 'admin',
    userName: '系统管理员',
    tenant: 'TENANT_SCS',
    action: '添加用户角色',
    module: '权限控制',
    resource: 'role_005',
    result: 'success',
    ip: '192.168.1.100',
    details: '创建新角色 "数据分析师"',
  },
  {
    id: 'audit_20240116_006',
    timestamp: '2024-01-16 10:15:45',
    userId: 'EMP10088',
    userName: '赵六',
    tenant: 'TENANT_SCS',
    action: '终止会话',
    module: '会话管理',
    resource: 'scs_20240116_003',
    result: 'success',
    ip: '192.168.1.102',
    details: '手动终止超时会话',
  },
  {
    id: 'audit_20240116_007',
    timestamp: '2024-01-16 10:10:20',
    userId: 'EMP10087',
    userName: '李四',
    tenant: 'TENANT_SCS',
    action: '导出数据',
    module: '会话管理',
    resource: 'session_export',
    result: 'success',
    ip: '192.168.1.101',
    details: '导出会话数据（2024-01-10 至 2024-01-16）',
  },
  {
    id: 'audit_20240116_008',
    timestamp: '2024-01-16 10:05:30',
    userId: 'USER20156',
    userName: '周九',
    tenant: 'TENANT_CUSTOMER',
    action: '登录失败',
    module: '权限控制',
    resource: 'login',
    result: 'failure',
    ip: '114.114.114.115',
    details: '密码错误，第3次尝试',
  },
  {
    id: 'audit_20240116_009',
    timestamp: '2024-01-16 10:00:15',
    userId: 'admin',
    userName: '系统管理员',
    tenant: 'TENANT_SCS',
    action: '配置MCP工具',
    module: 'MCP管理',
    resource: 'mcp_006',
    result: 'success',
    ip: '192.168.1.100',
    details: '修改工具 "mcp_fault_report" 的配置',
  },
  {
    id: 'audit_20240116_010',
    timestamp: '2024-01-16 09:55:45',
    userId: 'EMP10086',
    userName: '张三',
    tenant: 'TENANT_SCS',
    action: '添加提示词模板',
    module: '上下文工程',
    resource: 'template_004',
    result: 'success',
    ip: '192.168.1.100',
    details: '创建新模板 "报修引导助手"',
  },
];

export function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const modules = [...new Set(mockLogs.map(log => log.module))];

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.userName.includes(searchTerm) ||
      log.action.includes(searchTerm) ||
      log.resource.includes(searchTerm) ||
      log.userId.includes(searchTerm);
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesResult = filterResult === 'all' || log.result === filterResult;
    return matchesSearch && matchesModule && matchesResult;
  });

  const getResultBadge = (result: string) => {
    if (result === 'success') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">成功</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">失败</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">审计日志</h2>
        <p className="text-sm text-gray-500 mt-1">记录系统所有操作行为，确保可追溯性</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">总日志数</p>
              <p className="text-2xl font-semibold text-gray-900">{mockLogs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">今日日志</p>
              <p className="text-2xl font-semibold text-gray-900">{mockLogs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Filter className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">失败操作</p>
              <p className="text-2xl font-semibold text-red-600">
                {mockLogs.filter(log => log.result === 'failure').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">活跃用户</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(mockLogs.map(log => log.userId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户、操作或资源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部模块</option>
              {modules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部结果</option>
              <option value="success">成功</option>
              <option value="failure">失败</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">租户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">模块</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">资源</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP地址</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结果</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                      <p className="text-xs text-gray-500">{log.userId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-gray-600">{log.tenant}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs font-mono text-gray-600">{log.resource}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getResultBadge(log.result)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-blue-600 hover:text-blue-800"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">审计日志详情</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">日志ID</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">时间戳</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">用户</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLog.userName} ({selectedLog.userId})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">租户</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{selectedLog.tenant}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">模块</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLog.module}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">操作</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">资源</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{selectedLog.resource}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IP地址</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLog.ip}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">结果</label>
                  <div className="mt-1">{getResultBadge(selectedLog.result)}</div>
                </div>
              </div>
              {selectedLog.details && (
                <div>
                  <label className="text-sm font-medium text-gray-500">详细信息</label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedLog.details}
                  </p>
                </div>
              )}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
