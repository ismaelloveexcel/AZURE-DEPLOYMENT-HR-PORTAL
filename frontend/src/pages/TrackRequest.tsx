/**
 * TrackRequest.tsx
 * 
 * PUBLIC PAGE - No authentication required
 * Allows anyone with a reference number to track their request status
 * 
 * Features:
 * - Clean, calm white aesthetic
 * - Simple search by reference
 * - Status timeline visualization
 * - Public notes display
 */

import { useState } from 'react';
import { Search, Calendar, Clock } from 'lucide-react';

interface RequestStatus {
  reference: string;
  request_type: string;
  status: string;
  submitted_at: string;
  estimated_completion: string;
  public_notes: string | null;
}

export const TrackRequest = () => {
  const [reference, setReference] = useState('');
  const [request, setRequest] = useState<RequestStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!reference.trim()) {
      setError('Please enter a reference number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/requests/track/${reference.trim().toUpperCase()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Request not found. Please check your reference number.');
        }
        throw new Error('Unable to fetch request. Please try again.');
      }
      
      const data = await response.json();
      setRequest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request not found');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRequestType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusSteps = (currentStatus: string) => {
    // Handle rejected status separately
    if (currentStatus === 'rejected') {
      return [
        { name: 'Submitted', completed: true, current: false },
        { name: 'Reviewing', completed: true, current: false },
        { name: 'Rejected', completed: true, current: true }
      ];
    }
    
    // Normal progression
    const steps = ['submitted', 'reviewing', 'approved', 'completed'];
    const currentIndex = steps.indexOf(currentStatus);
    
    return steps.map((step, index) => ({
      name: step.charAt(0).toUpperCase() + step.slice(1),
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Track Your Request
          </h1>
          <p className="text-gray-600">
            Enter your reference number to check status
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="REF-2026-001"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onBlur={(e) => setReference(e.target.value.toUpperCase())}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleTrack}
              disabled={loading || !reference.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
          
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {loading && (
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">Searching...</p>
            </div>
          )}
        </div>

        {/* Result */}
        {request && !loading && (
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            {/* Reference Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Reference Number</div>
              <div className="text-2xl font-medium text-gray-900">
                {request.reference}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Type */}
              <div>
                <div className="text-sm text-gray-600 mb-1">Request Type</div>
                <div className="text-base text-gray-900 font-medium">
                  {formatRequestType(request.request_type)}
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <div className="text-sm text-gray-600 mb-3">Status</div>
                <div className="space-y-2">
                  {getStatusSteps(request.status).map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`
                          w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0
                          ${step.completed 
                            ? 'bg-gray-900 border-gray-900' 
                            : 'bg-white border-gray-300'
                          }
                        `}
                      />
                      <div
                        className={`text-sm ${
                          step.completed ? 'text-gray-900 font-medium' : 'text-gray-400'
                        }`}
                      >
                        {step.name}
                        {step.current && (
                          <span className="ml-2 text-xs text-gray-600">(Current)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-start">
                  <Calendar size={18} className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600">Submitted</div>
                    <div className="text-sm text-gray-900">
                      {formatDate(request.submitted_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock size={18} className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600">Expected Completion</div>
                    <div className="text-sm text-gray-900">
                      {formatDate(request.estimated_completion)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Notes */}
              {request.public_notes && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Latest Update</div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-sm border border-gray-200">
                    {request.public_notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        {!request && !loading && !error && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Your reference number was provided when you submitted your request.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Format: REF-YYYY-NNN (e.g., REF-2026-047)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
