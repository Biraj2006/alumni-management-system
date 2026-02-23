import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminReports from './pages/admin/AdminReports';

// Alumni pages
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AlumniProfile from './pages/alumni/AlumniProfile';
import AlumniJobs from './pages/alumni/AlumniJobs';
import AlumniMentorship from './pages/alumni/AlumniMentorship';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSearch from './pages/student/StudentSearch';
import StudentJobs from './pages/student/StudentJobs';
import StudentMentorship from './pages/student/StudentMentorship';
import StudentAlumniProfile from './pages/student/StudentAlumniProfile';

// Shared pages
import Announcements from './pages/Announcements';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  const getDefaultRedirect = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'alumni': return '/alumni/dashboard';
      case 'student': return '/student/dashboard';
      default: return '/login';
    }
  };

  return (
    <div className="app">
      {user && <Navbar />}
      <main className={user ? 'main-content' : 'main-content-full'}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to={getDefaultRedirect()} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={getDefaultRedirect()} />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/announcements" element={
            <ProtectedRoute roles={['admin']}>
              <AdminAnnouncements />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute roles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          } />

          {/* Alumni routes */}
          <Route path="/alumni/dashboard" element={
            <ProtectedRoute roles={['alumni']}>
              <AlumniDashboard />
            </ProtectedRoute>
          } />
          <Route path="/alumni/profile" element={
            <ProtectedRoute roles={['alumni']} requireApproval>
              <AlumniProfile />
            </ProtectedRoute>
          } />
          <Route path="/alumni/jobs" element={
            <ProtectedRoute roles={['alumni']} requireApproval>
              <AlumniJobs />
            </ProtectedRoute>
          } />
          <Route path="/alumni/mentorship" element={
            <ProtectedRoute roles={['alumni']} requireApproval>
              <AlumniMentorship />
            </ProtectedRoute>
          } />

          {/* Student routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute roles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/search" element={
            <ProtectedRoute roles={['student']}>
              <StudentSearch />
            </ProtectedRoute>
          } />
          <Route path="/student/jobs" element={
            <ProtectedRoute roles={['student']}>
              <StudentJobs />
            </ProtectedRoute>
          } />
          <Route path="/student/jobs/:id" element={
            <ProtectedRoute roles={['student']}>
              <StudentJobs />
            </ProtectedRoute>
          } />
          <Route path="/student/mentorship" element={
            <ProtectedRoute roles={['student']}>
              <StudentMentorship />
            </ProtectedRoute>
          } />
          <Route path="/student/alumni/:id" element={
            <ProtectedRoute roles={['student']}>
              <StudentAlumniProfile />
            </ProtectedRoute>
          } />

          {/* Shared routes */}
          <Route path="/announcements" element={
            <ProtectedRoute roles={['alumni', 'student']}>
              <Announcements />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to={getDefaultRedirect()} />} />
          <Route path="*" element={<Navigate to={getDefaultRedirect()} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
