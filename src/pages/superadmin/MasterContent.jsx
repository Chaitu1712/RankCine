import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function MasterContent() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PUBLISHED, UNPUBLISHED

  const [contentItems, setContentItems] = useState([
    { id: "#M-9421-Z", uploader: "Neon Horizon Studios", title: "Interstellar Voyage - Official Trailer", type: "TRAILER", aiParams: true, status: "Live" },
    { id: "#M-8830-L", uploader: "Aether Records", title: "Echoes of Silence (Original Mix)", type: "SONG", aiParams: false, status: "Live" },
    { id: "#M-7215-K", uploader: "Vanguard Creative", title: "Cyberpunk 2077: Phantom Liberty Key Art", type: "POSTER", aiParams: true, status: "Hidden" },
    { id: "#M-5401-B", uploader: "Nova Productions", title: "The Last Dawn (Extended Cut)", type: "TRAILER", aiParams: true, status: "Live" },
  ]);

  // Combined Fuzzy Search + Media Type + Visibility Status Filter
  const filteredContent = contentItems.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = item.title.toLowerCase().includes(query) || item.uploader.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
    const matchesType = filterType === 'ALL' || item.type.toUpperCase() === filterType;
    
    const isLive = item.status === 'Live';
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'PUBLISHED' && isLive) || 
      (statusFilter === 'UNPUBLISHED' && !isLive);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleToggleStatus = (id) => {
    setContentItems(contentItems.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'Live' ? 'Hidden' : 'Live' };
      }
      return item;
    }));
  };

  return (
    <div className="p-10 max-w-7xl mx-auto pb-20 select-none relative">
      
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-[#000000]">Master Content Directory</h1>

      {/* Query Bar */}
      <div className="bg-[#f3f3f4] border border-[#c6c6c6]/20 p-6 flex gap-6 items-end mb-10 shadow-sm">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-[#5e5e5e] mb-2 uppercase tracking-wider">Search Content Library</label>
          <div className="flex items-center bg-white px-4 py-2.5 border border-[#c6c6c6] focus-within:border-black transition">
            <Search size={16} className="text-[#777777] mr-3" />
            <input 
              type="text" 
              placeholder="Entry ID, Title, or Producer Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-black" 
            />
          </div>
        </div>

        <div className="w-1/4">
          <label className="block text-[10px] font-bold text-[#5e5e5e] mb-2 uppercase tracking-wider">Filter Media Type</label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-[#c6c6c6] bg-white p-2.5 text-xs font-bold uppercase focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="TRAILER">Trailer</option>
            <option value="SONG">Song</option>
            <option value="POSTER">Poster</option>
          </select>
        </div>

        {/* Visibility Status Selector (Published vs Unpublished) */}
        <div className="w-1/4">
          <label className="block text-[10px] font-bold text-[#5e5e5e] mb-2 uppercase tracking-wider">Visibility Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-[#c6c6c6] bg-white p-2.5 text-xs font-bold uppercase focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="ALL">All Visibility</option>
            <option value="PUBLISHED">Published (Live)</option>
            <option value="UNPUBLISHED">Unpublished (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#c6c6c6]/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f3f3f4] border-b border-[#c6c6c6]/20 text-[10px] font-bold tracking-widest text-[#777777] uppercase">
            <tr>
              <th className="p-5 font-bold">Media ID</th>
              <th className="p-5 font-bold">Uploader (Producer)</th>
              <th className="p-5 font-bold">Media Title</th>
              <th className="p-5 font-bold">Type</th>
              <th className="p-5 font-bold text-center">AI Parameters</th>
              <th className="p-5 font-bold">Visibility</th>
              <th className="p-5 text-right font-bold">System Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.map((item) => (
              <tr key={item.id} className="border-b border-[#e8e8e8] hover:bg-[#f3f3f4] transition-colors">
                <td className="p-5 text-xs font-mono text-[#777777]">{item.id}</td>
                <td className="p-5 font-bold text-xs">{item.uploader}</td>
                <td className="p-5 text-xs text-[#474747] font-medium max-w-xs truncate">{item.title}</td>
                <td className="p-5">
                  <span className="bg-[#e8e8e8] text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase text-[#474747]">
                    {item.type}
                  </span>
                </td>
                <td className="p-5 text-center">
                  {item.aiParams ? <span className="text-xs font-bold text-black">✓</span> : <span className="text-xs text-gray-300">✗</span>}
                </td>
                <td className="p-5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                    item.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-5 text-right space-x-4 text-xs font-bold tracking-wider uppercase">
                  <button onClick={() => setSelectedMedia(item)} className="text-black hover:underline">
                    Preview Media
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(item.id)} 
                    className={item.status === 'Live' ? "text-red-600 hover:underline" : "text-green-700 hover:underline"}
                  >
                    {item.status === 'Live' ? "Force Unpublish" : "Publish Asset"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MEDIA PREVIEW SLIDE-OUT DRAWER */}
      <div className={`fixed top-0 right-0 h-screen w-96 bg-white border-l border-[#000000] shadow-2xl z-50 transform transition-transform duration-300 flex flex-col p-8 ${selectedMedia ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold">Media Preview</h3>
            <p className="text-[10px] font-mono text-[#777777] uppercase">{selectedMedia?.id}</p>
          </div>
          <button onClick={() => setSelectedMedia(null)} className="text-gray-400 hover:text-black"><X size={20} /></button>
        </div>

        {selectedMedia && (
          <div className="flex flex-col flex-1">
            <div className="bg-[#f3f3f4] border border-[#c6c6c6] h-64 flex flex-col items-center justify-center text-[#777777] mb-6">
              <span className="text-xs font-mono uppercase">Simulated Media Player</span>
              <p className="text-xs font-bold text-black uppercase mt-2">{selectedMedia.title}</p>
            </div>

            <div className="space-y-3 text-xs text-[#474747]">
              <p>Producer: <strong className="text-black">{selectedMedia.uploader}</strong></p>
              <p>Type: <strong className="text-black">{selectedMedia.type}</strong></p>
              <p>Status: <strong className="text-black">{selectedMedia.status}</strong></p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}