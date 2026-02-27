import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, AlertCircle, TrendingUp, Filter, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Feedback {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  rating: number;
  tags: string[];
  comment?: string;
  timestamp: string;
  messageContent: string;
  resolved: boolean;
}

const mockFeedbacks: Feedback[] = [
  {
    id: 'fb_001',
    sessionId: 'scs_20240116_001',
    userId: 'EMP10086',
    userName: '张三',
    rating: 5,
    tags: ['数据准确', '响应快'],
    comment: '查询速度很快，数据很准确',
    timestamp: '2024-01-16 09:15:23',
    messageContent: '您的账户余额为 1,234.56 元',
    resolved: true,
  },
  {
    id: 'fb_002',
    sessionId: 'scs_20240116_004',
    userId: 'USER20235',
    userName: '赵六',
    rating: 4,
    tags: ['有帮助'],
    timestamp: '2024-01-16 09:50:12',
    messageContent: '已为您查询到缴费记录',
    resolved: true,
  },
  {
    id: 'fb_003',
    sessionId: 'scs_20240115_089',
    userId: 'USER20180',
    userName: '孙八',
    rating: 2,
    tags: ['不准确', '响应慢'],
    comment: '数据好像有问题，而且等了很久',
    timestamp: '2024-01-15 15:23:45',
    messageContent: '查询超时，请稍后重试',
    resolved: false,
  },
  {
    id: 'fb_004',
    sessionId: 'scs_20240115_067',
    userId: 'EMP10087',
    userName: '李四',
    rating: 5,
    tags: ['数据准确', '易用'],
    comment: '非常好用，解决了我的问题',
    timestamp: '2024-01-15 14:10:30',
    messageContent: '工单 #12345 已成功创建',
    resolved: true,
  },
  {
    id: 'fb_005',
    sessionId: 'scs_20240115_034',
    userId: 'USER20156',
    userName: '周九',
    rating: 1,
    tags: ['无法理解', '没有帮助'],
    comment: '完全没理解我的问题',
    timestamp: '2024-01-15 11:45:18',
    messageContent: '抱歉，我不太理解您的问题',
    resolved: false,
  },
];

const ratingTrendData = [
  { date: '01-10', avgRating: 4.2, count: 45 },
  { date: '01-11', avgRating: 4.5, count: 52 },
  { date: '01-12', avgRating: 4.3, count: 48 },
  { date: '01-13', avgRating: 4.6, count: 63 },
  { date: '01-14', avgRating: 4.7, count: 71 },
  { date: '01-15', avgRating: 4.4, count: 58 },
  { date: '01-16', avgRating: 4.6, count: 34 },
];

const tagDistributionData = [
  { tag: '数据准确', count: 156 },
  { tag: '响应快', count: 134 },
  { tag: '有帮助', count: 98 },
  { tag: '易用', count: 76 },
  { tag: '不准确', count: 23 },
  { tag: '响应慢', count: 18 },
];

export function FeedbackManagement() {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterResolved, setFilterResolved] = useState<string>('all');

  const filteredFeedbacks = mockFeedbacks.filter(fb => {
    const matchesRating = filterRating === 'all' || fb.rating === filterRating;
    const matchesResolved = filterResolved === 'all' || 
      (filterResolved === 'resolved' && fb.resolved) ||
      (filterResolved === 'unresolved' && !fb.resolved);
    return matchesRating && matchesResolved;
  });

  const avgRating = (
    mockFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / mockFeedbacks.length
  ).toFixed(1);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">会话反馈管理</h2>
        <p className="text-sm text-gray-500 mt-1">收集和分析用户对会话质量的反馈</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">平均评分</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{avgRating}</p>
          <p className="text-xs text-gray-500 mt-1">满分 5.0</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">好评数</span>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            {mockFeedbacks.filter(fb => fb.rating >= 4).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">4-5星评价</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsDown className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">差评数</span>
          </div>
          <p className="text-2xl font-semibold text-red-600">
            {mockFeedbacks.filter(fb => fb.rating <= 2).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">1-2星评价</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">待处理</span>
          </div>
          <p className="text-2xl font-semibold text-orange-600">
            {mockFeedbacks.filter(fb => !fb.resolved).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">需要跟进</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">反馈率</span>
          </div>
          <p className="text-2xl font-semibold text-blue-600">68%</p>
          <p className="text-xs text-gray-500 mt-1">会话反馈率</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">评分趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ratingTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgRating" stroke="#3b82f6" strokeWidth={2} name="平均评分" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">反馈标签分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tagDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="tag" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="次数" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">筛选:</span>
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部评分</option>
            <option value={5}>5星</option>
            <option value={4}>4星</option>
            <option value={3}>3星</option>
            <option value={2}>2星</option>
            <option value={1}>1星</option>
          </select>
          <select
            value={filterResolved}
            onChange={(e) => setFilterResolved(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部状态</option>
            <option value="resolved">已处理</option>
            <option value="unresolved">待处理</option>
          </select>
          <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出反馈
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">反馈列表 ({filteredFeedbacks.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {renderStars(feedback.rating)}
                  <span className="text-sm text-gray-600">
                    {feedback.userName} · {feedback.timestamp}
                  </span>
                  {!feedback.resolved && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                      待处理
                    </span>
                  )}
                </div>
                <code className="text-xs font-mono text-blue-600">{feedback.sessionId}</code>
              </div>

              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">助手回复: {feedback.messageContent}</p>
              </div>

              {feedback.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {feedback.tags.map((tag, idx) => {
                    const isNegative = ['不准确', '响应慢', '无法理解', '没有帮助'].includes(tag);
                    return (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isNegative
                            ? 'bg-red-50 text-red-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}

              {feedback.comment && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
                </div>
              )}

              <div className="flex gap-2">
                {!feedback.resolved && (
                  <>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      标记已处理
                    </button>
                    <button className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors">
                      创建工单
                    </button>
                  </>
                )}
                <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">
                  查看会话
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
