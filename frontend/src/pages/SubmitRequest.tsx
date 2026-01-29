/**
 * SubmitRequest.tsx
 * 
 * AUTHENTICATED PAGE - Employee self-service request submission
 * Single-form submission following blueprint pattern
 * 
 * Features:
 * - One screen per request
 * - Single submit action
 * - Immediate reference number feedback
 * - Clean white aesthetic
 */

import { useState } from 'react';
import { Check, ArrowLeft } from 'lucide-react';

const requestTypes = [
  { value: 'leave', label: 'Leave Request', description: 'Annual leave, sick leave, emergency leave' },
  { value: 'certificate', label: 'Experience Certificate', description: 'Certificate of employment experience' },
  { value: 'salary_certificate', label: 'Salary Certificate', description: 'For bank, visa, or embassy purposes' },
  { value: 'employment_letter', label: 'Employment Letter', description: 'Proof of employment' },
  { value: 'noc', label: 'No Objection Certificate (NOC)', description: 'For bank accounts, visas, etc.' },
  { value: 'bank_letter', label: 'Bank Letter', description: 'Letter to your bank' },
  { value: 'profile_update', label: 'Profile Update Request', description: 'Update personal information' },
  { value: 'grievance', label: 'Grievance / Complaint', description: 'Report an issue or concern' },
];

export const SubmitRequest = () => {
  const [requestType, setRequestType] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestType) {
      setError('Please select a request type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to submit a request');
      }

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          request_type: requestType,
          metadata: details ? { details } : {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit request');
      }

      const data = await response.json();
      setReference(data.reference);
      setSubmitted(true);
      
      // TODO [Phase 3]: WhatsApp notification will be sent automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRequestType('');
    setDetails('');
    setReference('');
    setError('');
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            Request Submitted Successfully
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your request has been received. Use this reference number to track status:
          </p>
          
          {/* Reference Number Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 mb-6">
            <div className="text-sm text-gray-600 mb-2">Reference Number</div>
            <div className="text-3xl font-medium text-gray-900 tracking-wide">
              {reference}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(reference);
                alert('Reference number copied to clipboard');
              }}
              className="mt-3 text-sm text-gray-600 hover:text-gray-900"
            >
              Click to copy
            </button>
          </div>
          
          <div className="text-sm text-gray-600 mb-6 bg-gray-50 border border-gray-200 rounded-sm p-4">
            <p>✓ Expected processing time: 3 business days</p>
            <p className="mt-2">✓ You can track status anytime using your reference number</p>
            {/* Phase 3: <p className="mt-2">✓ You will receive WhatsApp updates</p> */}
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = `/track?ref=${reference}`}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors"
            >
              Track Request
            </button>
            
            <button
              onClick={resetForm}
              className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-sm hover:bg-gray-50 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Submit form screen
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Submit Request
          </h1>
          <p className="text-gray-600">
            Submit your request and receive a reference number for tracking
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Request Type *
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Select request type...</option>
              {requestTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            {/* Show description for selected type */}
            {requestType && (
              <p className="mt-2 text-sm text-gray-600">
                {requestTypes.find(t => t.value === requestType)?.description}
              </p>
            )}
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              placeholder="Provide any additional information that will help HR process your request..."
              className="w-full px-4 py-3 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              Examples: dates for leave requests, purpose for certificates, etc.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !requestType}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You'll receive a unique reference number (REF-2026-XXX)</li>
              <li>• HR will review your request within 3 business days</li>
              <li>• Track your request status anytime using your reference</li>
              {/* Phase 3: <li>• You'll receive WhatsApp updates on status changes</li> */}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};
