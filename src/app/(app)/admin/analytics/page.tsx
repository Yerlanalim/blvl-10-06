"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Trophy, 
  Crown, 
  BarChart3,
  AlertCircle,
  Loader2,
  DollarSign,
  Target,
  Brain
} from 'lucide-react';
import { createSPASassClient } from '@/lib/supabase/client';

interface AnalyticsData {
  usersByTier: {
    free: number;
    paid: number;
  };
  levelCompletionRates: {
    level: number;
    completionRate: number;
    totalUsers: number;
    completedUsers: number;
  }[];
  aiUsagePatterns: {
    totalMessages: number;
    avgMessagesPerUser: number;
    quotaExceededEvents: number;
    dailyActiveUsers: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    monthlyRecurring: number;
    conversionRate: number;
    churnRate: number;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();

      // Check if user has admin access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Get users by tier
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('tier_type, current_level, completed_lessons, ai_messages_count, created_at');

      if (profilesError) throw profilesError;

      // Calculate user metrics
      const usersByTier = {
        free: userProfiles?.filter(p => p.tier_type === 'free' || !p.tier_type).length || 0,
        paid: userProfiles?.filter(p => p.tier_type === 'paid').length || 0,
      };

      // Calculate level completion rates
      const levelCompletionRates = [];
      for (let level = 1; level <= 10; level++) {
        const usersWithAccess = level <= 3 
          ? userProfiles?.length || 0
          : userProfiles?.filter(p => p.tier_type === 'paid').length || 0;
        
        const completedUsers = userProfiles?.filter(p => 
          (p.completed_lessons || []).includes(level)
        ).length || 0;

        const completionRate = usersWithAccess > 0 ? (completedUsers / usersWithAccess) * 100 : 0;

        levelCompletionRates.push({
          level,
          completionRate,
          totalUsers: usersWithAccess,
          completedUsers
        });
      }

      // Calculate AI usage patterns
      const totalMessages = userProfiles?.reduce((sum, p) => sum + (p.ai_messages_count || 0), 0) || 0;
      const avgMessagesPerUser = userProfiles?.length ? totalMessages / userProfiles.length : 0;
      
      // Simulate some metrics (in real app, these would come from analytics data)
      const quotaExceededEvents = Math.floor(usersByTier.free * 0.3); // 30% of free users hit quota
      const dailyActiveUsers = Math.floor((usersByTier.free + usersByTier.paid) * 0.4); // 40% daily active

      // Calculate revenue metrics
      const monthlyRecurring = usersByTier.paid * 29; // $29 per paid user
      const totalRevenue = monthlyRecurring; // Simplified for demo
      const conversionRate = usersByTier.free > 0 ? (usersByTier.paid / (usersByTier.free + usersByTier.paid)) * 100 : 0;
      const churnRate = 5; // Simulated 5% monthly churn

      setData({
        usersByTier,
        levelCompletionRates,
        aiUsagePatterns: {
          totalMessages,
          avgMessagesPerUser,
          quotaExceededEvents,
          dailyActiveUsers
        },
        revenueMetrics: {
          totalRevenue,
          monthlyRecurring,
          conversionRate,
          churnRate
        }
      });

    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No analytics data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">BizLevel Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and metrics</p>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.usersByTier.free + data.usersByTier.paid}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.usersByTier.free} free, {data.usersByTier.paid} premium
            </p>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.revenueMetrics.monthlyRecurring.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.revenueMetrics.conversionRate.toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>

        {/* AI Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.aiUsagePatterns.totalMessages.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.aiUsagePatterns.avgMessagesPerUser.toFixed(1)} avg per user
            </p>
          </CardContent>
        </Card>

        {/* Daily Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.aiUsagePatterns.dailyActiveUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {((data.aiUsagePatterns.dailyActiveUsers / (data.usersByTier.free + data.usersByTier.paid)) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users by Tier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Users by Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Free Tier</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{data.usersByTier.free}</div>
                <div className="text-sm text-gray-500">
                  {((data.usersByTier.free / (data.usersByTier.free + data.usersByTier.paid)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Premium Tier</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{data.usersByTier.paid}</div>
                <div className="text-sm text-gray-500">
                  {((data.usersByTier.paid / (data.usersByTier.free + data.usersByTier.paid)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Visual representation */}
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(data.usersByTier.paid / (data.usersByTier.free + data.usersByTier.paid)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Level Completion Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.levelCompletionRates.map((level) => (
              <div key={level.level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Level {level.level}</span>
                  <div className="text-right">
                    <span className="font-semibold">{level.completionRate.toFixed(1)}%</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({level.completedUsers}/{level.totalUsers})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      level.completionRate >= 70 ? 'bg-green-500' :
                      level.completionRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${level.completionRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Usage Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Usage Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Messages Sent</span>
                <span className="font-semibold">{data.aiUsagePatterns.totalMessages.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average per User</span>
                <span className="font-semibold">{data.aiUsagePatterns.avgMessagesPerUser.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Quota Exceeded Events</span>
                <span className="font-semibold text-orange-600">{data.aiUsagePatterns.quotaExceededEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Daily Active Users</span>
                <span className="font-semibold text-green-600">{data.aiUsagePatterns.dailyActiveUsers}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Revenue Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${data.revenueMetrics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${data.revenueMetrics.monthlyRecurring.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Monthly Recurring</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data.revenueMetrics.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Conversion Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.revenueMetrics.churnRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Churn Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.revenueMetrics.conversionRate < 10 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Low Conversion Rate</div>
                  <div className="text-sm text-yellow-700">
                    Consider improving onboarding experience or adding more value to premium tier.
                  </div>
                </div>
              </div>
            )}
            
            {data.aiUsagePatterns.quotaExceededEvents > data.usersByTier.free * 0.4 && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-800">High Quota Usage</div>
                  <div className="text-sm text-orange-700">
                    Many free users are hitting AI limits. Consider upgrade prompts or increasing free quota.
                  </div>
                </div>
              </div>
            )}
            
            {data.levelCompletionRates.slice(0, 3).some(l => l.completionRate < 50) && (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">Low Completion Rates</div>
                  <div className="text-sm text-red-700">
                    Early levels have low completion rates. Review content difficulty and user experience.
                  </div>
                </div>
              </div>
            )}
            
            {data.aiUsagePatterns.dailyActiveUsers / (data.usersByTier.free + data.usersByTier.paid) > 0.3 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">High User Engagement</div>
                  <div className="text-sm text-green-700">
                    Strong daily active user rate indicates good product-market fit.
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 