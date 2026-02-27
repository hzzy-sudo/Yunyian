import React, { useState } from 'react';
import { AlertTriangle, Upload, Download, Plus, Edit, Trash2, Shield, Eye } from 'lucide-react';

interface SensitiveWord {
  id: string;
  word: string;
  level: 1 | 2 | 3 | 4;
  category: string;
  action: 'block' | 'warn' | 'replace' | 'log';
  replacement?: string;
  addedBy: string;
  addedAt: string;
}

interface AuditRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  word: string;
  level: number;
  context: string;
  action: string;
}

const mockWords: SensitiveWord[] = [
  {
    id: 'sw_001',
    word: '黄赌毒',
    level: 1,
    category: '违法违规',
    action: 'block',
    addedBy: 'admin',
    addedAt: '2024-01-10',
  },
  {
    id: 'sw_002',
    word: '傻X',
    level: 2,
    category: '侮辱谩骂',
    action: 'block',
    addedBy: 'admin',
    addedAt: '2024-01-10',
  },
  {
    id: 'sw_003',
    word: '广告推销',
    level: 3,
    category: '广告骚扰',
    action: 'warn',
    addedBy: 'admin',
    addedAt: '2024-01-11',
  },
  {
    id: 'sw_004',
    word: '数据库密码',
    level: 4,
    category: '数据泄露',
    action: 'replace',
    replacement: '***',
    addedBy: 'admin',
    addedAt: '2024-01-12',
  },
  {
    id: 'sw_005',
    word: '内部文档',
    level: 4,
    category: '数据泄露',
    action: 'warn',
    addedBy: 'admin',
    addedAt: '2024-01-13',
  },
];

const mockAuditRecords: AuditRecord[] = [
  {
    id: 'audit_001',
    timestamp: '2024-01-16 10:23:45',
    userId: 'USER20156',
    userName: '周九',
    word: '傻X',
    level: 2,
    context: '你们的系统真是***',
    action: '已拦截',
  },
  {
    id: 'audit_002',
    timestamp: '2024-01-16 09:45:12',
    userId: 'EMP10089',
    userName: '刘十',
    word: '数据库密码',
    level: 4,
    context: '***是 admin123',
    action: '已脱敏',
  },
  {
    id: 'audit_003',
    timestamp: '2024-01-15 16:30:20',
    userId: 'USER20234',
    userName: '王五',
    word: '广告推销',
    level: 3,
    context: '需要***吗？联系...',
    action: '已警告',
  },
];

const levelConfig = [
  {
    level: 1,
    name: '一级 - 违法违规',
    color: 'bg-red-100 text-red-700 border-red-300',
    description: '黄赌毒暴等违法内容',
    action: '终止会话',
  },
  {
    level: 2,
    name: '二级 - 侮辱谩骂',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: '侮辱谩骂、政治敏感',
    action: '拦截消息+终止会话',
  },
  {
    level: 3,
    name: '三级 - 广告骚扰',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    description: '广告、骚扰、无意义',
    action: '记录+降低优先级',
  },
  {
    level: 4,
    name: '四级 - 数据泄露',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: '内部数据泄露风险',
    action: '脱敏处理+风险提示',
  },
];

