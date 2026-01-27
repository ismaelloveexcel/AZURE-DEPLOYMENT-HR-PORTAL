import React, { useEffect, useState } from 'react';

interface DashboardMetrics {
  total_employees: number;
  active_employees: number;
  visas_expiring_30: number;
  eids_expiring_30: number;
  pending_onboarding: number;
  pending_passes: number;
  compliance_alerts: number;
}

interface RecentActivity {
  id: number;
  employee_name: string;
  action: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info';
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

interface ImprovedHomePageProps {
  onNavigate: (section: string) => void;
  userRole?: string;
}

export const ImprovedHomePage: React.FC<ImprovedHomePageProps> = ({ onNavigate, userRole }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_employees: 0,
    active_employees: 0,
    visas_expiring_30: 0,
    eids_expiring_30: 0,
    pending_onboarding: 0,
    pending_passes: 0,
    compliance_alerts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch dashboard metrics
      const metricsResponse = await fetch('/api/dashboard/metrics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (metricsResponse.ok) {
        const data = await metricsResponse.json();
        setMetrics(data);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/dashboard/recent-activity', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (activityResponse.ok) {
        const data = await activityResponse.json();
        setRecentActivity(data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-employee',
      label: 'Add Employee',
      description: 'Create new employee record',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      route: 'employees',
      color: 'bg-blue-500',
    },
    {
      id: 'compliance',
      label: 'Compliance Alerts',
      description: 'View expiring documents',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      route: 'compliance-alerts',
      color: 'bg-red-500',
    },
    {
      id: 'export',
      label: 'Export Data',
      description: 'Download employee list',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      route: 'employees',
      color: 'bg-green-500',
    },
    {
      id: 'onboarding',
      label: 'Onboard New Hire',
      description: 'Start onboarding process',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      route: 'onboarding',
      color: 'bg-purple-500',
    },
  ];

  const MetricCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon, color, onClick }) => (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-primary-100 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-primary-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-primary-800 mb-1">{value}</h3>
      <p className="text-sm text-primary-600">{title}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-primary-50 min-h-full">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
        <h1 className="text-3xl font-bold text-primary-800 mb-2">Welcome back! 👋</h1>
        <p className="text-primary-600">Here's what's happening with your workforce today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value={metrics.total_employees}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          color="bg-blue-500"
          onClick={() => onNavigate('employees')}
        />
        
        <MetricCard
          title="Visas Expiring (30d)"
          value={metrics.visas_expiring_30}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          color="bg-red-500"
          onClick={() => onNavigate('compliance-alerts')}
        />
        
        <MetricCard
          title="Emirates IDs Expiring"
          value={metrics.eids_expiring_30}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          }
          color="bg-orange-500"
          onClick={() => onNavigate('compliance-alerts')}
        />
        
        <MetricCard
          title="Pending Onboarding"
          value={metrics.pending_onboarding}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
          color="bg-purple-500"
          onClick={() => onNavigate('onboarding')}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
            <h2 className="text-xl font-semibold text-primary-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.route)}
                  className="flex items-start gap-4 p-4 rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white flex-shrink-0`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-800 mb-1">{action.label}</h3>
                    <p className="text-sm text-primary-600">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
            <h2 className="text-xl font-semibold text-primary-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'warning'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary-800 font-medium">{activity.employee_name}</p>
                      <p className="text-xs text-primary-600">{activity.action}</p>
                      <p className="text-xs text-primary-400 mt-1">
                        {(() => {
                          try {
                            return new Date(activity.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                          } catch {
                            return 'Invalid date';
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-primary-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm text-primary-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      {metrics.compliance_alerts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                {metrics.compliance_alerts} Compliance Alert{metrics.compliance_alerts !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-red-700 mb-4">
                You have documents that are expired or expiring soon. Please review and take action.
              </p>
              <button
                onClick={() => onNavigate('compliance-alerts')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Compliance Alerts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
