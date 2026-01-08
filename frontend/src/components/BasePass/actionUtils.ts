export interface ActionConfig {
  label: string
  description?: string
  actionType: string
}

export interface Stage {
  key: string
  label: string
  candidateLabel?: string
  managerLabel?: string
  icon: string
}

export const UNIFIED_STAGES: Stage[] = [
  { 
    key: 'application', 
    label: 'Application',
    candidateLabel: 'Application',
    managerLabel: 'Request',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
  },
  { 
    key: 'screening', 
    label: 'Assessment',
    candidateLabel: 'Assessment',
    managerLabel: 'Screening',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' 
  },
  { 
    key: 'interview', 
    label: 'Interview',
    candidateLabel: 'Interview',
    managerLabel: 'Interview',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' 
  },
  { 
    key: 'decision', 
    label: 'Offer',
    candidateLabel: 'Offer',
    managerLabel: 'Decision',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' 
  },
  { 
    key: 'onboarding', 
    label: 'Onboarding',
    candidateLabel: 'Onboard',
    managerLabel: 'Onboard',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' 
  }
]

export const CANDIDATE_STAGES = UNIFIED_STAGES
export const MANAGER_STAGES = UNIFIED_STAGES

export const CANDIDATE_STATUSES: Record<string, { key: string; label: string }[]> = {
  application: [
    { key: 'submitted', label: 'Submitted' },
    { key: 'incomplete', label: 'Incomplete' },
    { key: 'withdrawn', label: 'Withdrawn' },
    { key: 'validated', label: 'Application Validated' }
  ],
  screening: [
    { key: 'under_review', label: 'Under Review' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'not_shortlisted', label: 'Not Shortlisted' },
    { key: 'on_hold', label: 'On Hold' }
  ],
  interview: [
    { key: 'pending', label: 'Interview Pending' },
    { key: 'scheduled', label: 'Interview Scheduled' },
    { key: 'confirmed', label: 'Interview Confirmed' },
    { key: 'completed', label: 'Interview Completed' },
    { key: 'cancelled', label: 'Interview Cancelled' },
    { key: 'no_show', label: 'Interview No-Show' }
  ],
  decision: [
    { key: 'in_preparation', label: 'Offer In Preparation' },
    { key: 'released', label: 'Offer Released' },
    { key: 'accepted', label: 'Offer Accepted' },
    { key: 'declined', label: 'Offer Declined' },
    { key: 'expired', label: 'Offer Expired' },
    { key: 'withdrawn', label: 'Offer Withdrawn' }
  ],
  onboarding: [
    { key: 'initiated', label: 'Onboarding Initiated' },
    { key: 'documents_pending', label: 'Documents Pending' },
    { key: 'pre_joining', label: 'Pre-Joining In Progress' },
    { key: 'completed', label: 'Onboarding Completed' },
    { key: 'no_show', label: 'No Show' }
  ]
}

export const MANAGER_STATUSES: Record<string, { key: string; label: string }[]> = {
  application: [
    { key: 'raised', label: 'Request Raised' },
    { key: 'approved', label: 'Request Approved' },
    { key: 'on_hold', label: 'Request On Hold' },
    { key: 'cancelled', label: 'Request Cancelled' }
  ],
  screening: [
    { key: 'in_progress', label: 'Screening In Progress' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'rejected', label: 'Rejected at Screening' },
    { key: 'on_hold', label: 'Screening On Hold' }
  ],
  interview: [
    { key: 'scheduled', label: 'Interview Scheduled' },
    { key: 'completed', label: 'Interview Completed' },
    { key: 'feedback_pending', label: 'Feedback Pending' },
    { key: 'additional_required', label: 'Additional Interview Required' },
    { key: 'cancelled', label: 'Interview Cancelled' }
  ],
  decision: [
    { key: 'pending', label: 'Decision Pending' },
    { key: 'approved', label: 'Approved for Offer' },
    { key: 'not_approved', label: 'Not Approved' },
    { key: 'released', label: 'Offer Released' },
    { key: 'declined', label: 'Offer Declined by Candidate' }
  ],
  onboarding: [
    { key: 'initiated', label: 'Onboarding Initiated' },
    { key: 'documentation', label: 'Documentation In Progress' },
    { key: 'joining_confirmed', label: 'Joining Confirmed' },
    { key: 'completed', label: 'Onboarding Completed' },
    { key: 'failed', label: 'Onboarding Failed' }
  ]
}

