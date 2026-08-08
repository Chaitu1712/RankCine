import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import ContentLibrary from './pages/ContentLibrary';
import Campaigns from './pages/Campaigns';
import AllReviews from './pages/AllReviews';

// Super Admin Pages
import GlobalDashboard from './pages/superadmin/GlobalDashboard';
import ModerationQueue from './pages/superadmin/ModerationQueue';
import UserManagement from './pages/superadmin/UserManagement';
import MasterContent from './pages/superadmin/MasterContent';
import AdminSettings from './pages/superadmin/AdminSettings';
import ProducerApprovals from './pages/superadmin/ProducerApprovals';
import SponsorManagement from './pages/superadmin/SponsorManagement';
import AuditLogs from './pages/superadmin/AuditLogs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================
            1. PUBLIC AUTHENTICATION ROUTES
            ========================================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin" element={<SuperAdminLogin />} />

        {/* =========================================
            2. PROTECTED PRODUCER STUDIO ROUTES
            ========================================= */}
        <Route element={<ProtectedRoute allowedRole="PRODUCER" redirectTo="/" />}>
          <Route element={<ProducerLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/content-library" element={<ContentLibrary />} />
            <Route path="/analytics/:id" element={<Analytics />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/reviews" element={<AllReviews />} /> 
            <Route path="/upload" element={<Upload />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* =========================================
            3. PROTECTED SUPER ADMIN ROUTES
            ========================================= */}
        <Route element={<ProtectedRoute allowedRole="SUPER_ADMIN" redirectTo="/admin" />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/admin/dashboard" element={<GlobalDashboard />} />
            <Route path="/admin/moderation" element={<ModerationQueue />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/approvals" element={<ProducerApprovals />} />
            <Route path="/admin/content" element={<MasterContent />} />
            <Route path="/admin/sponsors" element={<SponsorManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}