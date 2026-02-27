import React, { useState } from 'react';
import { Brain, FileText, Layers, Zap, Plus, Edit, Trash2, Save } from 'lucide-react';

interface ContextStrategy {
  id: string;
  name: string;
  windowSize: number;
  compressionThreshold: number;
  retentionPolicy: string;
  enabled: boolean;
}

interface PromptTemplate {
  id: string;
  name: string;
  scenario: string;
  role: string;
  template: string;
  variables: string[];
  enabled: boolean;
}

const mockStrategies: ContextStrategy[] = [
  {
    id: 'strategy_001',
    name: '标准会话策略',
    windowSize: 10,
    compressionThreshold: 20,
    retentionPolicy: 'recent',
    enabled: true,
  },
  {
    id: 'strategy_002',
    name: '客服长对话策略',
    windowSize: 20,
    compressionThreshold: 40,
    retentionPolicy: 'important',
    enabled: true,
  },
  {
    id: 'strategy_003',
    name: '快速查询策略',
    windowSize: 5,
    compressionThreshold: 10,
    retentionPolicy: 'minimal',
    enabled: true,
  },
];

const mockTemplates: PromptTemplate[] = [
  {
    id: 'template_001',
    name: '余额查询助手',
    scenario: '用户余额查询',
    role: 'assistant',
    template: '您好，我是智能客服助手。我可以帮您查询账户余额。请提供您的{户号}或{用户编号}。',
    variables: ['户号', '用户编号'],
    enabled: true,
  },
  {
    id: 'template_002',
    name: '数据诊断专家',
    scenario: '数据异常诊断',
    role: 'expert',
    template: '我是数据诊断专家，将帮您分析{指标}的异常情况。请告诉我您关注的{时间范围}和{维度}。',
    variables: ['指标', '时间范围', '维度'],
    enabled: true,
  },
  {
    id: 'template_003',
    name: '工单处理助手',
    scenario: '工单处理',
    role: 'support',
    template: '我是工单处理助手，将协助您处理{工单类型}。当前工单编号：{工单号}，状态：{状态}。',
    variables: ['工单类型', '工单号', '状态'],
    enabled: true,
  },
];

interface IntentState {
  sessionId: string;
  currentIntent: string;
  confidence: number;
  history: Array<{ intent: string; timestamp: string }>;
}

const mockIntentStates: IntentState[] = [
  {
    sessionId: 'scs_20240116_001',
    currentIntent: 'query_balance',
    confidence: 0.92,
    history: [
      { intent: 'greeting', timestamp: '09:00:00' },
      { intent: 'query_balance', timestamp: '09:00:15' },
    ],
  },
  {
    sessionId: 'scs_20240116_002',
    currentIntent: 'report_fault',
    confidence: 0.87,
    history: [
      { intent: 'report_fault', timestamp: '09:15:30' },
    ],
  },
];

export function ContextEngineering() {
  const [activeTab, setActiveTab] = useState<'strategies' | 'templates' | 'intents'>('strategies');
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">上下文工程模块</h2>
        <p className="text-sm text-gray-500 mt-1">管理对话上下文、提示词模板和意图追踪</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">上下文策略</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStrategies.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">提示词模板</p>
              <p className="text-2xl font-semibold text-gray-900">{mockTemplates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">活跃意图追踪</p>
              <p className="text-2xl font-semibold text-gray-900">{mockIntentStates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">平均压缩率</p>
              <p className="text-2xl font-semibold text-gray-900">35%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('strategies')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'strategies'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              压缩策略
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              提示词模板
            </button>
            <button
              onClick={() => setActiveTab('intents')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'intents'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              意图追踪
            </button>
          </div>
        </div>

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">配置上下文管理和压缩策略</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加策略
              </button>
            </div>

            <div className="space-y-4">
              {mockStrategies.map((strategy) => (
                <div key={strategy.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                        {strategy.enabled && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            已启用
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">窗口大小</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{strategy.windowSize} 条消息</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">压缩阈值</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{strategy.compressionThreshold} 条</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">保留策略</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {strategy.retentionPolicy === 'recent' && '保留最新'}
                            {strategy.retentionPolicy === 'important' && '保留重要'}
                            {strategy.retentionPolicy === 'minimal' && '最小化'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-xs">
                    <p className="text-gray-600 mb-1">策略说明：</p>
                    <p className="text-gray-700">
                      保留最近 {strategy.windowSize} 条消息，当消息数超过 {strategy.compressionThreshold} 条时自动压缩，
                      采用{strategy.retentionPolicy === 'recent' ? '保留最新消息' : strategy.retentionPolicy === 'important' ? '保留关键信息和实体' : '最小化保留'}策略。
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">管理不同场景的提示词模板</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加模板
              </button>
            </div>

            <div className="space-y-4">
              {mockTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        {template.enabled && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            已启用
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {template.scenario}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">角色: <span className="font-medium text-gray-700">{template.role}</span></p>
                      </div>
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="text-sm text-gray-700 font-mono">{template.template}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500">变量:</span>
                        {template.variables.map((variable, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded font-mono">
                            {`{${variable}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button
                        onClick={() => setEditingTemplate(template)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Intents Tab */}
        {activeTab === 'intents' && (
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">实时追踪用户意图变化和切换</p>
            </div>

            <div className="space-y-4">
              {mockIntentStates.map((state) => (
                <div key={state.sessionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <code className="text-sm font-mono text-blue-600">{state.sessionId}</code>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full font-medium">
                            {state.currentIntent}
                          </span>
                          <span className="text-xs text-gray-500">
                            置信度: <span className="font-medium text-gray-900">{(state.confidence * 100).toFixed(0)}%</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-2">意图历史:</p>
                        <div className="flex items-center gap-2">
                          {state.history.map((item, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && (
                                <div className="w-4 h-px bg-gray-300" />
                              )}
                              <div className="flex flex-col items-center">
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {item.intent}
                                </span>
                                <span className="text-xs text-gray-400 mt-1">{item.timestamp}</span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {state.confidence < 0.6 && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                      ⚠️ 置信度较低，建议启用澄清对话流程
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Template Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">编辑提示词模板</h3>
              <button
                onClick={() => setEditingTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">模板名称</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">应用场景</label>
                  <input
                    type="text"
                    value={editingTemplate.scenario}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">角色定位</label>
                  <input
                    type="text"
                    value={editingTemplate.role}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">模板内容</label>
                <textarea
                  value={editingTemplate.template}
                  rows={6}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">变量 (用 {'{}'} 包裹)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editingTemplate.variables.map((variable, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full font-mono">
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save className="w-4 h-4" />
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
