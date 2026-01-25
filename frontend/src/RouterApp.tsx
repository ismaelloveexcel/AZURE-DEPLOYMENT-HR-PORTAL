import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { ComplianceModule } from './pages/ComplianceModule'

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
 * 
 * Planned extractions:
 * - /attendance - Attendance tracking
 * - /recruitment - Recruitment module
 * - /admin - Admin dashboard
 */
export function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Extracted modular pages */}
        <Route path="/compliance" element={<ComplianceModule user={null} />} />
        
        {/* Default route - Existing App.tsx handles all other sections */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
