import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useAuthContext } from "../contexts/AuthContext";
import { useAttendance } from "../hooks/useAttendance";
import { exportAttendanceToCSV } from "../utils/exportToCSV";

/**
 * Work mode options for attendance tracking
 */
const WORK_MODE_OPTIONS = [
  {
    value: "office" as const,
    label: "Office",
    description: "Clock in from Baynunah HQ or satellite offices.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18" />
        <path d="M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17" />
        <path d="M9 21V9h6v12" />
      </svg>
    ),
    activeClass: "border-emerald-300 text-emerald-600 shadow-soft-green",
    iconWrapperActiveClass: "border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  {
    value: "wfh" as const,
    label: "Remote (WFH)",
    description: "Approved home-based or remote working arrangement.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11l9-7 9 7" />
        <path d="M5 12v7a1 1 0 001 1h3m4 0h3a1 1 0 001-1v-7" />
        <path d="M9 21V9h6v12" />
      </svg>
    ),
    activeClass: "border-sky-300 text-sky-600 shadow-soft-green",
    iconWrapperActiveClass: "border-sky-200 bg-sky-50 text-sky-600",
  },
  {
    value: "field" as const,
    label: "Field / Client",
    description: "On client site, field work, or business travel.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    activeClass: "border-amber-300 text-amber-600 shadow-soft-green",
    iconWrapperActiveClass: "border-amber-200 bg-amber-50 text-amber-600",
  },
] as const;

/**
 * AttendanceModule - Dedicated page for employee attendance tracking
 *
 * Features:
 * - Today's attendance status with clock in/out
 * - Work type selection (Office/WFH/Field)
 * - GPS location capture
 * - Break management
 * - Admin dashboard with today's overview
 * - Recent attendance records table
 * - CSV export for admin/HR
 */
