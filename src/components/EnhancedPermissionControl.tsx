import React, { useState } from 'react';
import { Shield, Users, Lock, Database, Table, CheckCircle, XCircle, Plus, Edit, Trash2, Layers } from 'lucide-react';

// 应用访问用户权限
interface AppAccessPermission {
  id: string;
  userId: string;
  userName: string;
  appId: string;
  appName: string;
  permissions: {
    canAccess: boolean; // 访问控制
    mcpTools: string[]; // MCP工具权限
    dataPermissions: DataPermission[]; // 数据权限
  };
  createdAt: string;
}

interface DataPermission {
  id: string;
  database: string;
  table: string;
  accessLevel: 'none' | 'read' | 'write' | 'full';
  rowFilter?: string; // 行级过滤条件
  allowedColumns?: string[]; // 允许的字段
}

// 管理平台用户权限
interface AdminPermission {
  id: string;
  userId: string;
  userName: string;
  role: string;
  permissions: {
    applications: string[]; // 可管理的应用
    modules: string[]; // 可访问的功能模块
    operations: string[]; // 可执行的操作
  };
  createdAt: string;
}

const mockAppAccessPermissions: AppAccessPermission[] = [
  {
    id: 'perm_001',
    userId: 'USER20234',
    userName: '李四',
    appId: 'app_001',
    appName: '智能客服助手',
    permissions: {
      canAccess: true,
      mcpTools: ['mcp_query_balance', 'mcp_query_meter'],
      dataPermissions: [
        {
          id: 'data_001',
          database: 'customer_db',
          table: 'accounts',
          accessLevel: 'read',
          rowFilter: 'region = "华北"',
          allowedColumns: ['account_id', 'balance', 'status'],
        },
        {
          id: 'data_002',
          database: 'customer_db',
          table: 'meters',
          accessLevel: 'read',
          allowedColumns: ['meter_id', 'reading', 'status'],
        },
      ],
    },
    createdAt: '2024-01-10',
  },
  {
    id: 'perm_002',
    userId: 'EMP10086',
    userName: '张三',
    appId: 'app_001',
    appName: '智能客服助手',
    permissions: {
      canAccess: true,
      mcpTools: ['mcp_query_balance', 'mcp_query_meter', 'mcp_create_ticket'],
      dataPermissions: [
        {
          id: 'data_003',
          database: 'customer_db',
          table: 'accounts',
          accessLevel: 'full',
          allowedColumns: ['*'],
        },
      ],
    },
    createdAt: '2024-01-08',
  },
];

const mockAdminPermissions: AdminPermission[] = [
  {
    id: 'admin_001',
    userId: 'admin',
    userName: '系统管理员',
    role: '超级管理员',
    permissions: {
      applications: ['*'], // 所有应用
      modules: ['*'], // 所有模块
      operations: ['*'], // 所有操作
    },
    createdAt: '2024-01-01',
  },
  {
    id: 'admin_002',
    userId: 'EMP10087',
    userName: '王五',
    role: '应用管理员',
    permissions: {
      applications: ['app_001', 'app_002'],
      modules: ['session', 'feedback', 'context'],
      operations: ['view', 'edit'],
    },
    createdAt: '2024-01-05',
  },
];

const availableMcpTools = [
  'mcp_query_balance',
  'mcp_query_meter',
  'mcp_create_ticket',
  'mcp_data_diagnosis',
  'mcp_payment_record',
  'mcp_fault_report',
];

const availableApplications = [
  { id: 'app_001', name: '智能客服助手' },
  { id: 'app_002', name: '数据诊断助手' },
  { id: 'app_003', name: '用户助手' },
];

const availableTables = [
  { database: 'customer_db', table: 'accounts', columns: ['account_id', 'user_id', 'balance', 'status', 'region', 'created_at'] },
  { database: 'customer_db', table: 'meters', columns: ['meter_id', 'account_id', 'reading', 'status', 'type', 'location'] },
  { database: 'customer_db', table: 'tickets', columns: ['ticket_id', 'user_id', 'type', 'status', 'priority', 'description'] },
];

