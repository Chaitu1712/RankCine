import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

// Reusable Interactive Toggle Component
const Toggle = ({ label, description, isEnabled, onToggle }) => (
  <div className="border border-gray-200 p-6 flex justify-between items-start bg-white transition hover:border-gray-300">
    <div>
      <p className="text-sm font-bold">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
    <div 
      onClick={onToggle}
      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${isEnabled ? 'bg-black' : 'bg-gray-200'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${isEnabled ? 'right-1' : 'left-1 shadow'}`}></div>
    </div>
  </div>
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState(null);

  // Toggle States
  const [toggles, setToggles] = useState({
    emailAlerts: true,
    weeklyReport: false,
    reviewNotify: true,
    milestoneNotify: true,
    autoAIFormatting: true,
  });

  // Slider State
  const [sentimentThreshold, setSentimentThreshold] = useState(70);

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    setToast("Changes saved successfully.");

    // Dismiss the local toast after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20 relative">
      
      {/* Polished Top-Right Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-[800px] bg-white border border-gray-200 shadow-xl p-4 flex gap-3 w-80 items-start animate-fade-in relative overflow-hidden">
          <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <div className="pb-1 select-none">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Success</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast}</p>
          </div>
          
          {/* GPU-Accelerated Bottom-Border Timer */}
          <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-green-500 origin-left animate-toast-timer"></div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">System Settings</h1>
      
      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-10 pb-2 select-none">
        {['general', 'notifications', 'ai configuration'].map((tab) => (
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
        
        {/* ================= TAB: GENERAL ================= */}
        {activeTab === 'general' && (
          <div className="space-y-12 animate-fade-in">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase">The Annotation — Localization</p>
              <label className="block text-xs font-semibold text-gray-800 mb-2 uppercase">Default Dashboard Language</label>
              <select className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer">
                <option>English (US)</option>
                <option>Spanish (ES)</option>
                <option>French (FR)</option>
                <option>German (DE)</option>
                <option>Japanese (JP)</option>
              </select>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase">Reporting & Analytics</p>
              <div className="grid grid-cols-2 gap-6">
                <Toggle 
                  label="Email Alerts for New Reviews" 
                  description="Instant notification for community feedback."
                  isEnabled={toggles.emailAlerts}
                  onToggle={() => handleToggle('emailAlerts')}
                />
                <Toggle 
                  label="Weekly Analytics Report" 
                  description="Consolidated performance metrics every Monday."
                  isEnabled={toggles.weeklyReport}
                  onToggle={() => handleToggle('weeklyReport')}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: NOTIFICATIONS ================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-8 animate-fade-in">
             <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase">System Notifications</p>
              <div className="space-y-4">
                <Toggle 
                  label="Review Submissions" 
                  description="Notify me when a high-tier user reviews my content."
                  isEnabled={toggles.reviewNotify}
                  onToggle={() => handleToggle('reviewNotify')}
                />
                <Toggle 
                  label="Reward & Sponsor Milestones" 
                  description="Alerts when your content hits reward distribution thresholds."
                  isEnabled={toggles.milestoneNotify}
                  onToggle={() => handleToggle('milestoneNotify')}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: AI CONFIGURATION ================= */}
        {activeTab === 'ai configuration' && (
          <div className="space-y-12 animate-fade-in">
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold">AI Integration Engine</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Engine Ver: 2.4.0-Alpha</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Text Engine Model</label>
                    <select className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer">
                      <option>GPT-4o-mini (Speed & Cost)</option>
                      <option>GPT-4o (High Precision)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Audio Transcription</label>
                    <select className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer">
                      <option>OpenAI Whisper v3</option>
                      <option>Standard STT Engine</option>
                    </select>
                  </div>
                </div>

                <div className="border border-gray-200 p-6 bg-white">
                   <Toggle 
                    label="Auto-Format Raw Reviews" 
                    description="Allow AI to automatically synthesize raw user feedback into structured narrative summaries."
                    isEnabled={toggles.autoAIFormatting}
                    onToggle={() => handleToggle('autoAIFormatting')}
                  />
                </div>
                
                {/* Interactive Slider */}
                <div className="border border-gray-200 p-6 bg-white">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-sm font-bold">Sentiment Detection Threshold</p>
                      <p className="text-xs text-gray-500 mt-1">Adjust strictness for what is classified as 'Positive' feedback.</p>
                    </div>
                    <span className="text-2xl font-bold">{sentimentThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="100" 
                    value={sentimentThreshold} 
                    onChange={(e) => setSentimentThreshold(e.target.value)}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase">
                    <span>Lenient (50%)</span>
                    <span>Strict (100%)</span>
                  </div>
                </div>

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