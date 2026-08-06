import { useNavigate } from 'react-router-dom';
import { Shield, Fingerprint } from 'lucide-react';

export default function SuperAdminLogin() {
  const navigate = useNavigate();

 const handleAdminLogin = (e) => {
    e.preventDefault();

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'SUPER_ADMIN');

    navigate('/admin/dashboard');
  };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center relative overflow-hidden font-sans select-none">
      
      {/* Blueprint Grid Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Top Left Branding */}
      <div className="absolute top-10 left-10">
        <h1 className="text-2xl font-extrabold tracking-widest uppercase mb-1">Blueprint Mono</h1>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Core / v1.0</p>
      </div>

      {/* Centered Login Terminal */}
      <div className="w-full max-w-lg bg-white border-2 border-black p-12 shadow-2xl relative z-10">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black flex items-center justify-center">
            <Shield size={32} color="white" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">RESTRICTED ACCESS</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Super Administrator Identity Required</p>
        </div>
        
        <form onSubmit={handleAdminLogin} className="space-y-6">
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black"></span> Root Clearance ID
            </label>
            <input 
              type="text" 
              placeholder="e.g. sys_admin_01" 
              className="w-full border border-gray-300 p-4 text-sm font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors bg-gray-50 focus:bg-white" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black"></span> Encryption Key
            </label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              className="w-full border border-gray-300 p-4 text-sm font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors bg-gray-50 focus:bg-white" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold py-5 text-xs tracking-widest uppercase mt-6 hover:bg-gray-800 transition-colors flex justify-center items-center gap-3"
          >
            <Fingerprint size={16} />
            Initialize Secure Session
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Unauthorized access is strictly prohibited. Activity is logged and audited.
          </p>
        </div>

      </div>
    </div>
  );
}