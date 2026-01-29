import React, { useEffect, useState } from 'react';

interface Pass {
  id: number;
  pass_number: string;
  pass_type: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  department: string | null;
  position: string | null;
  valid_from: string;
  valid_until: string;
  status: string;
  created_at: string;
  created_by: string;
}

interface PassesModuleProps {
  userRole?: string;
}

export const PassesModule: React.FC<PassesModuleProps> = ({ userRole }) => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'revoked'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);

  useEffect(() => {
    loadPasses();
  }, [filter, typeFilter]);

  const loadPasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = `/api/passes?status=${encodeURIComponent(filter)}${typeFilter !== 'all' ? `&type=${encodeURIComponent(typeFilter)}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPasses(data);
      }
    } catch (error) {
      console.error('Error loading passes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPasses = passes.filter(pass => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pass.full_name.toLowerCase().includes(query) ||
        pass.pass_number.toLowerCase().includes(query) ||
        (pass.email?.toLowerCase() || '').includes(query) ||
        (pass.position?.toLowerCase() || '').includes(query)
      );
    }
    return true;
  });

  const passTypes = [
    { value: 'all', label: 'All Types', icon: '📋', color: 'bg-gray-500' },
    { value: 'recruitment', label: 'Recruitment', icon: '💼', color: 'bg-blue-500' },
    { value: 'onboarding', label: 'Onboarding', icon: '✨', color: 'bg-purple-500' },
    { value: 'manager', label: 'Manager', icon: '👔', color: 'bg-green-500' },
    { value: 'general', label: 'General', icon: '🎫', color: 'bg-orange-500' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      revoked: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['Pass Number', 'Name', 'Type', 'Position', 'Department', 'Valid From', 'Valid Until', 'Status'];
    const rows = filteredPasses.map(pass => [
      pass.pass_number,
      pass.full_name,
      pass.pass_type,
      pass.position || '',
      pass.department || '',
      pass.valid_from,
      pass.valid_until,
      pass.status,
    ]);

    // Properly escape CSV cells (handle quotes, commas, newlines)
    const escapeCSV = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => escapeCSV(cell)).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passes_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-primary-50 min-h-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">Passes & Requests</h1>
            <p className="text-primary-600 mt-1">Manage recruitment, onboarding, and access passes</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            {(userRole === 'admin' || userRole === 'hr') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-accent-green hover:bg-accent-green/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Pass
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 mb-6">
        <div className="flex flex-wrap gap-3">
          {passTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                typeFilter === type.value
                  ? `${type.color} text-white shadow-sm`
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              <span>{type.icon}</span>
              <span className="font-medium">{type.label}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                typeFilter === type.value ? 'bg-white/20' : 'bg-primary-200'
              }`}>
                {type.value === 'all' 
                  ? passes.length 
                  : passes.filter(p => p.pass_type === type.value).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, pass number, email, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent-green focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'expired', 'revoked'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-accent-green text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Passes Grid */}
      {filteredPasses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPasses.map(pass => (
            <div
              key={pass.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-primary-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPass(pass)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {passTypes.find(t => t.value === pass.pass_type)?.icon || '🎫'}
                    </span>
                    <span className="text-xs font-mono text-primary-500">{pass.pass_number}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-800">{pass.full_name}</h3>
                </div>
                {getStatusBadge(pass.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-primary-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{pass.position || 'No position'}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{pass.department || 'No department'}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(pass.valid_from).toLocaleDateString()} - {new Date(pass.valid_until).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary-100 text-xs text-primary-500">
                Created by {pass.created_by} on {new Date(pass.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-primary-100">
          <svg className="w-16 h-16 text-primary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 className="text-xl font-semibold text-primary-800 mb-2">No passes found</h3>
          <p className="text-primary-600 mb-4">
            {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first pass'}
          </p>
          {(userRole === 'admin' || userRole === 'hr') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-accent-green hover:bg-accent-green/90 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Pass
            </button>
          )}
        </div>
      )}

      {/* Pass Detail Modal */}
      {selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 mb-2">{selectedPass.full_name}</h2>
                  <p className="text-primary-600 font-mono text-sm">{selectedPass.pass_number}</p>
                </div>
                <button
                  onClick={() => setSelectedPass(null)}
                  className="text-primary-400 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Type</label>
                    <p className="text-primary-800 capitalize">{selectedPass.pass_type}</p>
                  </div>
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedPass.status)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Position</label>
                    <p className="text-primary-800">{selectedPass.position || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Department</label>
                    <p className="text-primary-800">{selectedPass.department || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Email</label>
                    <p className="text-primary-800">{selectedPass.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Phone</label>
                    <p className="text-primary-800">{selectedPass.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Valid From</label>
                    <p className="text-primary-800">{new Date(selectedPass.valid_from).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-primary-500 uppercase font-semibold">Valid Until</label>
                    <p className="text-primary-800">{new Date(selectedPass.valid_until).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary-200">
                  <label className="text-xs text-primary-500 uppercase font-semibold">Created</label>
                  <p className="text-primary-800">
                    By {selectedPass.created_by} on {new Date(selectedPass.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-accent-green hover:bg-accent-green/90 text-white px-4 py-2 rounded-lg transition-colors">
                    Print Pass
                  </button>
                  <button className="flex-1 bg-primary-100 hover:bg-primary-200 text-primary-700 px-4 py-2 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
