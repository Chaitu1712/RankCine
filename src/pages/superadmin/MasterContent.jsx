import { useState } from 'react';
import { Search, Check, X } from 'lucide-react';

export default function MasterContent() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const contentItems = [
    { id: "#M-9421-Z", uploader: "Neon Horizon Studios", title: "Interstellar Voyage - Official Trailer", type: "TRAILER", aiParams: true, status: "Live" },
    { id: "#M-8830-L", uploader: "Aether Records", title: "Echoes of Silence (Original Mix)", type: "SONG", aiParams: false, status: "Live" },
    { id: "#M-7215-K", uploader: "Vanguard Creative", title: "Cyberpunk 2077: Phantom Liberty Key Art", type: "POSTER", aiParams: true, status: "Hidden" },
    { id: "#M-5401-B", uploader: "Nova Productions", title: "The Last Dawn (Extended Cut)", type: "TRAILER", aiParams: true, status: "Live" },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto pb-20 select-none relative">
      
      {/* Header */}
      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">Content Architecture</p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Master Content Directory</h1>

      {/* Query Bar */}
      <div className="bg-white border border-gray-200 p-6 flex gap-6 items-end mb-10 shadow-sm">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Search Content Library</label>
          <div className="flex items-center bg-gray-50 px-4 py-2.5 border border-gray-200 focus-within:border-black transition-colors">
            <Search size={16} className="text-gray-400 mr-3" />
            <input type="text" placeholder="Entry ID, Title, or Producer Name..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        <div className="w-1/4">
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Filter by Media Type</label>
          <select className="w-full border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-black cursor-pointer">
            <option>All</option>
            <option>Trailer</option>
            <option>Song</option>
            <option>Poster</option>
          </select>
        </div>

        <button className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition">
          Execute Query
        </button>
      </div>

      {/* Data Grid Table */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            <tr>
              <th className="p-5 font-bold">Media ID</th>
              <th className="p-5 font-bold">Uploader (Producer)</th>
              <th className="p-5 font-bold">Media Title</th>
              <th className="p-5 font-bold">Type</th>
              <th className="p-5 font-bold text-center">AI Parameters</th>
              <th className="p-5 font-bold">Visibility Status</th>
              <th className="p-5 text-right font-bold">System Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-5 text-xs font-mono text-gray-400">{item.id}</td>
                <td className="p-5 font-bold text-xs">{item.uploader}</td>
                <td className="p-5 text-xs text-gray-600 font-medium max-w-xs truncate">{item.title}</td>
                <td className="p-5">
                  <span className="bg-gray-100 border border-gray-300 text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase text-gray-600">
                    {item.type}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex justify-center">
                    {item.aiParams ? (
                      <span className="w-5 h-5 bg-black rounded-full text-white text-xs flex items-center justify-center font-bold">✓</span>
                    ) : (
                      <span className="w-5 h-5 border border-gray-300 rounded-full text-gray-300 text-xs flex items-center justify-center font-bold">✗</span>
                    )}
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Live' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className="text-xs font-medium text-gray-700">{item.status}</span>
                  </div>
                </td>
                <td className="p-5 text-right space-x-4 text-xs font-bold tracking-wider uppercase select-none">
                  <button 
                    onClick={() => setSelectedMedia(item)} 
                    className="text-black hover:underline"
                  >
                    Preview Media
                  </button>
                  <button className="text-red-500 hover:underline">Force Unpublish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-[10px] font-bold text-gray-400 tracking-widest uppercase bg-gray-50">
          <span>Showing 1-4 of 1,240 Content Entries</span>
          <div className="flex gap-1 items-center">
            <button className="w-8 h-8 border border-gray-300 bg-white hover:bg-gray-100">&lt;</button>
            <span className="w-8 h-8 bg-black text-white text-xs font-bold flex items-center justify-center">1</span>
            <span className="w-8 h-8 bg-white border border-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-gray-50">2</span>
            <span className="w-8 h-8 bg-white border border-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-gray-50">3</span>
            <button className="w-8 h-8 border border-gray-300 bg-white hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>

      {/* =========================================
          MEDIA PREVIEW SLIDE-OUT DRAWER
          ========================================= */}
      <div 
        className={`fixed top-0 right-0 h-screen w-96 bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col p-8 ${
          selectedMedia ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-start mb-8 select-none">
          <div>
            <h3 className="text-lg font-bold">Media Preview</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">System.v1.Architecture</p>
          </div>
          <button 
            onClick={() => setSelectedMedia(null)}
            className="text-gray-400 hover:text-black p-1 hover:bg-gray-50 border border-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        {selectedMedia && (
          <div className="flex flex-col flex-1">
            {/* Visual Media Placeholder Box */}
            <div className="bg-gray-100 border border-gray-300 h-64 flex flex-col items-center justify-center text-gray-400 rounded-sm mb-8 relative">
              <span className="text-[10px] font-mono tracking-widest uppercase">Video.Placeholder</span>
              <p className="text-xs font-bold text-gray-500 uppercase mt-2">{selectedMedia.type}</p>
            </div>

            {/* Simulated Skeleton Loader or Metadata Details */}
            <div className="space-y-4 flex-1">
              <div className="h-4 bg-gray-100 w-1/3 rounded"></div>
              <div className="h-3 bg-gray-50 w-full rounded"></div>
              <div className="h-3 bg-gray-50 w-5/6 rounded"></div>
              <div className="h-3 bg-gray-50 w-4/5 rounded pb-10"></div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <p className="text-xs text-gray-400 font-bold uppercase">Uploader: <span className="text-black font-semibold">{selectedMedia.uploader}</span></p>
                <p className="text-xs text-gray-400 font-bold uppercase">ID Reference: <span className="text-black font-mono font-semibold">{selectedMedia.id}</span></p>
              </div>
            </div>
            
            <button className="bg-black text-white w-full py-4 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition">
              Inspect Asset Logs
            </button>
          </div>
        )}
      </div>

    </div>
  );
}