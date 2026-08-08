import { LayoutDashboard, Film, BarChart2, Award, MessageSquare, UploadCloud, Settings, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const menu = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Content', icon: Film, path: '/content-library' },
    { name: 'Content Analytics', icon: BarChart2, path: '/analytics/m-1' },
    { name: 'Sponsor Campaigns', icon: Award, path: '/campaigns' },
    { name: 'All Reviews', icon: MessageSquare, path: '/reviews' },
    { name: 'Upload New', icon: UploadCloud, path: '/upload' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between p-6 fixed z-10 select-none">
      <div>
        <h1 className="text-xl font-bold tracking-tight mb-10 uppercase">Producer Studio</h1>
        <nav className="space-y-2">
          {menu.map((item) => {
            const basePath = item.path.split('/')[1] || '';
            const isActive = basePath ? location.pathname.includes(basePath) : false;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive
                  ? 'bg-gray-100 text-black font-semibold'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="space-y-2">
        <Link to="/profile" className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 p-2 -mx-2 rounded-md transition cursor-pointer">
          <div className="bg-gray-200 p-2 flex items-center justify-center text-gray-500">
            <User size={16} />
          </div>
          <div>
            <p className="text-black font-semibold">Admin User</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Production Lead</p>
          </div>
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-50 p-2 -mx-2 w-full rounded-md transition cursor-pointer text-left">
          <div className="p-2 flex items-center justify-center">
            <LogOut size={16} />
          </div>
          <span className="font-bold">Log Out</span>
        </button>
      </div>
    </div>
  );
}