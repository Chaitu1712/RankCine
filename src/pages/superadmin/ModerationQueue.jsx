import { useState } from 'react';
import { ShieldAlert, X, Eye, UserCheck, Play, Filter, AlertTriangle } from 'lucide-react';

export default function ModerationQueue() {
  const [activeTab, setActiveTab] = useState('FLAGGED REVIEWS');

  // Per-Tab Filter States
  const [flaggedFilter, setFlaggedFilter] = useState('ALL');
  const [reportedFilter, setReportedFilter] = useState('ALL');
  const [aiFailureFilter, setAiFailureFilter] = useState('ALL');

  // Drawer States
  const [selectedUserLogs, setSelectedUserLogs] = useState(null);
  const [selectedReportedAsset, setSelectedReportedAsset] = useState(null);

  // Datasets
  const [flaggedReviews, setFlaggedReviews] = useState([
    { id: "fr-1", date: "2023.10.24 — 14:22", user: "@URBAN_GRID_99", userId: "u-99", title: "The Brutalist Cafe", text: "The staff were [REDACTED] and treated us like garbage.", reason: "PROFANITY", totalFlags: 4 },
    { id: "fr-2", date: "2023.10.24 — 13:05", user: "@DESIGN_JUNKIE", userId: "u-88", title: "Linear Park", text: "GET CHEAP CRYPTO AT LINK_IN_BIO. BEST RETURNS 2026!", reason: "SPAM", totalFlags: 12 },
    { id: "fr-3", date: "2023.10.23 — 09:44", user: "@LOST_USER_404", userId: "u-404", title: "Subway Station D-4", text: "I hope this place burns down and everyone disappears.", reason: "HARASSMENT", totalFlags: 2 }
  ]);

  const [reportedMedia, setReportedMedia] = useState([
    { id: "rm-1", date: "2023.10.24 — 14:20", uploader: "Nexus Media Group", title: "Cyberpunk 2077 Launch Trailer", type: "TRAILER", reporter: "alex_vane_88", reason: "COPYRIGHT" },
    { id: "rm-2", date: "2023.10.24 — 11:05", uploader: "SoundWave Studios", title: "Midnight Eclipse Theme Extended", type: "SONG", reporter: "moderator_bot_01", reason: "LOW QUALITY" }
  ]);

  const [aiFailures, setAiFailures] = useState([
    { id: "af-1", date: "2023.10.24 — 16:00", assetTitle: "Neon Horizon Trailer", errorType: "LOW CONFIDENCE", confidenceScore: "42%", rawOutput: "Sentiment ambivalence detected across non-standard terminology." },
    { id: "af-2", date: "2023.10.24 — 12:30", assetTitle: "Audio Clip #402", errorType: "PARSING ERROR", confidenceScore: "0%", rawOutput: "Audio transcription buffer underrun. Whisper API timeout." }
  ]);

  return (
    <div className="p-10 max-w-7xl mx-auto pb-20 select-none relative">

      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-[#000000]">Moderation Queue</h1>

      {/* Main Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[#e8e8e8] pb-0">
        {['FLAGGED REVIEWS', 'REPORTED MEDIA', 'AI FILTER FAILURES'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition ${
              activeTab === tab ? 'bg-black text-white' : 'bg-[#f3f3f4] text-[#777777] hover:bg-[#e8e8e8]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: FLAGGED REVIEWS ================= */}
      {activeTab === 'FLAGGED REVIEWS' && (
        <div>
          {/* Per-Tab Filter Bar */}
          <div className="flex items-center gap-3 bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8">
            <Filter size={14} className="text-[#777777] mr-1" />
            <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider mr-2">Filter Reason:</span>
            {['ALL', 'PROFANITY', 'SPAM', 'HARASSMENT'].map(reason => (
              <button
                key={reason}
                onClick={() => setFlaggedFilter(reason)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                  flaggedFilter === reason ? 'bg-[#000000] text-white' : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#c6c6c6]/20">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f3f3f4] border-b border-[#c6c6c6]/20 text-[10px] font-bold tracking-widest text-[#777777] uppercase">
                <tr>
                  <th className="p-5">Date</th>
                  <th className="p-5">User (Audit Log)</th>
                  <th className="p-5">Content Title</th>
                  <th className="p-5 w-1/3">Original Review Text</th>
                  <th className="p-5">Reason</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedReviews
                  .filter(r => flaggedFilter === 'ALL' || r.reason === flaggedFilter)
                  .map((item) => (
                    <tr key={item.id} className="border-b border-[#e8e8e8] hover:bg-[#f3f3f4]">
                      <td className="p-5 text-xs text-[#777777] font-mono">{item.date}</td>
                      <td className="p-5 font-bold text-xs">
                        <button 
                          onClick={() => setSelectedUserLogs(item)}
                          className="text-black underline flex items-center gap-1 hover:text-[#5e5e5e]"
                        >
                          {item.user} <Eye size={12} />
                        </button>
                      </td>
                      <td className="p-5 text-xs italic text-[#474747]">{item.title}</td>
                      <td className="p-5 text-xs text-[#474747] leading-relaxed pr-8">"{item.text}"</td>
                      <td className="p-5"><span className="bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold uppercase">{item.reason}</span></td>
                      <td className="p-5 text-right space-x-2">
                        <button onClick={() => setFlaggedReviews(flaggedReviews.filter(f => f.id !== item.id))} className="bg-[#000000] text-white px-3 py-1.5 text-[10px] font-bold uppercase">Approve</button>
                        <button onClick={() => setFlaggedReviews(flaggedReviews.filter(f => f.id !== item.id))} className="border border-[#c6c6c6] text-red-600 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-red-50">Ban User</button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: REPORTED MEDIA ================= */}
      {activeTab === 'REPORTED MEDIA' && (
        <div>
          {/* Per-Tab Filter Bar */}
          <div className="flex items-center gap-3 bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8">
            <Filter size={14} className="text-[#777777] mr-1" />
            <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider mr-2">Filter Reason:</span>
            {['ALL', 'COPYRIGHT', 'LOW QUALITY'].map(reason => (
              <button
                key={reason}
                onClick={() => setReportedFilter(reason)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                  reportedFilter === reason ? 'bg-[#000000] text-white' : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#c6c6c6]/20">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f3f3f4] border-b border-[#c6c6c6]/20 text-[10px] font-bold tracking-widest text-[#777777] uppercase">
                <tr>
                  <th className="p-5">Report Date</th>
                  <th className="p-5">Uploader</th>
                  <th className="p-5">Media Title</th>
                  <th className="p-5">Reporter</th>
                  <th className="p-5">Reason</th>
                  <th className="p-5 text-right">Direct Content Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportedMedia
                  .filter(m => reportedFilter === 'ALL' || m.reason === reportedFilter)
                  .map((media) => (
                    <tr key={media.id} className="border-b border-[#e8e8e8] hover:bg-[#f3f3f4]">
                      <td className="p-5 text-xs text-[#777777] font-mono">{media.date}</td>
                      <td className="p-5 text-xs font-bold">{media.uploader}</td>
                      <td className="p-5 text-xs font-bold text-black">{media.title}</td>
                      <td className="p-5 text-xs text-[#5e5e5e] font-mono">{media.reporter}</td>
                      <td className="p-5"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-[10px] font-bold uppercase">{media.reason}</span></td>
                      <td className="p-5 text-right space-x-3">
                        <button onClick={() => setSelectedReportedAsset(media)} className="bg-[#000000] text-white px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-[#5e5e5e]">Preview Asset</button>
                        <button onClick={() => setReportedMedia(reportedMedia.filter(m => m.id !== media.id))} className="border border-red-300 text-red-600 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-red-50">Force Unpublish</button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: AI FILTER FAILURES ================= */}
      {activeTab === 'AI FILTER FAILURES' && (
        <div>
          {/* Per-Tab Filter Bar */}
          <div className="flex items-center gap-3 bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8">
            <Filter size={14} className="text-[#777777] mr-1" />
            <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider mr-2">Failure Type:</span>
            {['ALL', 'LOW CONFIDENCE', 'PARSING ERROR'].map(type => (
              <button
                key={type}
                onClick={() => setAiFailureFilter(type)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                  aiFailureFilter === type ? 'bg-[#000000] text-white' : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#c6c6c6]/20">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f3f3f4] border-b border-[#c6c6c6]/20 text-[10px] font-bold tracking-widest text-[#777777] uppercase">
                <tr>
                  <th className="p-5">Date</th>
                  <th className="p-5">Target Asset</th>
                  <th className="p-5">Error Classification</th>
                  <th className="p-5">AI Confidence</th>
                  <th className="p-5">Raw Exception Log</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {aiFailures
                  .filter(af => aiFailureFilter === 'ALL' || af.errorType === aiFailureFilter)
                  .map((fail) => (
                    <tr key={fail.id} className="border-b border-[#e8e8e8] hover:bg-[#f3f3f4]">
                      <td className="p-5 text-xs text-[#777777] font-mono">{fail.date}</td>
                      <td className="p-5 text-xs font-bold">{fail.assetTitle}</td>
                      <td className="p-5"><span className="bg-gray-200 text-gray-800 px-2 py-0.5 text-[10px] font-bold uppercase">{fail.errorType}</span></td>
                      <td className="p-5 text-xs font-mono font-bold">{fail.confidenceScore}</td>
                      <td className="p-5 text-xs font-mono text-[#777777]">{fail.rawOutput}</td>
                      <td className="p-5 text-right">
                        <button onClick={() => setAiFailures(aiFailures.filter(f => f.id !== fail.id))} className="bg-[#000000] text-white px-4 py-1.5 text-[10px] font-bold uppercase hover:bg-[#5e5e5e]">Reprocess AI Pipeline</button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USER AUDIT LOGS SLIDE-OUT DRAWER */}
      <div className={`fixed top-0 right-0 h-screen w-96 bg-white border-l-2 border-[#000000] shadow-2xl z-50 transform transition-transform duration-300 flex flex-col p-8 ${selectedUserLogs ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-start mb-6 border-b border-[#e8e8e8] pb-4">
          <div>
            <h3 className="text-lg font-bold">User Audit Trail</h3>
            <p className="text-[10px] font-mono text-[#777777] uppercase">{selectedUserLogs?.user}</p>
          </div>
          <button onClick={() => setSelectedUserLogs(null)} className="text-gray-400 hover:text-black"><X size={20} /></button>
        </div>

        {selectedUserLogs && (
          <div className="flex flex-col flex-1 space-y-6">
            <div className="bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20">
              <p className="text-[10px] font-bold text-[#777777] uppercase">Total Historical Flags</p>
              <p className="text-3xl font-extrabold text-red-600">{selectedUserLogs.totalFlags} Infractions</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-black uppercase">Recent System Logs:</p>
              <div className="border-l-2 border-black pl-3 py-1">
                <p className="text-[10px] font-mono text-[#777777]">2023.10.24 — Flagged for Profanity</p>
              </div>
              <div className="border-l-2 border-gray-300 pl-3 py-1">
                <p className="text-[10px] font-mono text-[#777777]">2023.09.12 — Account Suspended (3D)</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#e8e8e8] mt-auto">
              <button onClick={() => setSelectedUserLogs(null)} className="w-full bg-[#000000] text-white py-3 text-xs font-bold uppercase">
                Close User Audit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* REPORTED ASSET DIRECT PREVIEW DRAWER */}
      <div className={`fixed top-0 right-0 h-screen w-96 bg-white border-l-2 border-[#000000] shadow-2xl z-50 transform transition-transform duration-300 flex flex-col p-8 ${selectedReportedAsset ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-start mb-6 border-b border-[#e8e8e8] pb-4">
          <div>
            <h3 className="text-lg font-bold">Reported Asset Preview</h3>
            <p className="text-[10px] font-mono text-[#777777] uppercase">{selectedReportedAsset?.title}</p>
          </div>
          <button onClick={() => setSelectedReportedAsset(null)} className="text-gray-400 hover:text-black"><X size={20} /></button>
        </div>

        {selectedReportedAsset && (
          <div className="flex flex-col flex-1">
            <div className="bg-[#f3f3f4] border border-[#c6c6c6] h-48 flex flex-col items-center justify-center mb-6">
              <Play size={24} className="text-black mb-2" />
              <p className="text-xs font-mono text-[#777777]">Direct Media Stream</p>
            </div>

            <div className="space-y-2 text-xs text-[#474747] mb-6">
              <p>Report Reason: <strong className="text-red-600">{selectedReportedAsset.reason}</strong></p>
              <p>Uploader: <strong className="text-black">{selectedReportedAsset.uploader}</strong></p>
              <p>Reporter: <strong className="text-black">{selectedReportedAsset.reporter}</strong></p>
            </div>

            <button onClick={() => setSelectedReportedAsset(null)} className="w-full bg-[#000000] text-white py-3 text-xs font-bold uppercase mt-auto">
              Close Preview
            </button>
          </div>
        )}
      </div>

    </div>
  );
}