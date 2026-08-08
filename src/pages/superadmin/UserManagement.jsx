import { useState, useEffect, useRef } from 'react';
import { Sliders, Plus, MoreHorizontal, Filter, List, LayoutGrid } from 'lucide-react';

export default function UserManagement() {
  const [layout, setLayout] = useState('list');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const menuRef = useRef(null);

  const [accounts, setAccounts] = useState([
    { id: "#UA-88219", name: "Marcus Kenter", email: "marcus@kenter.studio", role: "B2B PRODUCER", date: "2023-10-12", activity: 80, status: "ACTIVE" },
    { id: "#UA-77402", name: "Sarah Liao", email: "sliao.design@gmail.com", role: "APP CONSUMER", date: "2024-01-05", activity: 15, status: "PENDING" },
    { id: "#UA-99310", name: "Vance Refrigeration", email: "bob@vance.com", role: "B2B PRODUCER", date: "2023-11-20", activity: 90, status: "SUSPENDED" },
    { id: "#UA-44109", name: "Axiom Design Studio", email: "contact@axiom.xyz", role: "B2B PRODUCER", date: "2024-02-14", activity: 45, status: "ACTIVE" }
  ]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAccounts = accounts.filter(acc => 
    statusFilter === 'ALL' ? true : acc.status.toUpperCase() === statusFilter
  );

  const handleToggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);
  
  // Account Status Handlers
  const handleApprove = (id) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: 'ACTIVE' } : acc));
    setOpenMenuId(null);
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

      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-[#000000]">User Management</h1>

      {/* Control Bar + Status Filter Chips + Layout Toggle */}
      <div className="flex justify-between items-center bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8">
        
        {/* Status Filter Chips */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#777777] mr-2" />
          <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider mr-2">Status:</span>
          {['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                statusFilter === st 
                  ? 'bg-[#5e5e5e] text-white' 
                  : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Layout Toggle (3-Line List vs 4-Square Grid) + Add User Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
            <span className="mr-2 text-[10px]">Layout:</span>
            <div className="flex border border-[#000000] bg-white">
              <button 
                onClick={() => setLayout('list')} 
                className={`p-2 transition ${layout === 'list' ? 'bg-[#000000] text-white' : 'bg-white text-[#777777] hover:bg-[#f3f3f4]'}`}
                title="List View"
              >
                <List size={16} />
              </button>
              
              <button 
                onClick={() => setLayout('grid')} 
                className={`p-2 transition ${layout === 'grid' ? 'bg-[#000000] text-white' : 'bg-white text-[#777777] hover:bg-[#f3f3f4]'}`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-[#000000] text-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-[#5e5e5e] transition">
            <Plus size={14} /> Add User
          </button>
        </div>

      </div>

      {/* ================= VIEW 1: TABLE / LIST VIEW ================= */}
      {layout === 'list' && (
        <div className="bg-white border border-[#c6c6c6]/20">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f3f3f4] border-b border-[#c6c6c6]/20 text-[10px] font-bold tracking-widest text-[#777777] uppercase">
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
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="border-b border-[#e8e8e8] hover:bg-[#f3f3f4] transition-colors">
                  <td className="p-5 text-xs font-mono text-[#777777]">{acc.id}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-[#e8e8e8] text-xs font-bold flex items-center justify-center tracking-tighter text-[#000000]">
                        {acc.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#000000] uppercase">{acc.name}</p>
                        <p className="text-[10px] text-[#777777] font-medium lowercase">{acc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="border border-[#c6c6c6] bg-[#f3f3f4] px-2 py-1 text-[9px] font-bold tracking-wider uppercase text-[#474747]">
                      {acc.role}
                    </span>
                  </td>
                  <td className="p-5 text-xs text-[#777777] font-mono">{acc.date}</td>
                  <td className="p-5">
                    <div className="w-full bg-[#e8e8e8] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#000000] h-full" style={{ width: `${acc.activity}%` }}></div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                      acc.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      acc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {acc.status}
                    </span>
                  </td>
                  
                  {/* Menu Dropdown */}
                  <td className="p-5 text-right relative" ref={openMenuId === acc.id ? menuRef : null}>
                    <button onClick={() => handleToggleMenu(acc.id)} className="text-[#777777] hover:text-black p-1 rounded-md transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {openMenuId === acc.id && (
                      <div className="absolute right-5 mt-1 w-40 bg-white border border-[#000000] shadow-2xl z-30 flex flex-col text-left py-1 text-[10px] font-bold uppercase tracking-wider">
                        
                        {/* PENDING Status Actions: Approve, Suspend, Remove */}
                        {acc.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleApprove(acc.id)} className="px-4 py-2.5 text-left text-green-700 hover:bg-[#f3f3f4]">
                              Approve User
                            </button>
                            <button onClick={() => handleSuspend(acc.id)} className="px-4 py-2.5 text-left text-red-600 hover:bg-[#f3f3f4] border-t border-[#e8e8e8]">
                              Suspend User
                            </button>
                          </>
                        )}

                        {/* ACTIVE Status Actions: Suspend */}
                        {acc.status === 'ACTIVE' && (
                          <button onClick={() => handleSuspend(acc.id)} className="px-4 py-2.5 text-left text-red-600 hover:bg-[#f3f3f4]">
                            Suspend User
                          </button>
                        )}

                        {/* SUSPENDED Status Actions: Unsuspend */}
                        {acc.status === 'SUSPENDED' && (
                          <button onClick={() => handleUnsuspend(acc.id)} className="px-4 py-2.5 text-left text-green-700 hover:bg-[#f3f3f4]">
                            Unsuspend User
                          </button>
                        )}

                        {/* Common Action: Remove */}
                        <button onClick={() => handleRemove(acc.id)} className="px-4 py-2.5 text-left text-[#474747] hover:bg-red-50 hover:text-red-700 border-t border-[#e8e8e8]">
                          Remove User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= VIEW 2: CARD GRID VIEW ================= */}
      {layout === 'grid' && (
        <div className="grid grid-cols-3 gap-6">
          {filteredAccounts.map((acc) => (
            <div key={acc.id} className="bg-white border border-[#c6c6c6]/20 p-6 relative hover:border-[#000000] transition">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-[#777777]">{acc.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                  acc.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                  acc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {acc.status}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#e8e8e8] text-sm font-bold flex items-center justify-center tracking-tighter text-[#000000]">
                  {acc.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#000000] uppercase">{acc.name}</h3>
                  <p className="text-xs text-[#777777] font-medium lowercase">{acc.email}</p>
                </div>
              </div>

              <div className="bg-[#f3f3f4] p-3 border border-[#c6c6c6]/20 space-y-2 mb-4">
                <div className="flex justify-between text-[10px] font-bold uppercase text-[#5e5e5e]">
                  <span>Role:</span>
                  <span className="text-black">{acc.role}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-[#5e5e5e]">
                  <span>Joined:</span>
                  <span className="font-mono text-black">{acc.date}</span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[10px] font-bold uppercase text-[#777777]">
                  <span>Activity Metric</span>
                  <span>{acc.activity}%</span>
                </div>
                <div className="w-full bg-[#e8e8e8] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#000000] h-full" style={{ width: `${acc.activity}%` }}></div>
                </div>
              </div>

              <div className="flex justify-end border-t border-[#e8e8e8] pt-3 relative" ref={openMenuId === acc.id ? menuRef : null}>
                <button onClick={() => handleToggleMenu(acc.id)} className="text-xs font-bold uppercase text-[#5e5e5e] hover:text-black flex items-center gap-1">
                  Actions <MoreHorizontal size={14} />
                </button>

                {openMenuId === acc.id && (
                  <div className="absolute right-0 bottom-10 w-40 bg-white border border-[#000000] shadow-2xl z-30 flex flex-col text-left py-1 text-[10px] font-bold uppercase tracking-wider">
                    {acc.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleApprove(acc.id)} className="px-4 py-2.5 text-left text-green-700 hover:bg-[#f3f3f4]">Approve User</button>
                        <button onClick={() => handleSuspend(acc.id)} className="px-4 py-2.5 text-left text-red-600 hover:bg-[#f3f3f4] border-t border-[#e8e8e8]">Suspend User</button>
                      </>
                    )}
                    {acc.status === 'ACTIVE' && (
                      <button onClick={() => handleSuspend(acc.id)} className="px-4 py-2.5 text-left text-red-600 hover:bg-[#f3f3f4]">Suspend User</button>
                    )}
                    {acc.status === 'SUSPENDED' && (
                      <button onClick={() => handleUnsuspend(acc.id)} className="px-4 py-2.5 text-left text-green-700 hover:bg-[#f3f3f4]">Unsuspend User</button>
                    )}
                    <button onClick={() => handleRemove(acc.id)} className="px-4 py-2.5 text-left text-[#474747] hover:bg-red-50 hover:text-red-700 border-t border-[#e8e8e8]">Remove User</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}