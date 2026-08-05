import { HashRouter, Routes, Route } from 'react-router-dom';

// Layouts
import ProducerLayout from './layouts/ProducerLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Authentication Pages
import Login from './pages/Login';
import Registration from './pages/Registration';
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';

// Producer Studio Pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import AdminProfile from './pages/AdminProfile';

// Super Admin Pages
import GlobalDashboard from './pages/superadmin/GlobalDashboard';
import ModerationQueue from './pages/superadmin/ModerationQueue';
import UserManagement from './pages/superadmin/UserManagement';
import MasterContent from './pages/superadmin/MasterContent';
import AdminSettings from './pages/superadmin/AdminSettings';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* =========================================
            1. PUBLIC AUTHENTICATION ROUTES
            ========================================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin" element={<SuperAdminLogin />} />

        {/* =========================================
            2. PRODUCER STUDIO ROUTES (Uses ProducerLayout)
            ========================================= */}
        <Route element={<ProducerLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics/:id" element={<Analytics />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Route>

        {/* =========================================
            3. SUPER ADMIN PROTECTED ROUTES (Uses SuperAdminLayout)
            ========================================= */}
        <Route element={<ProtectedRoute allowedRole="SUPER_ADMIN" />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/admin/dashboard" element={<GlobalDashboard />} />
            <Route path="/admin/moderation" element={<ModerationQueue />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/content" element={<MasterContent />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}