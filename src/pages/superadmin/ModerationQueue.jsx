import { useState } from 'react';

export default function ModerationQueue() {
  const [activeTab, setActiveTab] = useState('FLAGGED REVIEWS');

  const flaggedItems = [
    { date: "2023.10.24 — 14:22", user: "@URBAN_GRID_99", title: "The Brutalist Cafe", text: "The coffee was fine but the staff were absolutely [REDACTED] and treated us like garbage...", reason: "PROFANITY" },
    { date: "2023.10.24 — 13:05", user: "@DESIGN_JUNKIE", title: "Linear Park", text: "GET CHEAP CRYPTO NOW AT LINK_IN_BIO. BEST RETURNS!!!", reason: "SPAM" },
    { date: "2023.10.23 — 09:44", user: "@LOST_USER_404", title: "Subway Station D", text: "I hate this place so much I hope it burns down and everyone inside disappears.", reason: "HARASSMENT" },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Content Control</p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Moderation Queue</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-10 border-b border-gray-200 pb-0">
        {['FLAGGED REVIEWS', 'REPORTED MEDIA', 'AI FILTER FAILURES'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors ${
              activeTab === tab ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            <tr>
              <th className="p-5">Date</th>
              <th className="p-5">User</th>
              <th className="p-5">Content Title</th>
              <th className="p-5 w-1/3">Original Review Text</th>
              <th className="p-5">Flag Reason</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {flaggedItems.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-5 text-xs text-gray-500 font-mono">{item.date}</td>
                <td className="p-5 font-bold text-xs">{item.user}</td>
                <td className="p-5 text-xs italic text-gray-600">{item.title}</td>
                <td className="p-5 text-xs text-gray-700 leading-relaxed pr-8">"{item.text}"</td>
                <td className="p-5">
                  <span className="bg-gray-200 px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-gray-700">{item.reason}</span>
                </td>
                <td className="p-5 text-right space-x-2">
                  <button className="bg-black text-white px-4 py-2 text-[10px] font-bold tracking-wider uppercase hover:bg-gray-800">Approve</button>
                  <button className="border border-gray-300 bg-white px-4 py-2 text-[10px] font-bold tracking-wider uppercase hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">Ban User</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-[10px] font-bold text-gray-400 tracking-widest uppercase bg-gray-50">
          <span>Showing 3 of 1,248 Flagged Items</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 border border-gray-300 bg-white hover:bg-gray-100">&lt;</button>
            <button className="w-8 h-8 border border-gray-300 bg-white hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}