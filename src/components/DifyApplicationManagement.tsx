import React, { useState } from 'react';
import { Layers, Key, Plus, Edit, Trash2, Copy, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, Link, Activity, Code, ExternalLink, Settings } from 'lucide-react';

interface McpBinding {
  id: string;
  name: string;
  type: 'mcp' | 'api';
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  authentication?: {
    type: 'none' | 'apiKey' | 'bearer' | 'basic';
    config?: Record<string, string>;
  };
  enabled: boolean;
}

interface WorkflowParameter {
  id: string;
  name: string;
  source: 'user_memory' | 'sensitive_words' | 'context' | 'session_info' | 'custom';
  mapping: string; // Dify工作流中的变量名
  required: boolean;
  description: string;
}

interface AccessConfig {
  pageUrl: string;
  embedUrl: string;
  apiEndpoint: string;
  allowedDomains: string[];
  embedCode: {
    iframe: string;
    sdk: string;
    api: string;
  };
}

interface ApiKey {
  id: string;
  key: string;
  name: string;
  status: 'active' | 'disabled' | 'expired';
  usage: number;
  limit: number;
  createdAt: string;
  lastUsed?: string;
}

interface DifyApplication {
  id: string;
  name: string;
  appType: string;
  description: string;
  difyWorkflowId: string; // Dify工作流ID
  difyEndpoint: string; // Dify API端点
  status: 'active' | 'inactive' | 'error';
  apiKeys: ApiKey[];
  mcpBindings: McpBinding[]; // MCP/API绑定
  workflowParameters: WorkflowParameter[]; // 传入参数配置
  accessConfig: AccessConfig; // 访问配置
  strategy: 'round-robin' | 'random' | 'least-used';
  todayCalls: number;
  totalCalls: number;
  avgResponseTime: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

const mockApplications: DifyApplication[] = [
  {
    id: 'app_001',
    name: '智能客服助手',
    appType: 'CUSTOMER_SERVICE',
    description: '为客服人员提供智能对话支持，处理常见咨询和工单',
    difyWorkflowId: 'wf_customer_service_001',
    difyEndpoint: 'https://api.dify.ai/v1/workflows/run',
    status: 'active',
    apiKeys: [
      {
        id: 'key_001',
        key: 'app-xxxxx-yyyyy-zzzzz-11111',
        name: '生产环境主Key',
        status: 'active',
        usage: 15234,
        limit: 100000,
        createdAt: '2024-01-01',
        lastUsed: '2024-01-16 10:35:23',
      },
    ],
    mcpBindings: [
      {
        id: 'mcp_001',
        name: '查询用户余额',
        type: 'mcp',
        endpoint: 'mcp://query_balance',
        enabled: true,
      },
      {
        id: 'mcp_002',
        name: '创建工单API',
        type: 'api',
        endpoint: 'https://api.example.com/tickets',
        method: 'POST',
        authentication: {
          type: 'bearer',
          config: { token: 'xxx' },
        },
        enabled: true,
      },
    ],
    workflowParameters: [
      {
        id: 'param_001',
        name: '用户记忆',
        source: 'user_memory',
        mapping: 'user_context',
        required: false,
        description: '自动注入用户的历史偏好和常用信息',
      },
      {
        id: 'param_002',
        name: '敏感词库',
        source: 'sensitive_words',
        mapping: 'forbidden_words',
        required: true,
        description: '传入敏感词列表，用于内容审查',
      },
      {
        id: 'param_003',
        name: '会话上下文',
        source: 'context',
        mapping: 'conversation_history',
        required: true,
        description: '当前会话的上下文信息',
      },
    ],
    accessConfig: {
      pageUrl: 'https://chat.example.com/customer-service',
      embedUrl: 'https://chat.example.com/embed/customer-service',
      apiEndpoint: 'https://api.example.com/v1/chat/customer-service',
      allowedDomains: ['example.com', 'app.example.com'],
      embedCode: {
        iframe: '<iframe src="https://chat.example.com/embed/customer-service" width="100%" height="600px"></iframe>',
        sdk: 'const chat = new ChatSDK({ appId: "CUSTOMER_SERVICE", apiKey: "your-api-key" });',
        api: 'POST https://api.example.com/v1/chat/customer-service',
      },
    },
    strategy: 'round-robin',
    todayCalls: 1234,
    totalCalls: 24123,
    avgResponseTime: 1234,
    successRate: 98.5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-16',
  },
];

export function DifyApplicationManagement() {
  const [activeTab, setActiveTab] = useState<'applications' | 'config' | 'access' | 'monitoring'>('applications');
  const [selectedApp, setSelectedApp] = useState<DifyApplication | null>(null);
  const [showAddApp, setShowAddApp] = useState(false);
  const [showBindingConfig, setShowBindingConfig] = useState(false);
  const [showParameterConfig, setShowParameterConfig] = useState(false);
  const [showAccessConfig, setShowAccessConfig] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dify应用管理</h2>
        <p className="text-sm text-gray-500 mt-1">配置Dify工作流、绑定MCP服务、生成访问页面和管理API Key</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">应用总数</p>
              <p className="text-2xl font-semibold text-gray-900">{mockApplications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">运行中应用</p>
              <p className="text-2xl font-semibold text-green-600">
                {mockApplications.filter(app => app.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Link className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">MCP绑定</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockApplications.reduce((sum, app) => sum + app.mcpBindings.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">今日总调用</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockApplications.reduce((sum, app) => sum + app.todayCalls, 0).toLocaleString()}
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
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'applications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              应用列表
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'config'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              绑定配置
            </button>
            <button
              onClick={() => setActiveTab('access')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'access'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              访问配置
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'monitoring'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              监控面板
            </button>
          </div>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">共 {mockApplications.length} 个应用</p>
              <button
                onClick={() => setShowAddApp(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建应用
              </button>
            </div>

            <div className="space-y-4">
              {mockApplications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          app.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status === 'active' ? '运行中' : '已停用'}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-mono">
                          {app.appType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">工作流ID:</span>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{app.difyWorkflowId}</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">访问地址:</span>
                          <a href={app.accessConfig.pageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                            {app.accessConfig.pageUrl.substring(0, 40)}...
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setActiveTab('config');
                        }}
                        className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      >
                        配置
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setActiveTab('access');
                        }}
                        className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      >
                        访问
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">MCP绑定</p>
                      <p className="text-lg font-semibold text-gray-900">{app.mcpBindings.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">传入参数</p>
                      <p className="text-lg font-semibold text-gray-900">{app.workflowParameters.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">今日调用</p>
                      <p className="text-lg font-semibold text-gray-900">{app.todayCalls}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">成功率</p>
                      <p className="text-lg font-semibold text-green-600">{app.successRate}%</p>
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
            {selectedApp ? (
              <div className="space-y-6">
                {/* Dify工作流配置 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dify工作流配置</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">工作流ID</label>
                      <input
                        type="text"
                        value={selectedApp.difyWorkflowId}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Dify API端点</label>
                      <input
                        type="text"
                        value={selectedApp.difyEndpoint}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* MCP/API绑定 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">MCP/API绑定配置</h3>
                    <button
                      onClick={() => setShowBindingConfig(true)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      添加绑定
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedApp.mcpBindings.map((binding) => (
                      <div key={binding.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{binding.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              binding.type === 'mcp' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {binding.type.toUpperCase()}
                            </span>
                            {binding.enabled && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <code className="text-xs text-gray-600">{binding.endpoint}</code>
                          {binding.method && (
                            <span className="ml-2 text-xs text-gray-500">• {binding.method}</span>
                          )}
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
                    ))}
                  </div>
                </div>

                {/* 工作流参数配置 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">工作流参数配置</h3>
                      <p className="text-sm text-gray-500 mt-1">配置传入Dify工作流的参数（用户记忆、敏感词等）</p>
                    </div>
                    <button
                      onClick={() => setShowParameterConfig(true)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      添加参数
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedApp.workflowParameters.map((param) => (
                      <div key={param.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{param.name}</span>
                              <span className={`px-2 py-0.5 text-xs rounded ${
                                param.source === 'user_memory' ? 'bg-green-100 text-green-700' :
                                param.source === 'sensitive_words' ? 'bg-red-100 text-red-700' :
                                param.source === 'context' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {param.source}
                              </span>
                              {param.required && (
                                <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">必填</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{param.description}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <span>映射到:</span>
                              <code className="bg-white px-2 py-1 rounded border border-gray-200">{param.mapping}</code>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
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

                {/* 数据流示意图 */}
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-blue-900 mb-4">数据流示意图</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="px-3 py-2 bg-white border border-blue-200 rounded">用户请求</div>
                      <div className="text-blue-400">→</div>
                      <div className="px-3 py-2 bg-white border border-blue-200 rounded">会话管理平台</div>
                      <div className="text-blue-400">→</div>
                      <div className="px-3 py-2 bg-white border border-blue-200 rounded flex-1">
                        <div className="font-medium mb-1">注入参数:</div>
                        <div className="space-y-1 text-xs text-gray-600">
                          {selectedApp.workflowParameters.map(p => (
                            <div key={p.id}>• {p.name} → {p.mapping}</div>
                          ))}
                        </div>
                      </div>
                      <div className="text-blue-400">→</div>
                      <div className="px-3 py-2 bg-white border border-blue-200 rounded">Dify工作流</div>
                      <div className="text-blue-400">→</div>
                      <div className="px-3 py-2 bg-white border border-blue-200 rounded">MCP工具调用</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Layers className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>请从应用列表选择一个应用进行配置</p>
              </div>
            )}
          </div>
        )}

        {/* Access Tab */}
        {activeTab === 'access' && (
          <div className="p-6">
            {selectedApp ? (
              <div className="space-y-6">
                {/* 访问地址 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">访问地址配置</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">会话页面URL</label>
                      <div className="mt-1 flex gap-2">
                        <input
                          type="text"
                          value={selectedApp.accessConfig.pageUrl}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                          readOnly
                        />
                        <button
                          onClick={() => copyToClipboard(selectedApp.accessConfig.pageUrl, 'pageUrl')}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {copiedCode === 'pageUrl' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a
                          href={selectedApp.accessConfig.pageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          访问
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">嵌入页面URL</label>
                      <div className="mt-1 flex gap-2">
                        <input
                          type="text"
                          value={selectedApp.accessConfig.embedUrl}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                          readOnly
                        />
                        <button
                          onClick={() => copyToClipboard(selectedApp.accessConfig.embedUrl, 'embedUrl')}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {copiedCode === 'embedUrl' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">API端点</label>
                      <div className="mt-1 flex gap-2">
                        <input
                          type="text"
                          value={selectedApp.accessConfig.apiEndpoint}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                          readOnly
                        />
                        <button
                          onClick={() => copyToClipboard(selectedApp.accessConfig.apiEndpoint, 'apiEndpoint')}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {copiedCode === 'apiEndpoint' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 嵌入代码 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">嵌入代码</h3>
                  
                  {/* iframe方式 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">iframe嵌入</label>
                      <button
                        onClick={() => copyToClipboard(selectedApp.accessConfig.embedCode.iframe, 'iframe')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {copiedCode === 'iframe' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        复制代码
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{selectedApp.accessConfig.embedCode.iframe}</code>
                    </pre>
                  </div>

                  {/* SDK方式 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">SDK集成</label>
                      <button
                        onClick={() => copyToClipboard(selectedApp.accessConfig.embedCode.sdk, 'sdk')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {copiedCode === 'sdk' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        复制代码
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{selectedApp.accessConfig.embedCode.sdk}</code>
                    </pre>
                  </div>

                  {/* API调用方式 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">API调用</label>
                      <button
                        onClick={() => copyToClipboard(selectedApp.accessConfig.embedCode.api, 'api')}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {copiedCode === 'api' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        复制代码
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{selectedApp.accessConfig.embedCode.api}</code>
                    </pre>
                  </div>
                </div>

                {/* 域名白名单 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">域名白名单</h3>
                  <div className="space-y-2">
                    {selectedApp.accessConfig.allowedDomains.map((domain, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <code className="flex-1 text-sm">{domain}</code>
                        <button className="text-red-600 hover:bg-red-50 p-1 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600">
                      + 添加域名
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ExternalLink className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>请从应用列表选择一个应用查看访问配置</p>
              </div>
            )}
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="p-6">
            <div className="space-y-6">
              {mockApplications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status === 'active' ? '运行中' : '已停用'}
                      </span>
                    </div>
                    <code className="text-sm text-blue-600">{app.appType}</code>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">今日调用</p>
                      <p className="text-2xl font-semibold text-blue-900">{app.todayCalls.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700 mb-1">成功率</p>
                      <p className="text-2xl font-semibold text-green-900">{app.successRate}%</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-700 mb-1">平均响应</p>
                      <p className="text-2xl font-semibold text-orange-900">{app.avgResponseTime}ms</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 mb-1">MCP绑定</p>
                      <p className="text-2xl font-semibold text-purple-900">{app.mcpBindings.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
