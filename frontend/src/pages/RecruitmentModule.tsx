import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuthContext } from "../contexts/AuthContext";
import { useRecruitment } from "../hooks/useRecruitment";
import { API_BASE, fetchWithAuth } from "../utils/api";
import {
  exportCandidatesToCSV,
  exportRecruitmentRequestsToCSV,
} from "../utils/exportToCSV";

/**
 * RecruitmentModule - Comprehensive recruitment management interface
 *
 * Features:
 * - Stats dashboard (positions, candidates, interview, hired)
 * - Open positions list with CSV export
 * - Kanban pipeline (Applied → Screening → Interview → Offer → Hired)
 * - Candidate screening table with filters & search
 * - New recruitment request modal
 * - Integration with CandidatePass and ManagerPass
 */
export function RecruitmentModule() {
  const { user } = useAuthContext();
  const {
    recruitmentStats,
    recruitmentRequests,
    pipelineCounts,
    candidatesList,
    candidateSearchQuery,
    candidateStatusFilter,
    candidateSourceFilter,
    loading,
    fetchRecruitmentData,
    fetchRecruitmentCandidates,
    setCandidateSearchQuery,
    setCandidateStatusFilter,
    setCandidateSourceFilter,
  } = useRecruitment(user);

  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({
    position_title: "",
    department: "Engineering / R&D",
    employment_type: "Full-time",
    salary_range_min: "",
    salary_range_max: "",
    headcount: "1",
    job_description: "",
    requirements: "",
  });

  const isAdminOrHR = user?.role === "admin" || user?.role === "hr";

  useEffect(() => {
    if (user && isAdminOrHR) {
      fetchRecruitmentData();
      fetchRecruitmentCandidates();
    }
  }, [user, isAdminOrHR, fetchRecruitmentData, fetchRecruitmentCandidates]);

  const handleCreateRecruitmentRequest = async () => {
    if (!user) return;
    try {
      const payload = {
        position_title: newRequestForm.position_title,
        department: newRequestForm.department,
        employment_type: newRequestForm.employment_type,
        salary_range_min: newRequestForm.salary_range_min
          ? parseFloat(newRequestForm.salary_range_min)
          : null,
        salary_range_max: newRequestForm.salary_range_max
          ? parseFloat(newRequestForm.salary_range_max)
          : null,
        headcount: parseInt(newRequestForm.headcount) || 1,
        job_description: newRequestForm.job_description || null,
        requirements: newRequestForm.requirements || null,
      };
      const res = await fetchWithAuth(`${API_BASE}/recruitment/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        token: user.token,
        role: user.role,
      });
      if (res.ok) {
        setShowNewRequestModal(false);
        setNewRequestForm({
          position_title: "",
          department: "Engineering / R&D",
          employment_type: "Full-time",
          salary_range_min: "",
          salary_range_max: "",
          headcount: "1",
          job_description: "",
          requirements: "",
        });
        await fetchRecruitmentData();
      }
    } catch (err) {
      console.error("Failed to create recruitment request:", err);
    }
  };

  // Handle navigation to ManagerPass (simplified for extracted module)
  const handleViewManagerPass = (positionId: number, managerId: string) => {
    // TODO: Integrate with ManagerPass navigation when routing is ready
    alert(`Manager Pass for Position ${positionId}, Manager ${managerId}`);
  };

  const handleRefresh = () => {
    fetchRecruitmentData();
    fetchRecruitmentCandidates();
  };

  const totalPositions = recruitmentRequests.length;
  const totalCandidates =
    recruitmentStats?.total_candidates ?? candidatesList.length;
  const interviewCount =
    recruitmentStats?.in_interview ?? pipelineCounts?.interview ?? 0;
  const hiredLast30 =
    recruitmentStats?.hired_30_days ?? pipelineCounts?.hired ?? 0;

  const summaryCards = [
    {
      label: "Active Positions",
      value: totalPositions,
      dot: "bg-emerald-500",
      helper: "Open requisitions requiring HR coordination.",
    },
    {
      label: "Total Candidates",
      value: totalCandidates,
      dot: "bg-sky-500",
      helper: "Talent pool captured across all sources.",
    },
    {
      label: "In Interview",
      value: interviewCount,
      dot: "bg-amber-500",
      helper: "Candidates moving through interview loops.",
    },
    {
      label: "Hired (30 days)",
      value: hiredLast30,
      dot: "bg-emerald-700",
      helper: "Successful offers converted in the last month.",
    },
  ];

  const pipelineStages = [
    {
      key: "applied",
      label: "Applied",
      description: "New applicants awaiting screening.",
      badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
    },
    {
      key: "screening",
      label: "Screening",
      description: "CV reviews and initial HR calls.",
      badgeClass: "bg-sky-100 text-sky-600 border border-sky-200",
    },
    {
      key: "interview",
      label: "Interview",
      description: "Panel interviews and assessments.",
      badgeClass: "bg-amber-100 text-amber-600 border border-amber-200",
    },
    {
      key: "offer",
      label: "Offer",
      description: "Offer issuance and negotiation.",
      badgeClass: "bg-violet-100 text-violet-600 border border-violet-200",
    },
    {
      key: "hired",
      label: "Hired",
      description: "Signed offers to onboarding handover.",
      badgeClass: "bg-emerald-100 text-emerald-600 border border-emerald-200",
    },
  ] as const;

  const quickActions = [
    {
      label: "Create Position",
      description: "Launch a new recruitment request with HR approvals.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      ),
      action: () => setShowNewRequestModal(true),
    },
    {
      label: "Export Candidate Roster",
      description: "Share current pipeline data with hiring managers.",
      icon: (
        <svg
          className="h-5 w-5"
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
      ),
      action: () => exportCandidatesToCSV(filteredCandidates),
    },
    {
      label: "Download Position Report",
      description: "Export open requisitions for leadership reviews.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 12v8" />
          <path d="M8 16l4 4 4-4" />
          <path d="M20 4h-6l-2-2H8L6 4H4a2 2 0 00-2 2v12" />
        </svg>
      ),
      action: () => exportRecruitmentRequestsToCSV(recruitmentRequests),
    },
  ] as const;

  const filteredCandidates = useMemo(() => {
    const searchLower = candidateSearchQuery.toLowerCase();
    return candidatesList.filter((candidate: any) => {
      const matchesSearch =
        !candidateSearchQuery ||
        candidate.full_name?.toLowerCase().includes(searchLower) ||
        candidate.email?.toLowerCase().includes(searchLower);
      const matchesStatus =
        !candidateStatusFilter || candidate.stage === candidateStatusFilter;
      const matchesSource =
        !candidateSourceFilter || candidate.source === candidateSourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [
    candidatesList,
    candidateSearchQuery,
    candidateStatusFilter,
    candidateSourceFilter,
  ]);

  const actions = (
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
        <span>Refresh Data</span>
      </button>
      <button
        type="button"
        className="btn btn--outline"
        onClick={() => exportRecruitmentRequestsToCSV(recruitmentRequests)}
        disabled={recruitmentRequests.length === 0}
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
        <span>Export Positions</span>
      </button>
      <button
        type="button"
        className="btn btn--outline"
        onClick={() => exportCandidatesToCSV(candidatesList)}
        disabled={candidatesList.length === 0}
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
        <span>Export Candidates</span>
      </button>
      <button
        type="button"
        className="btn btn--primary"
        onClick={() => setShowNewRequestModal(true)}
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
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        <span>New Position</span>
      </button>
    </>
  );

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary-700 shadow-sm transition focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100";
  const textareaClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-primary-700 shadow-sm transition focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 min-h-[120px]";

  const getStatusChipClass = (status?: string) => {
    if (status === "open") return "chip chip--success text-xs";
    if (status === "pending_approval")
      return "chip text-xs bg-amber-100 text-amber-600 border border-amber-200";
    if (status === "closed")
      return "chip text-xs bg-slate-100 text-slate-600 border border-slate-200";
    return "chip text-xs bg-slate-100 text-slate-600 border border-slate-200";
  };

  if (!user) {
    return (
      <AppShell
        title="Recruitment Workspace"
        subtitle="Sign in to manage requisitions, candidate flow, and hiring operations."
      >
        <section className="surface-section text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <span className="chip text-xs bg-emerald-50 text-emerald-600 border border-emerald-200">
              Authentication required
            </span>
            <p className="text-lg font-semibold text-primary-800">
              Please access via the HR portal
            </p>
            <p className="text-sm text-primary-600">
              Recruitment metrics and requests are available once you are signed
              in.
            </p>
          </div>
        </section>
      </AppShell>
    );
  }

  if (!isAdminOrHR) {
    return (
      <AppShell
        title="Recruitment Workspace"
        subtitle="Only HR and Admin roles can manage Baynunah hiring operations."
      >
        <section className="surface-section text-center">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
            <span className="chip chip--danger text-xs">Restricted</span>
            <p className="text-lg font-semibold text-primary-800">
              Access limited to HR & Admin
            </p>
            <p className="text-sm text-primary-600">
              Contact HR Operations if you need restricted access to recruitment
              data.
            </p>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <>
      <AppShell
        title="Recruitment Command Center"
        subtitle="Orchestrate requisitions, candidate movement, and hiring progress for Baynunah HR."
        actions={actions}
      >
        <div className="space-y-8">
          <section className="surface-section">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-primary-400">
                  Talent acquisition
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-primary-900">
                  Recruitment Health
                </h2>
                <p className="mt-1 text-sm text-primary-500">
                  Track open requisitions, candidate flow, and hires to stay
                  aligned with MOHRE hiring obligations.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="chip text-xs">
                  Open positions: {totalPositions}
                </span>
                <span className="chip text-xs">
                  Pipeline: {totalCandidates}
                </span>
              </div>
            </div>
            <div className="mt-6 stat-grid stat-grid--four">
              {summaryCards.map((card) => (
                <div key={card.label} className="stat-card">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${card.dot}`} />
                    {card.label}
                  </div>
                  <div className="stat-value">{card.value}</div>
                  <p className="text-sm text-primary-500">{card.helper}</p>
                </div>
              ))}
            </div>
          </section>

          {totalPositions > 0 ? (
            <section className="surface-section space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary-900">
                    Open Positions
                  </h2>
                  <p className="text-sm text-primary-500">
                    Monitor requisition status, headcount, and compensation
                    guidance.
                  </p>
                </div>
                <span className="chip text-xs">Active: {totalPositions}</span>
              </div>
              <div className="space-y-4">
                {recruitmentRequests.map((req: any) => {
                  const statusLabel = req.status?.replace("_", " ") || "open";
                  return (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-slate-200 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:border-emerald-200"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-900">
                            {req.position_title}
                          </h3>
                          <p className="text-sm text-primary-500">
                            {req.department} • {req.employment_type}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className={getStatusChipClass(req.status)}>
                              {statusLabel}
                            </span>
                            {req.request_number && (
                              <span className="text-xs uppercase tracking-[0.18em] text-primary-400">
                                Req #{req.request_number}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 text-right">
                          <div>
                            <p className="text-sm font-semibold text-primary-700">
                              Headcount {req.headcount || 1}
                            </p>
                            {req.salary_range_min && req.salary_range_max && (
                              <p className="text-xs text-primary-500">
                                AED {req.salary_range_min.toLocaleString()} -{" "}
                                {req.salary_range_max.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn btn--ghost text-xs"
                            onClick={() =>
                              handleViewManagerPass(
                                req.id,
                                req.hiring_manager_id || user.employee_id,
                              )
                            }
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 5v2m0 4v2m0 4v2" />
                              <path d="M5 5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span>Manager Pass</span>
                          </button>
                        </div>
                      </div>
                      {req.job_description && (
                        <p className="mt-4 text-sm text-primary-500">
                          {req.job_description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="surface-section text-center">
              <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                <span className="chip text-xs bg-slate-100 text-primary-600 border border-slate-200">
                  No active requisitions
                </span>
                <p className="text-lg font-semibold text-primary-800">
                  Create your first position
                </p>
                <p className="text-sm text-primary-500">
                  Launch a recruitment request to notify HR and begin sourcing.
                </p>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setShowNewRequestModal(true)}
                >
                  <span>New Position</span>
                </button>
              </div>
            </section>
          )}

          <section className="surface-section space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-900">
                  Candidate Pipeline
                </h2>
                <p className="text-sm text-primary-500">
                  Overview of applicants through each stage of the hiring
                  journey.
                </p>
              </div>
              <span className="chip text-xs">
                Stages: {pipelineStages.length}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {pipelineStages.map((stage) => {
                const stageCount =
                  pipelineCounts?.[stage.key as keyof typeof pipelineCounts] ??
                  0;
                return (
                  <div
                    key={stage.key}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-primary-800">
                        {stage.label}
                      </h3>
                      <span className={`chip text-xs ${stage.badgeClass}`}>
                        {stageCount}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-primary-500">
                      {stage.description}
                    </p>
                    <div className="mt-6 flex-1 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-primary-400">
                      {stageCount === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          No candidates yet
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center text-center text-primary-500">
                          Detailed cards coming soon in the enhanced pipeline
                          view.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {candidatesList.length > 0 && (
            <section className="surface-section space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary-900">
                    Candidate Screening
                  </h2>
                  <p className="text-sm text-primary-500">
                    Filtered {filteredCandidates.length} of{" "}
                    {candidatesList.length} candidates.
                  </p>
                </div>
                <span className="chip text-xs">Phase 2 table placeholder</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 21l-6-6" />
                    <circle cx="11" cy="11" r="7" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={candidateSearchQuery}
                    onChange={(e) => setCandidateSearchQuery(e.target.value)}
                    className={`${inputClass} w-64 pl-10`}
                  />
                </div>
                <select
                  value={candidateStatusFilter}
                  onChange={(e) => setCandidateStatusFilter(e.target.value)}
                  className={inputClass}
                >
                  <option value="">All Stages</option>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                </select>
                <select
                  value={candidateSourceFilter}
                  onChange={(e) => setCandidateSourceFilter(e.target.value)}
                  className={inputClass}
                >
                  <option value="">All Sources</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Referral">Referral</option>
                  <option value="Direct">Direct Application</option>
                  <option value="Agency">Agency</option>
                </select>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center text-sm text-primary-500">
                Plug-in table integration arriving in the next sprint. Export
                the roster for a detailed view in Excel meanwhile.
              </div>
            </section>
          )}

          <section className="surface-section space-y-5">
            <h2 className="text-xl font-semibold text-primary-900">
              Quick Actions
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.action}
                  className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-200"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    {action.icon}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-primary-900">
                      {action.label}
                    </p>
                    <p className="text-sm text-primary-500">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </AppShell>

      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-900">
                  New Recruitment Request
                </h2>
                <p className="text-sm text-primary-500">
                  Define role, headcount, and salary to trigger approvals.
                </p>
              </div>
              <button
                type="button"
                className="text-primary-400 transition hover:text-primary-700"
                onClick={() => setShowNewRequestModal(false)}
              >
                <svg
                  className="h-5 w-5"
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
            <form
              className="max-h-[75vh] space-y-5 overflow-y-auto px-6 py-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateRecruitmentRequest();
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-700">
                  Position Title *
                </label>
                <input
                  type="text"
                  value={newRequestForm.position_title}
                  onChange={(e) =>
                    setNewRequestForm((prev) => ({
                      ...prev,
                      position_title: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="e.g., Thermodynamics Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-700">
                  Department *
                </label>
                <input
                  type="text"
                  value={newRequestForm.department}
                  onChange={(e) =>
                    setNewRequestForm((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="e.g., Engineering / R&D"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    Employment Type
                  </label>
                  <select
                    value={newRequestForm.employment_type}
                    onChange={(e) =>
                      setNewRequestForm((prev) => ({
                        ...prev,
                        employment_type: e.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    Headcount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRequestForm.headcount}
                    onChange={(e) =>
                      setNewRequestForm((prev) => ({
                        ...prev,
                        headcount: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    Salary Range Min (AED)
                  </label>
                  <input
                    type="number"
                    value={newRequestForm.salary_range_min}
                    onChange={(e) =>
                      setNewRequestForm((prev) => ({
                        ...prev,
                        salary_range_min: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="e.g., 15000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-700">
                    Salary Range Max (AED)
                  </label>
                  <input
                    type="number"
                    value={newRequestForm.salary_range_max}
                    onChange={(e) =>
                      setNewRequestForm((prev) => ({
                        ...prev,
                        salary_range_max: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="e.g., 25000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-700">
                  Job Description
                </label>
                <textarea
                  value={newRequestForm.job_description}
                  onChange={(e) =>
                    setNewRequestForm((prev) => ({
                      ...prev,
                      job_description: e.target.value,
                    }))
                  }
                  className={textareaClass}
                  placeholder="Summarize responsibilities, reporting line, and location."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-700">
                  Requirements
                </label>
                <textarea
                  value={newRequestForm.requirements}
                  onChange={(e) =>
                    setNewRequestForm((prev) => ({
                      ...prev,
                      requirements: e.target.value,
                    }))
                  }
                  className={textareaClass}
                  placeholder="Outline minimum qualifications, certifications, and experience."
                />
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShowNewRequestModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={loading || !newRequestForm.position_title}
                >
                  {loading ? "Creating..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
