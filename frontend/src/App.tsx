import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthSessionProvider, Login } from '@/features/auth'
import { Jobs } from '@/features/job-track'
import { useTheme } from '@/features/settings'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import {
  CalendarPage,
  JobDetailPage,
  JobsPage,
  OverviewPage,
  ProfilePage,
  SettingsPage,
  WelcomePage,
} from '@/pages'

function AppContent() {
  useTheme()

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/welcome" element={<WelcomePage />} />

      <Route path="/register" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/debug-jobs" element={<div className="p-6"><Jobs /></div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthSessionProvider>
      <AppContent />
    </AuthSessionProvider>
  )
}

export default App
