import React, { useState } from 'react';
import { Search, Filter, Download, Eye, XCircle, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Session {
  sessionId: string;
  tenant: string;
  userId: string;
  userName: string;
  startTime: string;
  duration: number;
  status: 'active' | 'closed' | 'timeout';
  messageCount: number;
  tokenUsage: number;
  intents: string[];
  rating?: number;
  appType?: string; // 新增：关联的Dify应用类型
  appName?: string; // 新增：应用名称
}

const mockSessions: Session[] = [
  {
    sessionId: 'scs_20240116_001',
    tenant: 'TENANT_SCS',
    userId: 'EMP10086',
    userName: '张三',
    startTime: '2024-01-16 09:00:00',
    duration: 923,
    status: 'closed',
    messageCount: 12,
    tokenUsage: 1250,
    intents: ['query_balance', 'query_meter'],
    rating: 5,
    appType: 'CUSTOMER_SERVICE',
    appName: '智能客服助手',
  },
  {
    sessionId: 'scs_20240116_002',
    tenant: 'TENANT_CUSTOMER',
    userId: 'USER20234',
    userName: '李四',
    startTime: '2024-01-16 09:15:30',
    duration: 456,
    status: 'active',
    messageCount: 8,
    tokenUsage: 890,
    intents: ['report_fault'],
    appType: 'USER_ASSISTANT',
    appName: '用户助手',
  },
  {
    sessionId: 'scs_20240116_003',
    tenant: 'TENANT_SCS',
    userId: 'EMP10087',
    userName: '王五',
    startTime: '2024-01-16 09:30:12',
    duration: 1800,
    status: 'timeout',
    messageCount: 5,
    tokenUsage: 456,
    intents: ['data_diagnosis'],
    appType: 'DATA_DIAGNOSIS',
    appName: '数据诊断助手',
  },
  {
    sessionId: 'scs_20240116_004',
    tenant: 'TENANT_CUSTOMER',
    userId: 'USER20235',
    userName: '赵六',
    startTime: '2024-01-16 09:45:00',
    duration: 234,
    status: 'closed',
    messageCount: 6,
    tokenUsage: 678,
    intents: ['payment_query'],
    rating: 4,
    appType: 'USER_ASSISTANT',
    appName: '用户助手',
  },
  {
    sessionId: 'scs_20240116_005',
    tenant: 'TENANT_SCS',
    userId: 'EMP10088',
    userName: '钱七',
    startTime: '2024-01-16 10:00:15',
    duration: 0,
    status: 'active',
    messageCount: 3,
    tokenUsage: 234,
    intents: ['ticket_handle'],
    appType: 'CUSTOMER_SERVICE',
    appName: '智能客服助手',
  },
];

export function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [appFilter, setAppFilter] = useState<string>('all'); // 新增：应用筛选
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.userName.includes(searchTerm) ||
      session.userId.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesApp = appFilter === 'all' || session.appType === appFilter; // 新增：应用筛选逻辑
    return matchesSearch && matchesStatus && matchesApp;
  });

  const handleTerminateSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.sessionId === sessionId ? { ...s, status: 'closed' as const } : s
    ));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          进行中
        </span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          已关闭
        </span>;
      case 'timeout':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          超时
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">会话生命周期管理</h2>
        <p className="text-sm text-gray-500 mt-1">管理从创建到归档的完整会话生命周期</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索会话ID、用户名或用户ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="active">进行中</option>
              <option value="closed">已关闭</option>
              <option value="timeout">超时</option>
            </select>
            <select
              value={appFilter}
              onChange={(e) => setAppFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部应用</option>
              <option value="CUSTOMER_SERVICE">智能客服助手</option>
              <option value="USER_ASSISTANT">用户助手</option>
              <option value="DATA_DIAGNOSIS">数据诊断助手</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">总会话数</p>
          <p className="text-2xl font-semibold text-gray-900">{sessions.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">进行中</p>
          <p className="text-2xl font-semibold text-green-600">
            {sessions.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">已关闭</p>
          <p className="text-2xl font-semibold text-gray-600">
            {sessions.filter(s => s.status === 'closed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">超时</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {sessions.filter(s => s.status === 'timeout').length}
          </p>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会话ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">租户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时长</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消息数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.sessionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-blue-600">{session.sessionId}</code>
                      {session.rating && (
                        <span className="text-xs text-yellow-500">★{session.rating}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.userName}</p>
                      <p className="text-xs text-gray-500">{session.userId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-gray-600">{session.tenant}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.status === 'active' ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        进行中
                      </span>
                    ) : (
                      formatDuration(session.duration)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.messageCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.tokenUsage.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(session.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="text-blue-600 hover:text-blue-800"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {session.status === 'active' && (
                        <button
                          onClick={() => handleTerminateSession(session.sessionId)}
                          className="text-red-600 hover:text-red-800"
                          title="终止会话"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">会话详情</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">会话ID</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{selectedSession.sessionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">状态</label>
                  <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">用户信息</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSession.userName} ({selectedSession.userId})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">租户</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{selectedSession.tenant}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">开始时间</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSession.startTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">会话时长</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedSession.status === 'active' ? '进行中' : formatDuration(selectedSession.duration)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">消息数量</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSession.messageCount} 条</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Token消耗</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSession.tokenUsage.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">关联应用</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSession.appName} ({selectedSession.appType})</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">识别意图</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSession.intents.map((intent, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {intent}
                    </span>
                  ))}
                </div>
              </div>
              {selectedSession.rating && (
                <div>
                  <label className="text-sm font-medium text-gray-500">用户评分</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {'★'.repeat(selectedSession.rating)}{'☆'.repeat(5 - selectedSession.rating)} ({selectedSession.rating}/5)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}