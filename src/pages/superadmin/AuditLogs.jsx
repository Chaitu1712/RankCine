import { useState } from 'react';
import { Terminal, Shield, AlertTriangle, Info, Search } from 'lucide-react';

export default function AuditLogs() {
  const [logLevel, setLogLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const logs = [
    { id: "lg-901", time: "2026-03-14 12:44:02 UTC", level: "SECURITY", actor: "ROOT_ADMIN", event: "PRODUCER_APPROVED", ip: "192.168.1.102", details: "Producer ID #p-101 approved by super admin." },
    { id: "lg-902", time: "2026-03-14 11:20:15 UTC", level: "WARN", actor: "AI_ENGINE_V2", event: "LOW_CONFIDENCE_SCORE", ip: "10.0.4.12", details: "Review ID #r-88 returned 42% confidence." },
    { id: "lg-903", time: "2026-03-14 09:12:00 UTC", level: "INFO", actor: "SYSTEM_CRON", event: "LEDGER_BACKUP_SUCCESS", ip: "127.0.0.1", details: "Automated snapshot taken successfully." },
    { id: "lg-904", time: "2026-03-13 22:05:41 UTC", level: "ERROR", actor: "WHISPER_STT", event: "API_TIMEOUT_EXCEPTION", ip: "10.0.4.15", details: "Audio buffer payload failed to respond in 3000ms." }
  ];

  const filteredLogs = logs.filter(l => {
    const matchesLevel = logLevel === 'ALL' || l.level === logLevel;
    const query = searchQuery.toLowerCase();
    const matchesQuery = l.event.toLowerCase().includes(query) || l.actor.toLowerCase().includes(query) || l.details.toLowerCase().includes(query);
    return matchesLevel && matchesQuery;
  });

  return (
    <div className="p-10 max-w-7xl mx-auto pb-20 select-none">

      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-[#000000]">System Audit Logs</h1>

      {/* Control Bar */}
      <div className="flex justify-between items-center bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8 gap-6">
        <div className="flex-1 flex items-center bg-white px-4 py-2 border border-[#c6c6c6] focus-within:border-black transition">
          <Search size={16} className="text-[#777777] mr-3" />
          <input 
            type="text" 
            placeholder="Search event, actor, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs font-mono text-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider mr-2">Log Level:</span>
          {['ALL', 'INFO', 'WARN', 'ERROR', 'SECURITY'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setLogLevel(lvl)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                logLevel === lvl ? 'bg-[#000000] text-white' : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-[#000000] text-white p-6 font-mono text-xs border border-black shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 text-gray-500 text-[10px]">
          <span className="flex items-center gap-2"><Terminal size={14} /> LIVE STACK STREAM</span>
          <span>HOST: NODE_ADMIN_US_WEST_01</span>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div key={log.id} className="border-b border-gray-900 pb-3 hover:bg-gray-900/50 p-2 transition">
              <div className="flex items-center gap-4 mb-1">
                <span className="text-gray-500">{log.time}</span>
                <span className={`px-2 py-0.5 text-[9px] font-bold ${
                  log.level === 'SECURITY' ? 'bg-purple-900 text-purple-200' :
                  log.level === 'ERROR' ? 'bg-red-900 text-red-200' :
                  log.level === 'WARN' ? 'bg-yellow-900 text-yellow-200' : 'bg-gray-800 text-gray-300'
                }`}>
                  {log.level}
                </span>
                <span className="text-gray-300 font-bold">{log.actor}</span>
                <span className="text-gray-600">[{log.ip}]</span>
              </div>
              <p className="text-gray-400 pl-4">➔ <strong className="text-white">{log.event}</strong>: {log.details}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}