import React, { useState } from 'react';
import { 
  MessageSquare, 
  Shield, 
  Brain, 
  ThumbsUp, 
  AlertTriangle, 
  Database,
  FileText,
  Settings,
  BarChart3,
  Users,
  Wrench,
  Layers
} from 'lucide-react';
import { SessionManagement } from './components/SessionManagement';
import { PermissionControl } from './components/PermissionControl';
import { EnhancedPermissionControl } from './components/EnhancedPermissionControl';
import { ContextEngineering } from './components/ContextEngineering';
import { FeedbackManagement } from './components/FeedbackManagement';
import { SensitiveWordManagement } from './components/SensitiveWordManagement';
import { UserMemory } from './components/UserMemory';
import { AuditLog } from './components/AuditLog';
import { Dashboard } from './components/Dashboard';
import { McpToolManagement } from './components/McpToolManagement';
import { DifyApplicationManagement } from './components/DifyApplicationManagement';

type TabType = 'dashboard' | 'dify' | 'session' | 'permission' | 'context' | 'feedback' | 'sensitive' | 'memory' | 'audit' | 'mcp';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: '数据概览', icon: BarChart3 },
    { id: 'dify' as TabType, label: 'Dify应用', icon: Layers },
    { id: 'session' as TabType, label: '会话管理', icon: MessageSquare },
    { id: 'permission' as TabType, label: '权限控制', icon: Shield },
    { id: 'context' as TabType, label: '上下文工程', icon: Brain },
    { id: 'feedback' as TabType, label: '会话反馈', icon: ThumbsUp },
    { id: 'sensitive' as TabType, label: '敏感词管理', icon: AlertTriangle },
    { id: 'memory' as TabType, label: '用户记忆', icon: Database },
    { id: 'mcp' as TabType, label: 'MCP工具', icon: Wrench },
    { id: 'audit' as TabType, label: '审计日志', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'dify':
        return <DifyApplicationManagement />;
      case 'session':
        return <SessionManagement />;
      case 'permission':
        return <EnhancedPermissionControl />;
      case 'context':
        return <ContextEngineering />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'sensitive':
        return <SensitiveWordManagement />;
      case 'memory':
        return <UserMemory />;
      case 'mcp':
        return <McpToolManagement />;
      case 'audit':
        return <AuditLog />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">会话管理中心</h1>
                <p className="text-sm text-gray-500">统一会话调度中台管理系统</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">管理员</p>
                <p className="text-xs text-gray-500">TENANT_SCS</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}