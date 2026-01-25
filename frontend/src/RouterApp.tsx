import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { ComplianceModule } from './pages/ComplianceModule'
import { AttendanceModule } from './pages/AttendanceModule'
import { RecruitmentModule } from './pages/RecruitmentModule'
import { OnboardingModule } from './pages/OnboardingModule'

/**
 * Router wrapper for the HR Portal
 * 
 * This component provides URL-based routing for extracted pages while
 * maintaining the existing App.tsx for backward compatibility.
 * 
 * Migration strategy:
 * 1. Extract high-value, isolated features to dedicated routes
 * 2. Keep existing App.tsx as default for unmigrated sections
 * 3. Gradually migrate more sections over time
 * 
 * Current extracted routes:
 * - /compliance - Compliance alerts dashboard
 * - /attendance - Attendance tracking
 * - /recruitment - Recruitment management (positions, candidates, pipeline)
 * - /onboarding - Onboarding management (HR view)
 * - /public-onboarding/:token - Public onboarding form (no auth)
 * 
 * Planned extractions:
 * - /admin - Admin dashboard
 */
export function RouterApp() {
  // TODO: Implement shared auth context to pass authenticated user to routes
  // Currently passing user={null} which forces ComplianceModule to redirect
  // to home for authentication. Future: Create AuthContext or use state management.
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Extracted modular pages */}
        <Route path="/compliance" element={<ComplianceModule user={null} />} />
        <Route path="/attendance" element={<AttendanceModule />} />
        <Route path="/recruitment" element={<RecruitmentModule />} />
        <Route path="/onboarding" element={<OnboardingModule />} />
        <Route path="/public-onboarding/:token?" element={<OnboardingModule />} />
        
        {/* Default route - Existing App.tsx handles all other sections */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
