import React, { useState } from 'react';
import { Shield, Users, Lock, Eye, EyeOff, Plus, Edit, Trash2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  tenant: string;
  permissions: string[];
  userCount: number;
}

interface User {
  id: string;
  name: string;
  tenant: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

const mockRoles: Role[] = [
  {
    id: 'role_001',
    name: '管理员',
    description: '拥有全部权限，可管理系统配置',
    tenant: 'TENANT_SCS',
    permissions: ['session.view', 'session.manage', 'user.manage', 'system.config', 'audit.view'],
    userCount: 3,
  },
  {
    id: 'role_002',
    name: '客服人员',
    description: '可查看和管理客户会话',
    tenant: 'TENANT_SCS',
    permissions: ['session.view', 'session.manage', 'feedback.view'],
    userCount: 25,
  },
  {
    id: 'role_003',
    name: '普通用户',
    description: '仅可使用对话功能',
    tenant: 'TENANT_CUSTOMER',
    permissions: ['session.create', 'session.view.own'],
    userCount: 1234,
  },
  {
    id: 'role_004',
    name: '数据分析师',
    description: '可查看统计数据和审计日志',
    tenant: 'TENANT_SCS',
    permissions: ['session.view', 'audit.view', 'analytics.view'],
    userCount: 8,
  },
];

const mockUsers: User[] = [
  { id: 'EMP10086', name: '张三', tenant: 'TENANT_SCS', role: '管理员', status: 'active', lastActive: '2024-01-16 10:30' },
  { id: 'EMP10087', name: '李四', tenant: 'TENANT_SCS', role: '客服人员', status: 'active', lastActive: '2024-01-16 10:25' },
  { id: 'USER20234', name: '王五', tenant: 'TENANT_CUSTOMER', role: '普通用户', status: 'active', lastActive: '2024-01-16 10:15' },
  { id: 'EMP10088', name: '赵六', tenant: 'TENANT_SCS', role: '数据分析师', status: 'active', lastActive: '2024-01-16 09:45' },
  { id: 'USER20235', name: '钱七', tenant: 'TENANT_CUSTOMER', role: '普通用户', status: 'inactive', lastActive: '2024-01-15 15:20' },
];

const allPermissions = [
  { id: 'session.create', name: '创建会话', category: '会话管理' },
  { id: 'session.view', name: '查看所有会话', category: '会话管理' },
  { id: 'session.view.own', name: '查看自己的会话', category: '会话管理' },
  { id: 'session.manage', name: '管理会话', category: '会话管理' },
  { id: 'user.manage', name: '用户管理', category: '用户管理' },
  { id: 'system.config', name: '系统配置', category: '系统管理' },
  { id: 'audit.view', name: '查看审计日志', category: '审计' },
  { id: 'analytics.view', name: '查看数据分析', category: '数据分析' },
  { id: 'feedback.view', name: '查看用户反馈', category: '反馈管理' },
  { id: 'mcp.manage', name: '管理MCP工具', category: 'MCP管理' },
];

export function PermissionControl() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  const [showAddRole, setShowAddRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">权限控制管理</h2>
        <p className="text-sm text-gray-500 mt-1">多租户数据隔离、细粒度权限控制和会话可见性管理</p>
      </div>

      {/* Tenant Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">内部员工租户</p>
              <p className="text-xl font-semibold text-gray-900">TENANT_SCS</p>
              <p className="text-xs text-gray-500">36 用户</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">客户租户</p>
              <p className="text-xl font-semibold text-gray-900">TENANT_CUSTOMER</p>
              <p className="text-xs text-gray-500">1,234 用户</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">数据隔离状态</p>
              <p className="text-xl font-semibold text-green-600">正常</p>
              <p className="text-xs text-gray-500">100% 隔离率</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'roles'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              角色管理
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              用户管理
            </button>
          </div>
        </div>

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">共 {mockRoles.length} 个角色</p>
              <button
                onClick={() => setShowAddRole(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加角色
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRoles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{role.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedRole(role)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">租户:</span>
                      <span className="font-mono text-gray-900">{role.tenant}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">用户数:</span>
                      <span className="font-semibold text-gray-900">{role.userCount} 人</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-600 mb-2">权限 ({role.permissions.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((perm, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                            {allPermissions.find(p => p.id === perm)?.name}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{role.permissions.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">租户</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最后活跃</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs font-mono text-gray-900">{user.id}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-600">{user.tenant}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.status === 'active' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            激活
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            停用
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Role Detail Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">编辑角色权限</h3>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">角色名称</label>
                <input
                  type="text"
                  value={selectedRole.name}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">权限配置</label>
                <div className="mt-2 space-y-3">
                  {Object.entries(
                    allPermissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, typeof allPermissions>)
                  ).map(([category, perms]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">{category}</p>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <label key={perm.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedRole.permissions.includes(perm.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              readOnly
                            />
                            <span className="text-sm text-gray-700">{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setSelectedRole(null)}
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