export function EnhancedPermissionControl() {
  const [activeTab, setActiveTab] = useState<'app-users' | 'admin-users'>('app-users');
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('all');
  const [showAddPermission, setShowAddPermission] = useState(false);
  const [showDataPermissionConfig, setShowDataPermissionConfig] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<AppAccessPermission | null>(null);

  const filteredAppPermissions = mockAppAccessPermissions.filter(
    perm => selectedAppFilter === 'all' || perm.appId === selectedAppFilter
  );

  const getAccessLevelBadge = (level: string) => {
    const colors = {
      none: 'bg-gray-100 text-gray-700',
      read: 'bg-blue-100 text-blue-700',
      write: 'bg-yellow-100 text-yellow-700',
      full: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[level as keyof typeof colors]}`}>
        {level === 'none' && '无权限'}
        {level === 'read' && '只读'}
        {level === 'write' && '读写'}
        {level === 'full' && '完全控制'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">权限控制管理</h2>
        <p className="text-sm text-gray-500 mt-1">应用访问权限、MCP工具权限、数据权限和管理平台权限</p>
      </div>

      {/* Permission Architecture */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">权限架构说明</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">应用访问用户权限</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>访问控制：是否允许访问特定应用</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>MCP权限：可调用的MCP工具列表</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>数据权限：数据库表、行、字段级权限</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">管理平台用户权限</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>应用管理：可管理的应用范围</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>模块访问：可访问的功能模块</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>操作权限：可执行的操作类型</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">应用访问用户</p>
              <p className="text-2xl font-semibold text-gray-900">{mockAppAccessPermissions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">管理平台用户</p>
              <p className="text-2xl font-semibold text-gray-900">{mockAdminPermissions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Layers className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">应用隔离</p>
              <p className="text-2xl font-semibold text-gray-900">{availableApplications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Database className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">数据表权限</p>
              <p className="text-2xl font-semibold text-gray-900">{availableTables.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('app-users')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'app-users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              应用访问用户权限
            </button>
            <button
              onClick={() => setActiveTab('admin-users')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'admin-users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              管理平台用户权限
            </button>
          </div>
        </div>

        {/* App Users Tab */}
        {activeTab === 'app-users' && (
          <div className="p-6">
            {/* Filters */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">应用筛选:</span>
                <select
                  value={selectedAppFilter}
                  onChange={(e) => setSelectedAppFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部应用</option>
                  {availableApplications.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAddPermission(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加权限
              </button>
            </div>

            {/* Permissions List */}
            <div className="space-y-4">
              {filteredAppPermissions.map((perm) => (
                <div key={perm.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{perm.userName}</h3>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{perm.userId}</span>
                        {perm.permissions.canAccess ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            可访问
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            禁止访问
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">应用: {perm.appName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPermission(perm)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* MCP Tools Permissions */}
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">MCP工具权限</h4>
                    <div className="flex flex-wrap gap-2">
                      {perm.permissions.mcpTools.map((tool, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-200 font-mono">
                          {tool}
                        </span>
                      ))}
                      {perm.permissions.mcpTools.length === 0 && (
                        <span className="text-sm text-gray-500">无MCP工具权限</span>
                      )}
                    </div>
                  </div>

                  {/* Data Permissions */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">数据权限</h4>
                    <div className="space-y-3">
                      {perm.permissions.dataPermissions.map((dataPerm) => (
                        <div key={dataPerm.id} className="bg-white rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Table className="w-4 h-4 text-blue-600" />
                              <code className="text-sm font-mono text-gray-900">
                                {dataPerm.database}.{dataPerm.table}
                              </code>
                            </div>
                            {getAccessLevelBadge(dataPerm.accessLevel)}
                          </div>
                          {dataPerm.rowFilter && (
                            <div className="text-xs text-gray-600 mb-1">
                              行过滤: <code className="bg-gray-100 px-2 py-0.5 rounded">{dataPerm.rowFilter}</code>
                            </div>
                          )}
                          {dataPerm.allowedColumns && dataPerm.allowedColumns.length > 0 && (
                            <div className="text-xs text-gray-600">
                              字段: <code className="bg-gray-100 px-2 py-0.5 rounded">{dataPerm.allowedColumns.join(', ')}</code>
                            </div>
                          )}
                        </div>
                      ))}
                      {perm.permissions.dataPermissions.length === 0 && (
                        <span className="text-sm text-gray-500">无数据权限</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Users Tab */}
        {activeTab === 'admin-users' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">共 {mockAdminPermissions.length} 个管理用户</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加管理员
              </button>
            </div>

            <div className="space-y-4">
              {mockAdminPermissions.map((admin) => (
                <div key={admin.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{admin.userName}</h3>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                          {admin.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{admin.userId}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">应用管理权限</h4>
                      {admin.permissions.applications[0] === '*' ? (
                        <span className="text-sm text-blue-600 font-medium">全部应用</span>
                      ) : (
                        <div className="space-y-1">
                          {admin.permissions.applications.map((appId, idx) => {
                            const app = availableApplications.find(a => a.id === appId);
                            return (
                              <div key={idx} className="text-sm text-gray-700">{app?.name}</div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">模块访问权限</h4>
                      {admin.permissions.modules[0] === '*' ? (
                        <span className="text-sm text-green-600 font-medium">全部模块</span>
                      ) : (
                        <div className="space-y-1">
                          {admin.permissions.modules.map((module, idx) => (
                            <div key={idx} className="text-sm text-gray-700">{module}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">操作权限</h4>
                      {admin.permissions.operations[0] === '*' ? (
                        <span className="text-sm text-orange-600 font-medium">全部操作</span>
                      ) : (
                        <div className="space-y-1">
                          {admin.permissions.operations.map((op, idx) => (
                            <div key={idx} className="text-sm text-gray-700">{op}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Permission Matrix View */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">MCP工具权限矩阵（按应用隔离）</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">用户/工具</th>
                {availableMcpTools.map((tool) => (
                  <th key={tool} className="px-4 py-3 text-center font-medium text-gray-500">
                    <div className="text-xs font-mono">{tool.replace('mcp_', '')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{perm.userName}</div>
                      <div className="text-xs text-gray-500">{perm.appName}</div>
                    </div>
                  </td>
                  {availableMcpTools.map((tool) => (
                    <td key={tool} className="px-4 py-3 text-center">
                      {perm.permissions.mcpTools.includes(tool) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
