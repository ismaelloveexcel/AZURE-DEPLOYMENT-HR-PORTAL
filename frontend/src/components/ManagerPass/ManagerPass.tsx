import { useState, useEffect } from 'react'

interface ManagerPassData {
  pass_id: string
  pass_token: string
  manager_id: string
  manager_name: string
  department: string
  position_id: number
  position_title: string
  position_status: string
  sla_days: number
  documents: RecruitmentDocument[]
  jd_status: string
  recruitment_form_status: string
  pipeline_stats: Record<string, number>
  total_candidates: number
  interview_setup: InterviewSetup | null
  confirmed_interviews: InterviewSlot[]
  unread_messages: number
  hr_whatsapp: string
  hr_email: string
}

interface RecruitmentDocument {
  id: number
  document_type: string
  document_name: string
  file_path: string | null
  status: string
  submitted_at: string | null
}

interface InterviewSetup {
  id: number
  technical_assessment_required: boolean
  interview_format: string
  interview_rounds: number
  notes: string | null
}

interface InterviewSlot {
  id: number
  slot_date: string
  start_time: string
  end_time: string
  round_number: number
  candidate_name: string | null
  candidate_confirmed: boolean
}

type ActiveTab = 'pipeline' | 'documents' | 'interviews' | 'calendar' | 'contact'

interface ManagerPassProps {
  recruitmentRequestId: number
  managerId: string
  token: string
  onBack?: () => void
}

