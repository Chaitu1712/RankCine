import { LayoutDashboard, ShieldAlert, Users, HardDrive, Settings, Search, Bell, Clock, User, LogOut, UserCheck, Award, Terminal } from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';

export default function SuperAdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleAdminLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/admin'); // Redirect back to super admin login
  };

const menu = [
    { name: 'Global Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Moderation Queue', icon: ShieldAlert, path: '/admin/moderation' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Producer Approvals', icon: UserCheck, path: '/admin/approvals' },
    { name: 'Master Content', icon: HardDrive, path: '/admin/content' },
    { name: 'Global Sponsors', icon: Award, path: '/admin/sponsors' },
    { name: 'System Settings', icon: Settings, path: '/admin/settings' },
    { name: 'Audit Logs', icon: Terminal, path: '/admin/audit-logs' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6 z-20 flex-shrink-0">
        <div>
          <div className="mb-10">
            <h1 className="text-xl font-bold tracking-widest uppercase mb-1">Blueprint Mono</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Super Admin v1.0</p>
          </div>
          
          <nav className="space-y-1">
            {menu.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link key={item.name} to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}>
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <Link to="#" className="flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider">
             <span className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-full">?</span> Support
          </Link>
          <Link to="#" className="flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider">
             <span className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-sm">📄</span> Documentation
          </Link>
          <button 
            onClick={handleAdminLogout}
            className="flex items-center gap-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider w-full mt-4 pt-4 border-t border-gray-100"
          >
             <span className="w-5 h-5 flex items-center justify-center"><LogOut size={14} /></span> Terminate Session
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}