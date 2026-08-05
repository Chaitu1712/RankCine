import { useState, useEffect, useRef } from 'react';
import { Sliders, Plus, MoreHorizontal } from 'lucide-react';

export default function UserManagement() {
  const [layout, setLayout] = useState('list');
  const [openMenuId, setOpenMenuId] = useState(null); // Tracks which user's dropdown is open
  const menuRef = useRef(null);

  // Accounts are now stored in React State so edits update the UI instantly
  const [accounts, setAccounts] = useState([
    { id: "#UA-88219", name: "Marcus Kenter", email: "marcus@kenter.studio", role: "B2B PRODUCER", date: "2023-10-12", activity: 80, status: "ACTIVE" },
    { id: "#UA-77402", name: "Sarah Liao", email: "sliao.design@gmail.com", role: "APP CONSUMER", date: "2024-01-05", activity: 15, status: "PENDING" },
    { id: "#UA-99310", name: "Vance Refrigeration", email: "bob@vance.com", role: "B2B PRODUCER", date: "2023-11-20", activity: 90, status: "SUSPENDED" },
  ]);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleSuspend = (id) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: 'SUSPENDED' } : acc));
    setOpenMenuId(null);
  };

  const handleUnsuspend = (id) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: 'ACTIVE' } : acc));
    setOpenMenuId(null);
  };

  const handleRemove = (id) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto pb-20 select-none relative">
      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">System Administration</p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-1">User Management</h1>
      <div className="w-32 h-1 bg-black mb-10"></div>

      {/* Control Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <select className="appearance-none border border-gray-300 bg-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase pr-10 focus:outline-none focus:border-black cursor-pointer">
              <option>All Accounts</option>
              <option>B2B Producers</option>
              <option>App Consumers</option>
            </select>
            <div className="absolute top-4 right-4 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 px-6 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-gray-50 transition-colors">
            <Sliders size={14} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors">
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* Accounts Directory */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            <tr>
              <th className="p-5 font-bold">Account ID</th>
              <th className="p-5 font-bold">Name / Studio</th>
              <th className="p-5 font-bold">Role</th>
              <th className="p-5 font-bold">Joined Date</th>
              <th className="p-5 font-bold w-40">Activity</th>
              <th className="p-5 font-bold">Status</th>
              <th className="p-5 text-right w-16"></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-5 text-xs font-mono text-gray-400">{acc.id}</td>
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-200 text-xs font-bold flex items-center justify-center tracking-tighter">
                      {acc.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black uppercase">{acc.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium lowercase">{acc.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="border border-gray-300 bg-gray-50 px-2 py-1 text-[9px] font-bold tracking-wider uppercase text-gray-600">
                    {acc.role}
                  </span>
                </td>
                <td className="p-5 text-xs text-gray-400 font-mono">{acc.date}</td>
                <td className="p-5">
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-black h-full" style={{ width: `${acc.activity}%` }}></div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-sm ${
                      acc.status === 'ACTIVE' ? 'bg-black' : acc.status === 'PENDING' ? 'bg-gray-300' : 'bg-red-500'
                    }`}></span>
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${
                      acc.status === 'ACTIVE' ? 'text-black' : acc.status === 'PENDING' ? 'text-gray-400' : 'text-red-500'
                    }`}>{acc.status}</span>
                  </div>
                </td>
                
                {/* Menu actions container */}
                <td className="p-5 text-right relative" ref={openMenuId === acc.id ? menuRef : null}>
                  <button 
                    onClick={() => handleToggleMenu(acc.id)} 
                    className="text-gray-400 hover:text-black p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  
                  {/* Floating Action Dropdown Menu */}
                  {openMenuId === acc.id && (
                    <div className="absolute right-5 mt-1 w-40 bg-white border border-gray-200 shadow-xl z-30 flex flex-col text-left py-1 text-[10px] font-bold uppercase tracking-wider animate-fade-in">
                      {acc.status === 'SUSPENDED' ? (
                        <button 
                          onClick={() => handleUnsuspend(acc.id)} 
                          className="px-4 py-2.5 text-left text-green-600 hover:bg-gray-50 transition-colors"
                        >
                          Unsuspend User
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSuspend(acc.id)} 
                          className="px-4 py-2.5 text-left text-red-500 hover:bg-gray-50 transition-colors"
                        >
                          Suspend User
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemove(acc.id)} 
                        className="px-4 py-2.5 text-left text-gray-500 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
                      >
                        Remove User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan="7" className="p-10 text-center text-sm text-gray-400 italic">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-[10px] font-bold text-gray-400 tracking-widest uppercase bg-gray-50">
          <span>Displaying {accounts.length} of {accounts.length} System Nodes</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 border border-gray-300 bg-white hover:bg-gray-100">&lt;</button>
            <button className="w-8 h-8 border border-gray-300 bg-white hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}