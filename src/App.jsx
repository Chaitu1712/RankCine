import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Existing Producer Imports
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import Registration from './pages/Registration';

// NEW: Super Admin Imports
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import GlobalDashboard from './pages/superadmin/GlobalDashboard';
import ModerationQueue from './pages/superadmin/ModerationQueue';
import UserManagement from './pages/superadmin/UserManagement';
import MasterContent from './pages/superadmin/MasterContent';
import AdminSettings from './pages/superadmin/AdminSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        
        {/* Producer Studio Routes (Assuming these are for 'PRODUCER' role eventually) */}
        <Route path="*" element={
          <div className="flex">
            <Sidebar />
            <div className="ml-64 flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics/:id" element={<Analytics />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        } />

        {/* =========================================
            SUPER ADMIN PROTECTED ROUTES
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
    </BrowserRouter>
  );
}

export default App;