export function getCandidateActionRequired(
  stage: string, 
  status: string
): ActionConfig | null {
  const actionMap: Record<string, Record<string, ActionConfig>> = {
    application: {
      incomplete: { label: 'Complete Application', description: 'Fill in missing details', actionType: 'complete_profile' },
    },
    screening: {
      under_review: { label: 'Awaiting Review', description: 'Your application is being reviewed', actionType: 'none' }
    },
    interview: {
      pending: { label: 'Select Interview Slot', description: 'Choose your preferred time', actionType: 'select_slot' },
      scheduled: { label: 'Confirm Interview', description: 'Confirm your attendance', actionType: 'confirm_interview' }
    },
    decision: {
      released: { label: 'Review Offer', description: 'Review your offer letter', actionType: 'review_offer' }
    },
    onboarding: {
      documents_pending: { label: 'Upload Documents', description: 'Submit onboarding documents', actionType: 'upload_onboarding_docs' },
      initiated: { label: 'Complete Onboarding', description: 'Start your onboarding journey', actionType: 'complete_onboarding' }
    }
  }

  const stageLower = stage.toLowerCase()
  const statusLower = status.toLowerCase().replace(/[\s-]/g, '_')
  
  return actionMap[stageLower]?.[statusLower] || null
}

export function getManagerActionRequired(
  positionStatus: string,
  hasInterviewSetup: boolean,
  hasAvailableSlots: boolean,
  pendingEvaluations: number
): ActionConfig | null {
  if (!hasInterviewSetup) {
    return { label: 'Configure Interview', description: 'Set up interview format and rounds', actionType: 'setup_interview' }
  }
  
  if (!hasAvailableSlots) {
    return { label: 'Add Time Slots', description: 'Provide available interview times', actionType: 'add_slots' }
  }
  
  if (pendingEvaluations > 0) {
    return { label: `Review ${pendingEvaluations} Candidate${pendingEvaluations > 1 ? 's' : ''}`, description: 'Submit interview feedback', actionType: 'review_candidates' }
  }
  
  return null
}

export function getStageIndex(stages: { key: string }[], currentStage: string): number {
  const stageLower = currentStage.toLowerCase()
  const index = stages.findIndex(s => s.key.toLowerCase() === stageLower)
  if (index >= 0) return index
  
  if (stageLower === 'offer') {
    return stages.findIndex(s => s.key === 'decision')
  }
  
  return 0
}

export function getStageLabel(stage: string, viewType: 'candidate' | 'manager'): string {
  const stageObj = UNIFIED_STAGES.find(s => s.key === stage.toLowerCase())
  if (!stageObj) return stage
  return viewType === 'candidate' ? (stageObj.candidateLabel || stageObj.label) : (stageObj.managerLabel || stageObj.label)
}

export function getStatusLabel(stage: string, status: string, viewType: 'candidate' | 'manager' = 'candidate'): string {
  const stageLower = stage.toLowerCase()
  const statusLower = status.toLowerCase().replace(/[\s-]/g, '_')
  
  const statuses = viewType === 'candidate' ? CANDIDATE_STATUSES : MANAGER_STATUSES
  const stageStatuses = statuses[stageLower]
  
  if (stageStatuses) {
    const found = stageStatuses.find(s => s.key === statusLower)
    if (found) return found.label
  }
  
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
