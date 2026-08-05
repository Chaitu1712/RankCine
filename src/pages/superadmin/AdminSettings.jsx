import { useState } from 'react';
import { ShieldCheck, Database, RefreshCw, CheckCircle } from 'lucide-react';

const Toggle = ({ label, description, isEnabled, onToggle }) => (
  <div className="border border-gray-200 p-6 flex justify-between items-start bg-white transition hover:border-gray-300">
    <div>
      <p className="text-sm font-bold">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>}
    </div>
    <div 
      onClick={onToggle}
      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${isEnabled ? 'bg-black' : 'bg-gray-200'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${isEnabled ? 'right-1' : 'left-1 shadow'}`}></div>
    </div>
  </div>
);

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('system config');
  const [toast, setToast] = useState(null);

  const [toggles, setToggles] = useState({
    maintenanceMode: false,
    blockRegistrations: false,
    force2FA: true,
    restrictIPs: false,
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    setToast("System parameters saved successfully.");
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20 relative">
      
      {/* Polished Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] bg-white border border-gray-200 shadow-xl p-4 flex gap-3 w-80 items-start animate-fade-in relative overflow-hidden">
          <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <div className="pb-1 select-none">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Success</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-green-500 origin-left animate-toast-timer"></div>
        </div>
      )}

      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Root Panel</p>
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>
      
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-10 pb-2 select-none">
        {['system config', 'security', 'database'].map((tab) => (
          <span 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold uppercase cursor-pointer transition-colors pb-2 -mb-[10px] ${
              activeTab === tab 
                ? 'border-b-2 border-black text-black' 
                : 'text-gray-400 hover:text-black border-b-2 border-transparent'
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="max-w-3xl space-y-12">
        
        {/* ================= TAB: SYSTEM CONFIG ================= */}
        {activeTab === 'system config' && (
          <div className="space-y-10 animate-fade-in">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase">Global Environment Overrides</p>
              <div className="space-y-4">
                <Toggle 
                  label="Global Maintenance Mode" 
                  description="Places all public and creator pages into offline mode. Admins still bypass."
                  isEnabled={toggles.maintenanceMode}
                  onToggle={() => handleToggle('maintenanceMode')}
                />
                <Toggle 
                  label="Block New Registrations" 
                  description="Temporarily stops both consumers and creators from registering new profiles."
                  isEnabled={toggles.blockRegistrations}
                  onToggle={() => handleToggle('blockRegistrations')}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: SECURITY ================= */}
        {activeTab === 'security' && (
          <div className="space-y-10 animate-fade-in">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase flex items-center gap-2">
                <ShieldCheck size={14} /> Security Compliance Rules
              </p>
              <div className="space-y-4">
                <Toggle 
                  label="Force Multi-Factor Authentication" 
                  description="Required 2FA verification for all studio producer accounts on login."
                  isEnabled={toggles.force2FA}
                  onToggle={() => handleToggle('force2FA')}
                />
                <Toggle 
                  label="Restrict Admin IPs" 
                  description="Only allow access to the admin panel from pre-approved whitelist IP groups."
                  isEnabled={toggles.restrictIPs}
                  onToggle={() => handleToggle('restrictIPs')}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: DATABASE ================= */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase flex items-center gap-2">
                <Database size={14} /> Global Ledger Backups
              </p>
              
              <div className="border border-gray-200 bg-white p-8 flex flex-col items-center justify-center text-center">
                <RefreshCw size={24} className="text-gray-400 mb-3" />
                <h4 className="text-sm font-bold mb-2">Automated Snapshot Backups</h4>
                <p className="text-xs text-gray-500 max-w-md mb-6 leading-relaxed">
                  Daily database schemas and records are backed up automatically. Click below to download a manual backup payload.
                </p>
                <button className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition">
                  Create Manual Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end pt-8 border-t border-gray-200 mt-12">
          <button 
            onClick={handleSaveSettings}
            className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition active:scale-95"
          >
            Save All Changes ✓
          </button>
        </div>
      </div>

    </div>
  );
}