export function AttendanceModule() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const {
    attendanceStatus,
    attendanceRecords,
    attendanceDashboard,
    loading,
    error,
    clockInWorkType,
    wfhReason,
    gpsCoords,
    fetchAttendanceData,
    handleClockIn,
    handleClockOut,
    handleBreakStart,
    handleBreakEnd,
    requestGPSLocation,
    setClockInWorkType,
    setWfhReason,
    clearError,
  } = useAttendance(user);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch attendance data on mount
  useEffect(() => {
    if (user) {
      fetchAttendanceData();
      requestGPSLocation();
    }
  }, [user, fetchAttendanceData, requestGPSLocation]);

  const handleRefresh = () => {
    fetchAttendanceData();
    requestGPSLocation();
  };

  const handleExport = () => {
    if (attendanceRecords.length === 0) return;
    exportAttendanceToCSV(attendanceRecords);
  };

  if (!user) {
    return null;
  }

  const isAdminOrHR = user.role === "admin" || user.role === "hr";
  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const recentRecords = attendanceRecords.slice(0, 10);

  return (
    <AppShell
      title="Attendance Workspace"
      subtitle="Monitor daily check-ins, capture work locations, and keep Baynunah's workforce aligned with UAE labour expectations."
      actions={
        <>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleRefresh}
            disabled={loading}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0115-6" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 01-15 6" />
            </svg>
            <span>Refresh</span>
          </button>
          {isAdminOrHR && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleExport}
              disabled={loading || attendanceRecords.length === 0}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 17l4 4 4-4" />
                <path d="M12 12v9" />
                <path d="M4 4h16v8H4z" />
              </svg>
              <span>Export Records</span>
            </button>
          )}
        </>
      }
    >
      <div className="space-y-8">
        {error && (
          <div className="flex items-start justify-between rounded-2xl border border-red-200 bg-red-50/80 px-6 py-4 text-sm text-red-700 shadow-sm">
            <span>{error}</span>
            <button
              type="button"
              className="text-red-500 transition hover:text-red-700"
              onClick={clearError}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <section className="surface-section space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-primary-900">
                Today's Status
              </h2>
              <p className="text-sm text-primary-500">
                Clock accurately, capture location, and choose the right work
                mode.
              </p>
            </div>
            <span className="chip chip--success text-xs">{todayLabel}</span>
          </div>

          {loading && !attendanceStatus ? (
            <div className="py-10 text-center text-primary-500">
              Loading attendance data...
            </div>
          ) : attendanceStatus ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-700">
                <span
                  className={`inline-flex h-3 w-3 rounded-full ${attendanceStatus.is_clocked_in ? "bg-emerald-500" : "bg-slate-300"}`}
                />
                <span className="font-medium">{attendanceStatus.message}</span>
                {attendanceStatus.is_on_break && (
                  <span className="chip chip--warning text-xs">On Break</span>
                )}
                {attendanceStatus.work_type && (
                  <span className="chip text-xs">
                    Work Mode:{" "}
                    <strong className="ml-1 uppercase text-primary-700">
                      {attendanceStatus.work_type}
                    </strong>
                  </span>
                )}
              </div>

              {gpsCoords && (
                <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
                      <path d="M12 2a10 10 0 00-7.07 17.07L12 22l7.07-2.93A10 10 0 0012 2z" />
                    </svg>
                  </span>
                  <span>GPS location captured for this session</span>
                </div>
              )}

              {attendanceStatus.can_clock_in && (
                <div className="space-y-5 border-t border-slate-200 pt-6">
                  <div className="grid gap-3 md:grid-cols-3">
                    {WORK_MODE_OPTIONS.map((option) => {
                      const isActive = clockInWorkType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setClockInWorkType(option.value)}
                          className={`flex flex-col items-start gap-3 rounded-2xl border bg-white px-4 py-5 text-left text-sm font-medium text-primary-600 transition-all hover:border-emerald-300 hover:text-emerald-600 focus-visible:outline focus-visible:outline-emerald-200 ${
                            isActive ? option.activeClass : "border-slate-200"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center rounded-xl border px-2.5 py-2 ${
                              isActive
                                ? option.iconWrapperActiveClass
                                : "border-slate-200 bg-slate-50 text-slate-500"
                            }`}
                          >
                            {option.icon}
                          </span>
                          <div>
                            <p className="text-base font-semibold">
                              {option.label}
                            </p>
                            <p className="text-xs text-primary-500">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {clockInWorkType === "wfh" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-700">
                        Reason for working remotely
                      </label>
                      <textarea
                        value={wfhReason}
                        onChange={(e) => setWfhReason(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                        placeholder="Provide context for your WFH request"
                        rows={2}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleClockIn}
                    disabled={loading}
                    className="btn btn--primary w-full justify-center"
                  >
                    {loading ? "Processing…" : "Clock In Now"}
                  </button>
                </div>
              )}

              {(attendanceStatus.can_clock_out ||
                attendanceStatus.can_start_break ||
                attendanceStatus.can_end_break) && (
                <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                  {attendanceStatus.can_start_break && (
                    <button
                      type="button"
                      onClick={handleBreakStart}
                      disabled={loading}
                      className="btn btn--ghost w-full justify-center border-amber-200 text-amber-600 hover:border-amber-300 hover:text-amber-700 sm:flex-1"
                    >
                      Start Break
                    </button>
                  )}
                  {attendanceStatus.can_end_break && (
                    <button
                      type="button"
                      onClick={handleBreakEnd}
                      disabled={loading}
                      className="btn btn--ghost w-full justify-center border-blue-200 text-blue-600 hover:border-blue-300 hover:text-blue-700 sm:flex-1"
                    >
                      End Break
                    </button>
                  )}
                  {attendanceStatus.can_clock_out && (
                    <button
                      type="button"
                      onClick={handleClockOut}
                      disabled={loading}
                      className="btn btn--danger w-full justify-center sm:flex-1"
                    >
                      Clock Out
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-primary-500">
              Unable to retrieve today's status.
            </div>
          )}
        </section>

        {isAdminOrHR && attendanceDashboard && (
          <section className="surface-section space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-900">
                  Today's Overview
                </h2>
                <p className="text-sm text-primary-500">
                  Snapshot of team presence, lateness, and approvals awaiting HR
                  action.
                </p>
              </div>
              <span className="chip text-xs">
                Team size: {attendanceDashboard.total_employees}
              </span>
            </div>

            <div className="stat-grid stat-grid--four">
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Clocked In
                </div>
                <div className="stat-value">
                  {attendanceDashboard.clocked_in_today}
                </div>
                <p className="text-sm text-primary-500">
                  Present at office or on approved remote status.
                </p>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm font-medium text-sky-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  Working Remotely
                </div>
                <div className="stat-value">
                  {attendanceDashboard.wfh_today}
                </div>
                <p className="text-sm text-primary-500">
                  WFH requests approved for today.
                </p>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Late Arrivals
                </div>
                <div className="stat-value">
                  {attendanceDashboard.late_today}
                </div>
                <p className="text-sm text-primary-500">
                  Employees arriving beyond scheduled start.
                </p>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm font-medium text-rose-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  Absent Today
                </div>
                <div className="stat-value">
                  {attendanceDashboard.absent_today}
                </div>
                <p className="text-sm text-primary-500">
                  Unplanned absences requiring follow-up.
                </p>
              </div>
            </div>

            {(attendanceDashboard.pending_wfh_approvals > 0 ||
              attendanceDashboard.pending_overtime_approvals > 0) && (
              <div className="flex flex-wrap gap-2">
                {attendanceDashboard.pending_wfh_approvals > 0 && (
                  <span className="chip chip--warning text-xs">
                    {attendanceDashboard.pending_wfh_approvals} WFH approvals
                    pending
                  </span>
                )}
                {attendanceDashboard.pending_overtime_approvals > 0 && (
                  <span className="chip chip--danger text-xs">
                    {attendanceDashboard.pending_overtime_approvals} OT
                    approvals pending
                  </span>
                )}
              </div>
            )}
          </section>
        )}

        <section className="surface-section">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-semibold text-primary-900">
                Recent Attendance
              </h2>
              <p className="text-sm text-primary-500">
                Last ten records to help you confirm presence and break trends
                quickly.
              </p>
            </div>
            <span className="chip text-xs">
              Showing {recentRecords.length} of {attendanceRecords.length}{" "}
              records
            </span>
          </div>

          {loading && attendanceRecords.length === 0 ? (
            <div className="py-10 text-center text-primary-500">
              Loading attendance history…
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="py-10 text-center text-primary-500">
              No attendance records available yet.
            </div>
          ) : (
            <div className="-mx-4 mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Clock In</th>
                    <th className="px-4 py-3 text-left">Clock Out</th>
                    <th className="px-4 py-3 text-left">Work Mode</th>
                    <th className="px-4 py-3 text-left">Hours</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentRecords.map((record) => {
                    const dateLabel = new Date(
                      record.attendance_date,
                    ).toLocaleDateString("en-GB");
                    const clockInLabel = record.clock_in
                      ? new Date(record.clock_in).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—";
                    const clockOutLabel = record.clock_out
                      ? new Date(record.clock_out).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—";

                    return (
                      <tr
                        key={record.id}
                        className="transition hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 font-medium text-primary-700">
                          {dateLabel}
                        </td>
                        <td className="px-4 py-3 text-primary-600">
                          {clockInLabel}
                        </td>
                        <td className="px-4 py-3 text-primary-600">
                          {clockOutLabel}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                              record.work_type === "office"
                                ? "bg-emerald-50 text-emerald-600"
                                : record.work_type === "wfh"
                                  ? "bg-sky-50 text-sky-600"
                                  : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {record.work_type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-primary-600">
                          {record.total_hours ? `${record.total_hours}h` : "—"}
                          {record.overtime_hours &&
                            record.overtime_hours > 0 && (
                              <span className="ml-2 text-emerald-600">
                                (+{record.overtime_hours}h OT)
                              </span>
                            )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              record.status === "present"
                                ? "bg-emerald-50 text-emerald-600"
                                : record.status === "late"
                                  ? "bg-amber-50 text-amber-600"
                                  : record.status === "absent"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-slate-50 text-slate-600"
                            }`}
                          >
                            {record.status}
                            {record.is_late &&
                              record.late_minutes &&
                              ` (${record.late_minutes}m)`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