export function SensitiveWordManagement() {
  const [activeTab, setActiveTab] = useState<'words' | 'audit' | 'config'>('words');
  const [showAddWord, setShowAddWord] = useState(false);
  const [newWord, setNewWord] = useState({
    word: '',
    level: 3 as 1 | 2 | 3 | 4,
    category: '',
    action: 'warn' as 'block' | 'warn' | 'replace' | 'log',
    replacement: '',
  });

  const getLevelBadge = (level: number) => {
    const config = levelConfig.find(c => c.level === level);
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config?.color}`}>
        {config?.name.split(' - ')[0]}
      </span>
    );
  };

  const getActionBadge = (action: string) => {
    const colors = {
      block: 'bg-red-50 text-red-700',
      warn: 'bg-yellow-50 text-yellow-700',
      replace: 'bg-blue-50 text-blue-700',
      log: 'bg-gray-50 text-gray-700',
    };
    const labels = {
      block: '拦截',
      warn: '警告',
      replace: '替换',
      log: '记录',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[action as keyof typeof colors]}`}>
        {labels[action as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">敏感词管理</h2>
        <p className="text-sm text-gray-500 mt-1">维护敏感词库，保障会话内容合法性</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {levelConfig.map((config) => (
          <div key={config.level} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
                {config.name.split(' - ')[0]}
              </span>
              <AlertTriangle className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {mockWords.filter(w => w.level === config.level).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">{config.description}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('words')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'words'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              敏感词库
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'audit'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              审查记录
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'config'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              策略配置
            </button>
          </div>
        </div>

        {/* Words Tab */}
        {activeTab === 'words' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">共 {mockWords.length} 个敏感词</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  批量导入
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  导出
                </button>
                <button
                  onClick={() => setShowAddWord(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加敏感词
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">敏感词</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">级别</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">处理策略</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">替换词</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">添加时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockWords.map((word) => (
                    <tr key={word.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{word.word}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getLevelBadge(word.level)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{word.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getActionBadge(word.action)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {word.replacement || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {word.addedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
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

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">共 {mockAuditRecords.length} 条审查记录</p>
            </div>

            <div className="space-y-4">
              {mockAuditRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${
                        record.level === 1 ? 'text-red-500' :
                        record.level === 2 ? 'text-orange-500' :
                        record.level === 3 ? 'text-yellow-500' : 'text-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.userName} (ID: {record.userId})
                        </p>
                        <p className="text-xs text-gray-500">{record.timestamp}</p>
                      </div>
                    </div>
                    {getLevelBadge(record.level)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">触发词:</span>
                      <span className="px-2 py-1 bg-red-50 text-red-700 text-sm rounded">
                        {record.word}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">上下文:</span>
                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                        {record.context}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">处理动作:</span>
                      <span className="text-sm text-blue-600">{record.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Config Tab */}
        {activeTab === 'config' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">敏感词分级策略</h3>
                <div className="space-y-4">
                  {levelConfig.map((config) => (
                    <div key={config.level} className={`border-2 rounded-lg p-4 ${config.color}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{config.name}</h4>
                          <p className="text-sm text-gray-700 mt-1">{config.description}</p>
                        </div>
                        <Shield className="w-6 h-6" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">处理策略</p>
                          <p className="text-sm text-gray-900">{config.action}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">日志记录</p>
                          <p className="text-sm text-gray-900">记录用户+内容</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">审查配置</h3>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">输入审查</p>
                      <p className="text-xs text-gray-500">用户输入内容实时检测</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">输出审查</p>
                      <p className="text-xs text-gray-500">AI回复内容检测</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">自动脱敏</p>
                      <p className="text-xs text-gray-500">自动识别并脱敏敏感信息</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Word Modal */}
      {showAddWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">添加敏感词</h3>
              <button
                onClick={() => setShowAddWord(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">敏感词</label>
                <input
                  type="text"
                  value={newWord.word}
                  onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入敏感词"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">级别</label>
                <select
                  value={newWord.level}
                  onChange={(e) => setNewWord({ ...newWord, level: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {levelConfig.map((config) => (
                    <option key={config.level} value={config.level}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">分类</label>
                <input
                  type="text"
                  value={newWord.category}
                  onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入分类"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">处理策略</label>
                <select
                  value={newWord.action}
                  onChange={(e) => setNewWord({ ...newWord, action: e.target.value as 'block' | 'warn' | 'replace' | 'log' })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="block">拦截</option>
                  <option value="warn">警告</option>
                  <option value="replace">替换</option>
                  <option value="log">记录</option>
                </select>
              </div>
              {newWord.action === 'replace' && (
                <div>
                  <label className="text-sm font-medium text-gray-700">替换词</label>
                  <input
                    type="text"
                    value={newWord.replacement}
                    onChange={(e) => setNewWord({ ...newWord, replacement: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如: ***"
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddWord(false)}
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
