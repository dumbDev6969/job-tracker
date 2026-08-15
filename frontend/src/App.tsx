import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthSessionProvider, Login } from '@/features/auth'
import { Jobs } from '@/features/job-track'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import {
  CalendarPage,
  JobDetailPage,
  JobsPage,
  MessagesPage,
  OverviewPage,
  ProfilePage,
  SettingsPage,
} from '@/pages'

function App() {
  return (
    <AuthSessionProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/debug-jobs" element={<div className="p-6"><Jobs /></div>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </AuthSessionProvider>
  )
}

export default App
