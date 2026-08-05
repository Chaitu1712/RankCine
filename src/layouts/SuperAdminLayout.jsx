import { LayoutDashboard, ShieldAlert, Users, HardDrive, Settings, Search, Bell, Clock, User } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';

export default function SuperAdminLayout() {
  const location = useLocation();

  const menu = [
    { name: 'Global Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Moderation Queue', icon: ShieldAlert, path: '/admin/moderation' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Master Content', icon: HardDrive, path: '/admin/content' },
    { name: 'System Settings', icon: Settings, path: '/admin/settings' },
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 flex-shrink-0">
          <div className="flex items-center bg-gray-50 px-4 py-2 w-96 border border-gray-200 focus-within:border-black transition-colors">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search system entities..." className="bg-transparent border-none outline-none text-sm ml-3 w-full" />
          </div>
          
          <div className="flex items-center gap-6 text-gray-500">
            <Clock size={20} className="cursor-pointer hover:text-black" />
            <Bell size={20} className="cursor-pointer hover:text-black" />
            <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden">
               <User size={16} />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}