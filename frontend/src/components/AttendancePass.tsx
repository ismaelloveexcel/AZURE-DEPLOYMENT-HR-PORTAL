import { QRCodeSVG } from 'qrcode.react'
import type { ReactNode } from 'react'
import type { TodayAttendanceStatus, User } from '../App'

interface AttendancePassProps {
  user: User | null
  status: TodayAttendanceStatus | null
  onClose: () => void
}

function StatPill({ label, value, accent }: { label: string; value: ReactNode; accent: string }) {
  return (
    <div className="flex-1 bg-white/70 rounded-xl border border-gray-100 p-3 text-center shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-lg font-semibold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  )
}

export function AttendancePass({ user, status, onClose }: AttendancePassProps) {
  const qrData = JSON.stringify({
    type: 'attendance_pass',
    employee_id: user?.employee_id,
    name: user?.name,
    date: status?.date,
    clocked_in: status?.is_clocked_in ?? false,
    work_type: status?.work_type ?? 'unknown',
  })

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Attendance Pass</p>
            <p className="text-lg font-bold text-gray-800">{user?.name || 'Employee'}</p>
            <p className="text-sm text-gray-500">{user?.employee_id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition"
            aria-label="Close attendance pass"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-xl font-semibold text-gray-900">
                {status?.is_clocked_in ? 'Clocked In' : 'Not Clocked In'}
              </p>
              <p className="text-sm text-gray-500">{status?.message || 'Awaiting attendance update'}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <QRCodeSVG value={qrData} size={120} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatPill label="Date" value={status?.date || 'N/A'} accent="#0f766e" />
            <StatPill label="Work Mode" value={status?.work_type || 'N/A'} accent="#2563eb" />
            <StatPill label="Break" value={status?.is_on_break ? 'On Break' : 'Active'} accent="#f59e0b" />
          </div>

          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-1">Security</p>
            <ul className="list-disc list-inside space-y-1">
              <li>QR updates in real time with your current attendance status.</li>
              <li>Share only with authorized gate/security teams.</li>
              <li>Contains no salary or personal data.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
