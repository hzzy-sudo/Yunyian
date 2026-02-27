import React, { useState } from 'react';
import { Database, User, Trash2, Plus, Edit, RefreshCw, Search } from 'lucide-react';

interface MemoryEntry {
  id: string;
  userId: string;
  userName: string;
  category: string;
  key: string;
  value: string;
  source: 'auto' | 'manual';
  extractedAt: string;
  lastUsed?: string;
  useCount: number;
}

const mockMemories: MemoryEntry[] = [
  {
    id: 'mem_001',
    userId: 'EMP10086',
    userName: '张三',
    category: '个人偏好',
    key: '话术风格',
    value: '简洁专业',
    source: 'auto',
    extractedAt: '2024-01-10 09:30:00',
    lastUsed: '2024-01-16 09:15:23',
    useCount: 15,
  },
  {
    id: 'mem_002',
    userId: 'EMP10086',
    userName: '张三',
    category: '常用查询',
    key: '常查表具',
    value: 'M456789, M789012',
    source: 'auto',
    extractedAt: '2024-01-11 14:20:00',
    lastUsed: '2024-01-16 09:05:12',
    useCount: 8,
  },
  {
    id: 'mem_003',
    userId: 'USER20234',
    userName: '李四',
    category: '家庭信息',
    key: '家庭住址',
    value: '北京市朝阳区XX路XX号',
    source: 'manual',
    extractedAt: '2024-01-12 10:15:00',
    lastUsed: '2024-01-15 16:20:30',
    useCount: 3,
  },
  {
    id: 'mem_004',
    userId: 'USER20234',
    userName: '李四',
    category: '表具信息',
    key: '表具型号',
    value: 'IC卡智能表 ABC-2000',
    source: 'auto',
    extractedAt: '2024-01-13 11:45:00',
    lastUsed: '2024-01-15 16:18:45',
    useCount: 2,
  },
  {
    id: 'mem_005',
    userId: 'EMP10087',
    userName: '王五',
    category: '数据诊断',
    key: '关注指标',
    value: '上告数据准确率, 日均用量',
    source: 'auto',
    extractedAt: '2024-01-14 08:30:00',
    lastUsed: '2024-01-16 08:45:12',
    useCount: 12,
  },
  {
    id: 'mem_006',
    userId: 'USER20234',
    userName: '李四',
    category: '缴费习惯',
    key: '缴费周期',
    value: '每月5号',
    source: 'auto',
    extractedAt: '2024-01-14 15:20:00',
    lastUsed: '2024-01-15 16:22:15',
    useCount: 1,
  },
];

const categories = [
  { value: '个人偏好', icon: User, color: 'bg-blue-100 text-blue-700' },
  { value: '常用查询', icon: Search, color: 'bg-green-100 text-green-700' },
  { value: '家庭信息', icon: Database, color: 'bg-purple-100 text-purple-700' },
  { value: '表具信息', icon: Database, color: 'bg-orange-100 text-orange-700' },
  { value: '缴费习惯', icon: Database, color: 'bg-pink-100 text-pink-700' },
  { value: '数据诊断', icon: Database, color: 'bg-indigo-100 text-indigo-700' },
];

export function UserMemory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showAddMemory, setShowAddMemory] = useState(false);

  const filteredMemories = mockMemories.filter(mem => {
    const matchesSearch = 
      mem.userName.includes(searchTerm) ||
      mem.key.includes(searchTerm) ||
      mem.value.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || mem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const userMemoryStats = mockMemories.reduce((acc, mem) => {
    if (!acc[mem.userId]) {
      acc[mem.userId] = {
        userName: mem.userName,
        count: 0,
        lastUsed: mem.lastUsed || mem.extractedAt,
      };
    }
    acc[mem.userId].count++;
    return acc;
  }, {} as Record<string, { userName: string; count: number; lastUsed: string }>);

  const getUserMemories = (userId: string) => {
    return mockMemories.filter(mem => mem.userId === userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">用户全局记忆</h2>
        <p className="text-sm text-gray-500 mt-1">管理用户长期偏好、关键信息和历史习惯</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">总记忆条目</p>
              <p className="text-2xl font-semibold text-gray-900">{mockMemories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">用户数量</p>
              <p className="text-2xl font-semibold text-gray-900">{Object.keys(userMemoryStats).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">自动提取</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockMemories.filter(m => m.source === 'auto').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Edit className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">手动添加</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockMemories.filter(m => m.source === 'manual').length}
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
              placeholder="搜索用户、关键词或内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部分类</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.value}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddMemory(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加记忆
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">用户列表</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {Object.entries(userMemoryStats).map(([userId, stats]) => (
              <button
                key={userId}
                onClick={() => setSelectedUser(userId)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedUser === userId ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{stats.userName}</p>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {stats.count}
                  </span>
                </div>
                <p className="text-xs text-gray-500">ID: {userId}</p>
                <p className="text-xs text-gray-500 mt-1">最后使用: {stats.lastUsed}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Memory Details */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              {selectedUser
                ? `${userMemoryStats[selectedUser]?.userName} 的记忆`
                : '全部记忆条目'}
            </h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {(selectedUser ? getUserMemories(selectedUser) : filteredMemories).map((memory) => {
              const category = categories.find(c => c.value === memory.category);
              const Icon = category?.icon || Database;

              return (
                <div key={memory.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${category?.color || 'bg-gray-100'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{memory.key}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            memory.source === 'auto'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {memory.source === 'auto' ? '自动提取' : '手动添加'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{memory.value}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>分类: {memory.category}</span>
                          <span>提取于: {memory.extractedAt}</span>
                          {memory.lastUsed && <span>最后使用: {memory.lastUsed}</span>}
                          <span>使用次数: {memory.useCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Memory Modal */}
      {showAddMemory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">添加用户记忆</h3>
              <button
                onClick={() => setShowAddMemory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">用户ID</label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入用户ID"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">分类</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">关键词</label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: 家庭住址"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">内容</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入记忆内容"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddMemory(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
