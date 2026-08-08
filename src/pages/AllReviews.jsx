import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { mockMovies } from '../data/mockData';
import { MessageSquare, Mic, Video, Play, ArrowUpDown, Volume2, ArrowLeft } from 'lucide-react';

export default function AllReviews() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedMediaId = searchParams.get('id') || 'm-1';

  const [formatFilter, setFormatFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('RECENCY');
  const [activeMediaModal, setActiveMediaModal] = useState(null);

  // Load reviews FOR THIS GIVEN ASSET ONLY
  const currentAsset = mockMovies.find(m => m.id === selectedMediaId) || mockMovies[0];
  const assetReviews = currentAsset.reviews || [];

  // Filter Logic
  const filteredReviews = assetReviews.filter(r => 
    formatFilter === 'ALL' ? true : r.format.toUpperCase() === formatFilter
  );

  // Sort Logic
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'RECENCY') return b.timestamp - a.timestamp;
    if (sortBy === 'RELEVANCE') return b.relevanceScore - a.relevanceScore;
    if (sortBy === 'RATING') return b.score - a.score;
    return 0;
  });

  return (
    <div className="p-10 max-w-6xl mx-auto pb-20 relative">
      
      <div className="flex justify-between items-end mb-6 border-b border-[#e8e8e8] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000000]">Reviews for {currentAsset.title}</h1>
          <p className="text-xs font-mono text-[#777777] mt-1">
            Asset ID: {currentAsset.id} • Format: {currentAsset.type} • {sortedReviews.length} Total Reviews
          </p>
        </div>

        {/* Asset Selector Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Switch Asset</label>
          <select 
            value={currentAsset.id} 
            onChange={(e) => navigate(`/reviews?id=${e.target.value}`)}
            className="bg-white border border-[#c6c6c6] p-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer"
          >
            {mockMovies.map(m => (
              <option key={m.id} value={m.id}>{m.title} ({m.type})</option>
            ))}
          </select>
        </div>
      </div>

      <Link to={`/analytics/${currentAsset.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-[#5e5e5e] hover:text-black mb-8 uppercase">
        <ArrowLeft size={14} /> Back to Asset Analytics
      </Link>

      {/* Filter and Sort Control Bar */}
      <div className="flex justify-between items-center bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8">
        
        {/* Format Filter Chips */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider mr-2">Format:</span>
          {['ALL', 'TEXT', 'AUDIO', 'VIDEO'].map(fmt => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                formatFilter === fmt 
                  ? 'bg-[#000000] text-white' 
                  : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-[#777777]" />
          <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider">Sort By:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#c6c6c6] p-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="RECENCY">Recency (Newest First)</option>
            <option value="RELEVANCE">AI Relevance Score</option>
            <option value="RATING">Rating (High to Low)</option>
          </select>
        </div>

      </div>

      {/* Scoped Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white border border-[#c6c6c6]/20 p-6 hover:border-[#000000] transition">
            
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                {review.format === 'text' && <MessageSquare size={16} className="text-[#5e5e5e]" />}
                {review.format === 'audio' && <Mic size={16} className="text-[#000000]" />}
                {review.format === 'video' && <Video size={16} className="text-[#000000]" />}
                <span className="text-xs font-bold text-[#000000]">{review.user}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#f3f3f4] text-[#5e5e5e] uppercase">{review.tag}</span>
              </div>
              
              <span className="text-[11px] font-mono text-[#777777] uppercase">{review.time}</span>
            </div>

            <p className="text-sm text-[#474747] leading-relaxed mb-4">"{review.text}"</p>

            {/* Media Playback Trigger (for Audio/Video) */}
            {review.format !== 'text' && (
              <div className="mb-4 bg-[#f3f3f4] p-3 border border-[#c6c6c6]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {review.format === 'audio' ? <Volume2 size={16} /> : <Video size={16} />}
                  <span className="text-xs font-mono text-[#000000] uppercase">
                    Raw {review.format} Submission ({review.duration})
                  </span>
                </div>
                <button 
                  onClick={() => setActiveMediaModal(review)}
                  className="bg-[#000000] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#5e5e5e] transition"
                >
                  <Play size={10} /> Play Raw {review.format}
                </button>
              </div>
            )}

            <div className="flex justify-end gap-6 text-xs font-bold border-t border-[#f3f3f4] pt-3 text-[#5e5e5e]">
              <span>RELEVANCE: <strong className="text-black">{review.relevanceScore}%</strong></span>
              <span>SCORE: <strong className="text-black">{review.score}/10</strong></span>
            </div>

          </div>
        ))}

        {sortedReviews.length === 0 && (
          <div className="bg-[#f3f3f4] p-12 border border-[#c6c6c6]/20 text-center">
            <MessageSquare size={32} className="mx-auto text-[#777777] mb-3" />
            <p className="text-sm font-bold text-[#000000] uppercase mb-1">No Reviews Found</p>
            <p className="text-xs text-[#777777]">There are no consumer reviews matching format "{formatFilter}" for this asset.</p>
          </div>
        )}
      </div>

      {/* Raw Media Modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-[#000000] p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6 border-b border-[#e8e8e8] pb-4">
              <h3 className="text-lg font-bold uppercase">Raw {activeMediaModal.format} Playback</h3>
              <button onClick={() => setActiveMediaModal(null)} className="text-xs font-bold uppercase text-[#777777] hover:text-black">Close ✕</button>
            </div>

            <div className="bg-[#f3f3f4] border border-[#c6c6c6] h-48 flex flex-col items-center justify-center mb-6">
              <Play size={32} className="text-[#000000] mb-2" />
              <p className="text-xs font-mono text-[#777777]">Simulated {activeMediaModal.format} Stream: {activeMediaModal.duration}</p>
            </div>

            <p className="text-xs text-[#474747] italic mb-6">"{activeMediaModal.text}"</p>

            <button onClick={() => setActiveMediaModal(null)} className="w-full bg-[#000000] text-white py-3 text-xs font-bold uppercase tracking-wider">
              Dismiss Modal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}