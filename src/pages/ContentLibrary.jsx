import { useState } from 'react';
import { mockMovies } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Search, Filter, BarChart2, Award, MessageSquare } from 'lucide-react';

export default function ContentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Real-time Fuzzy Search + Category Filter
  const filteredMovies = mockMovies.filter((movie) => {
    const matchesType = filterType === 'ALL' || movie.type.toUpperCase() === filterType;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      movie.title.toLowerCase().includes(query) ||
      movie.type.toLowerCase().includes(query) ||
      movie.id.toLowerCase().includes(query);
    
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-10 max-w-6xl mx-auto pb-20">
      
      <div className="flex justify-between items-end mb-8 border-b border-[#e8e8e8] pb-6">
        <h1 className="text-3xl font-extrabold text-[#000000]">My Content Library</h1>
        
        <Link to="/upload" className="bg-[#000000] text-[#e2e2e2] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#5e5e5e] transition">
          + Upload New Asset
        </Link>
      </div>

      {/* Fuzzy Search Bar + Filter Chips */}
      <div className="flex justify-between items-center bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8 gap-6">
        
        {/* Real-Time Search Bar */}
        <div className="flex-1 flex items-center bg-white px-4 py-2 border border-[#c6c6c6] focus-within:border-black transition">
          <Search size={16} className="text-[#777777] mr-3" />
          <input 
            type="text" 
            placeholder="Fuzzy search title, type, or asset ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs font-medium text-black placeholder:text-[#777777]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-[#777777] hover:text-black font-bold">✕</button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#777777] mr-1" />
          {['ALL', 'TRAILER', 'PODCAST', 'ARTICLE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                filterType === type 
                  ? 'bg-[#5e5e5e] text-white' 
                  : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Content Cards */}
      <div className="grid grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="bg-[#f3f3f4] border border-[#c6c6c6]/20 p-6 flex flex-col justify-between hover:border-[#000000] transition group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#e8e8e8] text-[#474747] text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                  {movie.type}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                  movie.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {movie.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#000000] mb-1 group-hover:underline">{movie.title}</h3>
              <p className="text-[11px] font-mono text-[#777777] mb-6">Added {movie.dateAdded} • ID: {movie.id}</p>

              <div className="grid grid-cols-2 gap-4 bg-white p-4 border border-[#c6c6c6]/20 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-[#777777] uppercase">AI Rating</p>
                  <p className="text-xl font-extrabold text-[#000000]">{movie.aiScore}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#777777] uppercase">Audience</p>
                  <p className="text-xl font-extrabold text-[#000000]">{movie.audienceScore}</p>
                </div>
              </div>
            </div>

            {/* Direct Routing Links */}
            <div className="flex gap-2 border-t border-[#e8e8e8] pt-4">
              <Link 
                to={`/analytics/${movie.id}`} 
                className="flex-1 bg-white border border-[#c6c6c6] py-2 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#000000] hover:bg-[#000000] hover:text-white transition"
              >
                <BarChart2 size={12} /> Analytics
              </Link>
              <Link 
                to={`/reviews?id=${movie.id}`} 
                className="bg-[#e8e8e8] p-2 flex items-center justify-center text-[#000000] hover:bg-[#000000] hover:text-white transition"
                title="View Reviews"
              >
                <MessageSquare size={14} />
              </Link>
              <Link 
                to={`/campaigns?id=${movie.id}`} 
                className="bg-[#e8e8e8] p-2 flex items-center justify-center text-[#000000] hover:bg-[#000000] hover:text-white transition"
                title="Manage Campaigns"
              >
                <Award size={14} />
              </Link>
            </div>
          </div>
        ))}

        {filteredMovies.length === 0 && (
          <div className="col-span-3 bg-[#f3f3f4] p-12 text-center border border-[#c6c6c6]/20">
            <p className="text-sm font-bold text-[#000000] uppercase mb-1">No Assets Found</p>
            <p className="text-xs text-[#777777]">No content matched your fuzzy search query "{searchQuery}".</p>
          </div>
        )}
      </div>

    </div>
  );
}