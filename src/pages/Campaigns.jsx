import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockCampaigns, mockMovies } from '../data/mockData';
import { Award, ArrowLeft, Plus, Filter, X, Play, Pause, Trash2 } from 'lucide-react';

export default function Campaigns() {
  const [searchParams] = useSearchParams();
  const selectedMediaId = searchParams.get('id');

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignsList, setCampaignsList] = useState(mockCampaigns);

  // New Campaign Form State
  const [newCamp, setNewCamp] = useState({
    sponsorName: '',
    title: '',
    percentileThreshold: 95,
    totalBudget: '$5,000',
    mediaId: selectedMediaId || 'm-1'
  });

  const currentMovie = mockMovies.find(m => m.id === selectedMediaId);

  // Status Handlers
  const handleUpdateStatus = (id, newStatus) => {
    setCampaignsList(campaignsList.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleRemoveCampaign = (id) => {
    setCampaignsList(campaignsList.filter(c => c.id !== id));
  };

  // Filter Logic: Asset Scoped + Status Filter
  const filteredCampaigns = campaignsList.filter(c => {
    const matchesMedia = selectedMediaId ? c.mediaId === selectedMediaId : true;
    const matchesStatus = statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter;
    return matchesMedia && matchesStatus;
  });

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const created = {
      id: `c-${Date.now()}`,
      ...newCamp,
      claimedBudget: '$0',
      activeVouchers: 0,
      status: 'ACTIVE'
    };
    setCampaignsList([created, ...campaignsList]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto pb-20 relative">

      <div className="flex justify-between items-end mb-8 border-b border-[#e8e8e8] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000000]">Sponsor Campaigns</h1>
          {currentMovie && (
            <p className="text-xs font-bold text-[#5e5e5e] mt-1">
              Filtering campaigns for: <span className="text-black uppercase underline">{currentMovie.title}</span>
            </p>
          )}
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#000000] text-[#e2e2e2] px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#5e5e5e] transition"
        >
          <Plus size={14} /> Create New Campaign
        </button>
      </div>

      {selectedMediaId && (
        <Link to={`/analytics/${selectedMediaId}`} className="inline-flex items-center gap-2 text-xs font-bold text-[#5e5e5e] hover:text-black mb-8 uppercase">
          <ArrowLeft size={14} /> Back to Content Analytics
        </Link>
      )}

      {/* Status Filter Chips */}
      <div className="flex items-center gap-3 bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 mb-8">
        <Filter size={14} className="text-[#777777] mr-1" />
        <span className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider mr-2">Status:</span>
        {['ALL', 'ACTIVE', 'PAUSED', 'FINISHED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
              statusFilter === st 
                ? 'bg-[#000000] text-white' 
                : 'bg-white border border-[#c6c6c6] text-[#474747] hover:bg-[#e8e8e8]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-6">
        {filteredCampaigns.map((camp) => (
          <div key={camp.id} className="bg-white border border-[#c6c6c6]/20 p-8 hover:border-[#000000] transition">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold bg-[#e8e8e8] text-[#5e5e5e] px-2 py-1 uppercase tracking-wider mb-2 inline-block">
                  Sponsor: {camp.sponsorName}
                </span>
                <h3 className="text-xl font-extrabold text-[#000000]">{camp.title}</h3>
              </div>
              
              <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-wider ${
                camp.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                camp.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'
              }`}>
                {camp.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-6 bg-[#f3f3f4] p-6 border border-[#c6c6c6]/20 mb-6">
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase">Percentile Target</p>
                <p className="text-xl font-extrabold text-[#000000]">Top {100 - camp.percentileThreshold}%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase">Total Budget</p>
                <p className="text-xl font-extrabold text-[#000000]">{camp.totalBudget}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase">Claimed Budget</p>
                <p className="text-xl font-extrabold text-[#000000]">{camp.claimedBudget}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase">Claimed Vouchers</p>
                <p className="text-xl font-extrabold text-[#000000]">{camp.activeVouchers}</p>
              </div>
            </div>

            {/* Dynamic Status Action Buttons */}
            <div className="flex justify-end gap-3">
              {camp.status === 'ACTIVE' && (
                <button 
                  onClick={() => handleUpdateStatus(camp.id, 'PAUSED')}
                  className="border border-[#c6c6c6] px-4 py-2 text-xs font-bold uppercase flex items-center gap-1 hover:bg-[#e8e8e8] transition"
                >
                  <Pause size={12} /> Pause Campaign
                </button>
              )}

              {camp.status === 'PAUSED' && (
                <button 
                  onClick={() => handleUpdateStatus(camp.id, 'ACTIVE')}
                  className="bg-[#000000] text-white px-4 py-2 text-xs font-bold uppercase flex items-center gap-1 hover:bg-[#5e5e5e] transition"
                >
                  <Play size={12} /> Resume Campaign
                </button>
              )}

              {camp.status === 'FINISHED' && (
                <button 
                  onClick={() => handleRemoveCampaign(camp.id)}
                  className="border border-red-300 text-red-600 px-4 py-2 text-xs font-bold uppercase flex items-center gap-1 hover:bg-red-50 transition"
                >
                  <Trash2 size={12} /> Remove Campaign
                </button>
              )}

              <button className="bg-[#000000] text-white px-6 py-2 text-xs font-bold uppercase hover:bg-[#5e5e5e] transition">
                Adjust Budget
              </button>
            </div>

          </div>
        ))}

        {filteredCampaigns.length === 0 && (
          <div className="bg-[#f3f3f4] p-12 border border-[#c6c6c6]/20 text-center">
            <Award size={32} className="mx-auto text-[#777777] mb-3" />
            <p className="text-sm font-bold text-[#000000] uppercase mb-1">No {statusFilter !== 'ALL' ? statusFilter : ''} Campaigns Found</p>
            <p className="text-xs text-[#777777]">There are no sponsor incentive campaigns matching your status filter criteria.</p>
          </div>
        )}
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-[#000000] p-8 max-w-lg w-full shadow-2xl">
            
            <div className="flex justify-between items-center mb-6 border-b border-[#e8e8e8] pb-4">
              <h3 className="text-xl font-extrabold text-[#000000]">Create Sponsor Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-black"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Target Media Asset</label>
                <select 
                  value={newCamp.mediaId}
                  onChange={(e) => setNewCamp({ ...newCamp, mediaId: e.target.value })}
                  className="w-full border border-[#c6c6c6] p-3 text-xs font-bold uppercase bg-white focus:outline-none focus:border-black"
                >
                  {mockMovies.map(m => (
                    <option key={m.id} value={m.id}>{m.title} ({m.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Sponsor Brand Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Axiom Design Vault"
                  value={newCamp.sponsorName}
                  onChange={(e) => setNewCamp({ ...newCamp, sponsorName: e.target.value })}
                  className="w-full border border-[#c6c6c6] p-3 text-xs font-medium focus:outline-none focus:border-black"
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Reward Item Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Architectural Asset Pack v2.0"
                  value={newCamp.title}
                  onChange={(e) => setNewCamp({ ...newCamp, title: e.target.value })}
                  className="w-full border border-[#c6c6c6] p-3 text-xs font-medium focus:outline-none focus:border-black"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Percentile Threshold</label>
                  <select 
                    value={newCamp.percentileThreshold}
                    onChange={(e) => setNewCamp({ ...newCamp, percentileThreshold: Number(e.target.value) })}
                    className="w-full border border-[#c6c6c6] p-3 text-xs font-bold bg-white focus:outline-none focus:border-black"
                  >
                    <option value={95}>Top 5% Reviewers</option>
                    <option value={90}>Top 10% Reviewers</option>
                    <option value={80}>Top 20% Reviewers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Allocated Budget</label>
                  <input 
                    type="text" 
                    placeholder="$5,000"
                    value={newCamp.totalBudget}
                    onChange={(e) => setNewCamp({ ...newCamp, totalBudget: e.target.value })}
                    className="w-full border border-[#c6c6c6] p-3 text-xs font-medium focus:outline-none focus:border-black"
                    required 
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 border border-[#c6c6c6] py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#e8e8e8]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-[#000000] text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#5e5e5e]"
                >
                  Launch Campaign
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}