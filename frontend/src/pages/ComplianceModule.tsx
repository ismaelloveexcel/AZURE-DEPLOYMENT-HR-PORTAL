import { useCallback, useEffect, useMemo, useState } from "react";
import { EmployeeProfile } from "../components/EmployeeProfile";
import { AppShell } from "../components/layout/AppShell";
import { useAuthContext } from "../contexts/AuthContext";
import { BrandLogo } from "../components/BrandLogo";
import { ComplianceAlertItem, ComplianceAlerts } from "../types";
import { API_BASE, fetchWithAuth } from "../utils/api";
import { exportComplianceAlertsToCSV } from "../utils/exportToCSV";

export function ComplianceModule() {
  const { user } = useAuthContext();
  const [complianceAlerts, setComplianceAlerts] =
    useState<ComplianceAlerts | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  const isAdminOrHR = user?.role === "admin" || user?.role === "hr";

  const fetchComplianceAlerts = useCallback(async () => {
    if (!user || !isAdminOrHR) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `${API_BASE}/employees/compliance/alerts`,
        {
          token: user.token,
          role: user.role,
        },
      );
      if (res.ok) {
        const data = await res.json();
        setComplianceAlerts(data);
      }
    } catch (err) {
      console.error("Failed to fetch compliance alerts:", err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdminOrHR]);

  useEffect(() => {
    if (user && isAdminOrHR) {
      fetchComplianceAlerts();
    }
  }, [user, isAdminOrHR, fetchComplianceAlerts]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleExport = useCallback(() => {
    const allAlerts = [
      ...(complianceAlerts?.expired ?? []),
      ...(complianceAlerts?.days_7 ?? []),
      ...(complianceAlerts?.days_30 ?? []),
      ...(complianceAlerts?.days_custom ?? []),
    ];
    if (allAlerts.length === 0) return;
    exportComplianceAlertsToCSV(allAlerts);
  }, [complianceAlerts]);

  const totalAlerts = useMemo(() => {
    if (!complianceAlerts) return 0;
    return (
      complianceAlerts.expired.length +
      (complianceAlerts.days_7?.length ?? 0) +
      (complianceAlerts.days_30?.length ?? 0) +
      (complianceAlerts.days_custom?.length ?? 0)
    );
  }, [complianceAlerts]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Expired",
        value: complianceAlerts?.expired.length ?? 0,
        tone: "danger" as const,
        helper: "Immediate action required",
      },
      {
        label: "Due in 7 days",
        value: complianceAlerts?.days_7?.length ?? 0,
        tone: "warning" as const,
        helper: "Critical renewal window",
      },
      {
        label: "Due in 30 days",
        value: complianceAlerts?.days_30?.length ?? 0,
        tone: "amber" as const,
        helper: "Plan renewal workflow",
      },
      {
        label: "Due in 60 days",
        value: complianceAlerts?.days_custom?.length ?? 0,
        tone: "info" as const,
        helper: "Long-range visibility",
      },
    ],
    [complianceAlerts],
  );

  const alertSections = useMemo(
    () => [
      {
        key: "expired",
        title: "Expired Documents",
        description:
          "Documents past their validity. Follow up immediately to avoid MOHRE penalties.",
        tone: "danger" as const,
        data: complianceAlerts?.expired ?? [],
      },
      {
        key: "days_7",
        title: "Expiring Within 7 Days",
        description:
          "Critical alerts due this week. Prepare renewal files and confirm bookings.",
        tone: "warning" as const,
        data: complianceAlerts?.days_7 ?? [],
      },
      {
        key: "days_30",
        title: "Expiring Within 30 Days",
        description:
          "Upcoming renewals requiring HR scheduling and employee notifications.",
        tone: "amber" as const,
        data: complianceAlerts?.days_30 ?? [],
      },
      {
        key: "days_custom",
        title: "Expiring Within 60 Days",
        description:
          "Early visibility for staggered renewals and agency coordination.",
        tone: "info" as const,
        data: complianceAlerts?.days_custom ?? [],
      },
    ],
    [complianceAlerts],
  );

  if (!user) {
    return (
      <AppShell
        title="Compliance Alerts"
        subtitle="Track UAE document validity windows, renewal deadlines, and HR risk status."
      >
        <section className="surface-section text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <BrandLogo size="sm" stacked variant="dark" />
            <p className="text-lg font-semibold text-primary-800">
              Secure access required
            </p>
            <p className="text-sm text-primary-600">
              Sign in through the HR portal to review compliance expiries and
              legal obligations.
            </p>
          </div>
        </section>
      </AppShell>
    );
  }

  if (!isAdminOrHR) {
    return (
      <AppShell
        title="Compliance Alerts"
        subtitle="Only HR and Admin roles can access Emirates ID, visa, and medical renewal data."
      >
        <section className="surface-section text-center">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
            <span className="chip chip--danger text-xs">Restricted Area</span>
            <p className="text-lg font-semibold text-primary-800">
              Access limited to HR & Admin
            </p>
            <p className="text-sm text-primary-600">
              Contact the HR operations team if you believe you require
              visibility on compliance alerts.
            </p>
          </div>
        </section>
      </AppShell>
    );
  }

  const actions = (
    <>
      <button
        type="button"
        className="btn btn--ghost"
        onClick={fetchComplianceAlerts}
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
      <button
        type="button"
        className="btn btn--primary"
        onClick={handleExport}
        disabled={loading || totalAlerts === 0}
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
        <span>Export Alerts</span>
      </button>
    </>
  );

  return (
    <>
      {viewingProfileId && user?.token && (
        <EmployeeProfile
          employeeId={viewingProfileId}
          token={user.token}
          currentUserRole={user.role}
          currentUserId={user.employee_id}
          onClose={() => setViewingProfileId(null)}
        />
      )}

      <AppShell
        title="Compliance Command Center"
        subtitle="Visa, Emirates ID, medical fitness, and insurance expiries tracked for UAE labour compliance."
        actions={actions}
      >
        <div className="space-y-8">
          {loading && !complianceAlerts ? (
            <section className="surface-section text-center text-sm text-primary-500">
              Loading compliance data…
            </section>
          ) : (
            <>
              <section className="surface-section">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-primary-400">
                      UAE compliance snapshot
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-primary-900">
                      Expiries Overview
                    </h2>
                    <p className="mt-1 text-sm text-primary-500">
                      Monitor 60-day horizon across visa, Emirates ID, medical
                      fitness, and insurance requirements.
                    </p>
                  </div>
                  <span className="chip text-xs">
                    Total alerts: {totalAlerts}
                  </span>
                </div>

                <div className="mt-6 stat-grid stat-grid--four">
                  {summaryCards.map((card) => (
                    <div
                      key={card.label}
                      className={`stat-card ${toneStyles[card.tone].cardShadow}`}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${toneStyles[card.tone].dot}`}
                        />
                        {card.label}
                      </div>
                      <div className="stat-value">{card.value}</div>
                      <p className="text-sm text-primary-500">{card.helper}</p>
                    </div>
                  ))}
                </div>
              </section>

              {alertSections.map(
                (section) =>
                  section.data.length > 0 && (
                    <section
                      key={section.key}
                      className="surface-section space-y-5"
                    >
                      <div
                        className={`rounded-2xl border px-5 py-4 ${toneStyles[section.tone].banner}`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-primary-400">
                              {section.data.length} records
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-primary-900">
                              {section.title}
                            </h3>
                            <p className="mt-1 text-sm text-primary-600 max-w-2xl">
                              {section.description}
                            </p>
                          </div>
                          <span
                            className={`chip text-xs ${toneStyles[section.tone].chip}`}
                          >
                            Priority: {toneStyles[section.tone].priority}
                          </span>
                        </div>
                      </div>

                      <div className="-mx-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-4 py-3 text-left">Employee</th>
                              <th className="px-4 py-3 text-left">Document</th>
                              <th className="px-4 py-3 text-left">Expiry</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                            {section.data.map((alert) => (
                              <tr
                                key={`${alert.employee_id}-${alert.document_type}`}
                                className="transition hover:bg-slate-50/60"
                              >
                                <td className="px-4 py-4">
                                  <p className="font-medium text-primary-800">
                                    {alert.employee_name}
                                  </p>
                                  <p className="text-xs text-primary-500">
                                    {alert.employee_id}
                                  </p>
                                </td>
                                <td className="px-4 py-4 text-primary-600">
                                  {alert.document_type}
                                </td>
                                <td className="px-4 py-4 text-primary-600">
                                  {formatDate(alert.expiry_date)}
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`${toneStyles[section.tone].chipClass}`}
                                  >
                                    {formatDeadline(alert)}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <button
                                    type="button"
                                    className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                                    onClick={() =>
                                      setViewingProfileId(alert.employee_id)
                                    }
                                  >
                                    View profile
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  ),
              )}

              {complianceAlerts && totalAlerts === 0 && (
                <section className="surface-section text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                    <span className="chip chip--success text-xs">
                      All clear
                    </span>
                    <p className="text-lg font-semibold text-primary-800">
                      No pending renewals in the next 60 days
                    </p>
                    <p className="text-sm text-primary-600">
                      Continue monitoring Emirates ID, visa, medical fitness,
                      insurance, and contract expiry schedules weekly.
                    </p>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </AppShell>
    </>
  );
}

const toneStyles = {
  danger: {
    cardShadow: "",
    dot: "bg-rose-500",
    banner: "border-rose-100 bg-rose-50",
    chip: "bg-rose-100 text-rose-600 border border-rose-200",
    chipClass: "chip chip--danger text-xs",
    priority: "Immediate",
  },
  warning: {
    cardShadow: "",
    dot: "bg-orange-500",
    banner: "border-orange-100 bg-orange-50",
    chip: "bg-orange-100 text-orange-600 border border-orange-200",
    chipClass: "chip chip--warning text-xs",
    priority: "Urgent",
  },
  amber: {
    cardShadow: "",
    dot: "bg-amber-500",
    banner: "border-amber-100 bg-amber-50",
    chip: "bg-amber-100 text-amber-600 border border-amber-200",
    chipClass:
      "chip text-xs bg-amber-100 text-amber-600 border border-amber-200",
    priority: "Planned",
  },
  info: {
    cardShadow: "",
    dot: "bg-sky-500",
    banner: "border-sky-100 bg-sky-50",
    chip: "bg-sky-100 text-sky-600 border border-sky-200",
    chipClass: "chip text-xs bg-sky-100 text-sky-600 border border-sky-200",
    priority: "Monitor",
  },
} as const;

const formatDeadline = (alert: ComplianceAlertItem) => {
  if (alert.days_until_expiry < 0) {
    return `Expired ${Math.abs(alert.days_until_expiry)} days ago`;
  }
  if (alert.days_until_expiry === 0) {
    return "Expires today";
  }
  return `${alert.days_until_expiry} days`;
};