export function ManagerPass({ recruitmentRequestId, managerId, token, onBack }: ManagerPassProps) {
  const [passData, setPassData] = useState<ManagerPassData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('pipeline')
  const [showInterviewSetup, setShowInterviewSetup] = useState(false)
  const [setupForm, setSetupForm] = useState({
    technical_assessment_required: false,
    interview_format: 'online',
    interview_rounds: 2,
    notes: ''
  })
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [additionalInterviewer, setAdditionalInterviewer] = useState('')

  const API_URL = '/api'

  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ]

  useEffect(() => {
    fetchPassData()
  }, [recruitmentRequestId])

  const fetchPassData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/interview/pass/manager/${recruitmentRequestId}?manager_id=${managerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to load pass data')
      const data = await response.json()
      setPassData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pass')
    } finally {
      setLoading(false)
    }
  }

  const saveInterviewSetup = async () => {
    try {
      const response = await fetch(`${API_URL}/interview/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recruitment_request_id: recruitmentRequestId,
          ...setupForm,
          additional_interviewers: additionalInterviewer ? [additionalInterviewer] : []
        })
      })
      if (!response.ok) throw new Error('Failed to save setup')
      
      let setupData = null
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json') && response.status !== 204) {
        try {
          setupData = await response.json()
        } catch {
          setupData = null
        }
      }
      
      if (selectedDates.length > 0 && selectedSlots.length > 0 && setupData?.id) {
        const slotsPayload = {
          interview_setup_id: setupData.id,
          dates: selectedDates,
          time_slots: selectedSlots.map(slot => {
            const [start, end] = slot.split('-')
            return { start_time: start + ':00', end_time: end + ':00' }
          }),
          round_number: 1
        }
        
        await fetch(`${API_URL}/interview/slots/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(slotsPayload)
        })
      }
      
      setShowInterviewSetup(false)
      setSelectedDates([])
      setSelectedSlots([])
      await fetchPassData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const toggleDate = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter(d => d !== date))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot))
    } else {
      setSelectedSlots([...selectedSlots, slot])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !passData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-2xl p-6 max-w-sm text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-base font-medium text-slate-800 mb-1">Access Error</h2>
          <p className="text-sm text-slate-500">{error || 'Unable to load pass'}</p>
          {onBack && (
            <button onClick={onBack} className="mt-4 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Go Back
            </button>
          )}
        </div>
      </div>
    )
  }

  const stageLabels: Record<string, string> = {
    applied: 'Applied',
    screening: 'Screening',
    assessment: 'Assessment',
    interview: 'Interview',
    offer: 'Offer',
    hired: 'Hired'
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Pass Card */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {onBack && (
                  <button onClick={onBack} className="p-1 -ml-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Manager Pass</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{passData.pass_id}</span>
            </div>
            
            <h1 className="text-xl font-semibold text-slate-800 mb-1">{passData.position_title}</h1>
            <p className="text-sm text-slate-500">{passData.department}</p>
            
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                passData.position_status === 'open' || passData.position_status === 'pending' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  passData.position_status === 'open' || passData.position_status === 'pending' 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-400'
                }`}></span>
                {passData.position_status}
              </span>
              <span className="text-xs text-slate-400">SLA: {passData.sla_days} days</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="px-6 pb-4 grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: passData.total_candidates },
              { label: 'Interview', value: passData.pipeline_stats['interview'] || 0 },
              { label: 'Scheduled', value: passData.confirmed_interviews.length },
              { label: 'Offers', value: passData.pipeline_stats['offer'] || 0 }
            ].map(stat => (
              <div key={stat.label} className="bg-slate-50/80 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-lg font-semibold text-slate-800">{stat.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-slate-100 px-2">
            <div className="flex">
              {[
                { id: 'pipeline', label: 'Pipeline', icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                )},
                { id: 'documents', label: 'Docs', icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )},
                { id: 'interviews', label: 'Setup', icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )},
                { id: 'calendar', label: 'Calendar', icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )},
                { id: 'contact', label: 'HR', icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )}
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1 relative transition-colors ${
                    activeTab === tab.id ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  <span className="text-[10px]">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-slate-800 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4 bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-2xl p-4 max-h-80 overflow-y-auto">
          {activeTab === 'pipeline' && (
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">Candidate Pipeline</h3>
              <div className="space-y-2">
                {['applied', 'screening', 'assessment', 'interview', 'offer', 'hired'].map(stage => (
                  <div key={stage} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-700">{stageLabels[stage]}</span>
                    <span className="text-sm font-semibold text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {passData.pipeline_stats[stage] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">Documents</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700">Job Description</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    passData.jd_status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    passData.jd_status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {passData.jd_status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700">Recruitment Form</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    passData.recruitment_form_status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    passData.recruitment_form_status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {passData.recruitment_form_status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interviews' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Interview Setup</h3>
                {!passData.interview_setup && !showInterviewSetup && (
                  <button
                    onClick={() => setShowInterviewSetup(true)}
                    className="text-xs text-slate-600 hover:text-slate-800 font-medium"
                  >
                    + Configure
                  </button>
                )}
              </div>

              {passData.interview_setup && !showInterviewSetup ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Format</p>
                        <p className="text-slate-800 font-medium capitalize">{passData.interview_setup.interview_format}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Rounds</p>
                        <p className="text-slate-800 font-medium">{passData.interview_setup.interview_rounds}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Technical Assessment</p>
                        <p className="text-slate-800 font-medium">{passData.interview_setup.technical_assessment_required ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInterviewSetup(true)}
                    className="w-full py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Add More Slots
                  </button>
                </div>
              ) : showInterviewSetup ? (
                <div className="space-y-4">
                  {/* Technical Assessment */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Technical Assessment Required?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSetupForm({ ...setupForm, technical_assessment_required: true })}
                        className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                          setupForm.technical_assessment_required 
                            ? 'bg-slate-800 text-white border-slate-800' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setSetupForm({ ...setupForm, technical_assessment_required: false })}
                        className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                          !setupForm.technical_assessment_required 
                            ? 'bg-slate-800 text-white border-slate-800' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Interview Format */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Interview Format</p>
                    <div className="flex gap-2">
                      {['online', 'in-person', 'hybrid'].map(format => (
                        <button
                          key={format}
                          onClick={() => setSetupForm({ ...setupForm, interview_format: format })}
                          className={`flex-1 py-2 text-sm rounded-lg border transition-colors capitalize ${
                            setupForm.interview_format === format 
                              ? 'bg-slate-800 text-white border-slate-800' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {format === 'in-person' ? 'In-Person' : format}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interview Rounds */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Interview Rounds</p>
                    <select
                      value={setupForm.interview_rounds}
                      onChange={(e) => setSetupForm({ ...setupForm, interview_rounds: parseInt(e.target.value) })}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-slate-400"
                    >
                      {[1, 2, 3, 4].map(n => (
                        <option key={n} value={n}>{n} Round{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Interview Dates */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Interview Dates</p>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        if (e.target.value && !selectedDates.includes(e.target.value)) {
                          setSelectedDates([...selectedDates, e.target.value])
                        }
                      }}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-slate-400"
                    />
                    {selectedDates.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedDates.map(date => (
                          <span
                            key={date}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-full"
                          >
                            {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <button
                              onClick={() => toggleDate(date)}
                              className="ml-1 text-slate-400 hover:text-slate-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available Time Slots */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Available Time Slots</p>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => toggleSlot(slot)}
                          className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                            selectedSlots.includes(slot)
                              ? 'bg-slate-800 text-white border-slate-800'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Interviewer */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Additional Interviewer</p>
                    <select
                      value={additionalInterviewer}
                      onChange={(e) => setAdditionalInterviewer(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-slate-400"
                    >
                      <option value="">Select interviewer</option>
                      <option value="Sarah Ahmed">Sarah Ahmed</option>
                      <option value="Mohammed Ali">Mohammed Ali</option>
                      <option value="Fatima Hassan">Fatima Hassan</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowInterviewSetup(false)}
                      className="flex-1 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveInterviewSetup}
                      className="flex-1 py-2.5 text-sm text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Save Setup
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No interview setup configured yet.</p>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">Confirmed Interviews</h3>
              {passData.confirmed_interviews.length > 0 ? (
                <div className="space-y-2">
                  {passData.confirmed_interviews.map(interview => (
                    <div key={interview.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{interview.candidate_name || 'Candidate'}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(interview.slot_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {interview.start_time.substring(0, 5)}
                          </p>
                        </div>
                        {interview.candidate_confirmed && (
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Confirmed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No confirmed interviews yet.</p>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">Contact HR</h3>
              <div className="space-y-2">
                <a
                  href={`https://wa.me/${passData.hr_whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">WhatsApp</p>
                    <p className="text-xs text-slate-500">{passData.hr_whatsapp}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${passData.hr_email}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Email</p>
                    <p className="text-xs text-slate-500">{passData.hr_email}</p>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
