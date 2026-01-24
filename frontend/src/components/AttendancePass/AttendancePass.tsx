import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface AttendancePassData {
  employee_id: string
  employee_name: string
  department: string
  job_title: string
  today_status: 'clocked_in' | 'clocked_out' | 'not_clocked_in' | 'on_break'
  clock_in_time: string | null
  clock_out_time: string | null
  break_start_time: string | null
  total_hours_today: number
  overtime_hours_today: number
  location: string | null
  is_wfh: boolean
  wfh_approved: boolean
  monthly_attendance_percentage: number
  current_month_days_present: number
  current_month_days_absent: number
  total_overtime_this_month: number
  offset_days_earned_this_month: number
}

interface AttendancePassProps {
  employeeId: string
  token: string
  onBack?: () => void
}

export const AttendancePass: React.FC<AttendancePassProps> = ({ employeeId, token, onBack }) => {
  const [passData, setPassData] = useState<AttendancePassData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

  useEffect(() => {
    fetchPassData()
  }, [employeeId])

  const fetchPassData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/attendance/pass/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error('Failed to fetch attendance pass data')
      }

      const data = await res.json()
      setPassData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching attendance pass:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clocked_in': return 'bg-emerald-500'
      case 'on_break': return 'bg-amber-500'
      case 'clocked_out': return 'bg-gray-500'
      default: return 'bg-red-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'clocked_in': return '✓ Clocked In'
      case 'on_break': return '☕ On Break'
      case 'clocked_out': return '✓ Clocked Out'
      default: return '⚠ Not Clocked In'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance pass...</p>
        </div>
      </div>
    )
  }

  if (error || !passData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium">{error || 'Failed to load attendance pass'}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    )
  }

  const passUrl = `${window.location.origin}/attendance-pass/${employeeId}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        <div className="perspective-1000">
          <div 
            className={`relative transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of Pass */}
            <div 
              className={`${isFlipped ? 'hidden' : 'block'}`}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header with Baynunah gradient */}
                <div className="bg-gradient-to-r from-[#00A0DF] to-[#0080C0] px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{passData.employee_name}</h1>
                      <p className="text-blue-100 text-sm">{passData.job_title}</p>
                      <p className="text-blue-100 text-sm">{passData.department}</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg">
                      <QRCodeSVG 
                        value={passUrl}
                        size={50}
                        level="M"
                        fgColor="#00A0DF"
                      />
                    </div>
                  </div>
                </div>

                {/* Today's Status Card */}
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Today's Attendance</h2>
                  
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusColor(passData.today_status)} text-white font-medium mb-4`}>
                    {getStatusLabel(passData.today_status)}
                  </div>

                  {passData.is_wfh && (
                    <div className={`inline-flex items-center ml-3 px-4 py-2 rounded-full ${passData.wfh_approved ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'} font-medium mb-4`}>
                      🏠 {passData.wfh_approved ? 'WFH Approved' : 'WFH Pending'}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {passData.clock_in_time && (
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
                        <div className="text-sm text-emerald-700 font-medium mb-1">Clock In</div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {new Date(passData.clock_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      </div>
                    )}

                    {passData.clock_out_time && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                        <div className="text-sm text-gray-700 font-medium mb-1">Clock Out</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {new Date(passData.clock_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      </div>
                    )}

                    {passData.break_start_time && !passData.clock_out_time && (
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
                        <div className="text-sm text-amber-700 font-medium mb-1">Break Started</div>
                        <div className="text-2xl font-bold text-amber-900">
                          {new Date(passData.break_start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <div className="text-sm text-blue-700 font-medium mb-1">⏱️ Hours Today</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {passData.total_hours_today.toFixed(1)}h
                      </div>
                    </div>

                    {passData.overtime_hours_today > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                        <div className="text-sm text-purple-700 font-medium mb-1">⏰ Overtime</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {passData.overtime_hours_today.toFixed(1)}h
                        </div>
                      </div>
                    )}
                  </div>

                  {passData.location && (
                    <div className="mt-4 text-sm text-gray-600">
                      📍 Location: <span className="font-medium">{passData.location}</span>
                    </div>
                  )}
                </div>

                {/* Monthly Summary */}
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 This Month's Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {passData.monthly_attendance_percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Days Present</span>
                      <span className="text-lg font-semibold text-gray-800">
                        {passData.current_month_days_present} days
                      </span>
                    </div>

                    {passData.current_month_days_absent > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Days Absent</span>
                        <span className="text-lg font-semibold text-red-600">
                          {passData.current_month_days_absent} days
                        </span>
                      </div>
                    )}

                    {passData.total_overtime_this_month > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Overtime</span>
                        <span className="text-lg font-semibold text-purple-600">
                          {passData.total_overtime_this_month.toFixed(1)} hours
                        </span>
                      </div>
                    )}

                    {passData.offset_days_earned_this_month > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Offset Days Earned</span>
                        <span className="text-lg font-semibold text-blue-600">
                          {passData.offset_days_earned_this_month.toFixed(2)} days
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Flip Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full py-3 bg-gradient-to-r from-[#00A0DF] to-[#0080C0] text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    View Employee ID →
                  </button>
                </div>
              </div>
            </div>

            {/* Back of Pass */}
            <div 
              className={`${isFlipped ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#00A0DF] to-[#0080C0] px-6 py-4 text-white">
                  <h1 className="text-2xl font-bold text-center">Attendance Pass</h1>
                  <p className="text-blue-100 text-sm text-center mt-1">Employee Identification</p>
                </div>

                {/* QR Code - Large */}
                <div className="p-8 text-center">
                  <div className="inline-block bg-white p-4 rounded-2xl shadow-lg">
                    <QRCodeSVG 
                      value={passUrl}
                      size={200}
                      level="H"
                      fgColor="#00A0DF"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <div className="text-3xl font-bold text-gray-800">{passData.employee_id}</div>
                    <div className="text-lg text-gray-600">{passData.employee_name}</div>
                    <div className="text-sm text-gray-500">{passData.department}</div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">
                      📱 <strong>Scan this QR code</strong> to access your attendance pass on any device
                    </p>
                    <p className="text-xs text-gray-500">
                      Use this pass to clock in/out and view your attendance records
                    </p>
                  </div>
                </div>

                {/* Flip Back Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    ← Back to Attendance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-2">💡 How to Use Your Attendance Pass</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">1️⃣</span>
              <span>Clock in when you start work (friendly reminder at 10:00 AM)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2️⃣</span>
              <span>Take breaks as needed (lunch break is automatically calculated)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3️⃣</span>
              <span>Clock out when you finish (overtime tracked automatically)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4️⃣</span>
              <span>View your monthly summary and earned offset days</span>
            </li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>UAE Labor Law Compliance:</strong> Your attendance is tracked in accordance with Federal Decree-Law No. 33/2021. 
              Standard work day is 8 hours (9 hours including lunch). Overtime calculated at 125% regular pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
