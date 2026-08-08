import { useState } from 'react';
import { Award, Plus, Building, X } from 'lucide-react';

export default function SponsorManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [sponsors, setSponsors] = useState([
    { id: "s-1", name: "Axiom Design Vault", category: "3D Asset Packs", activeCampaigns: 4, totalFinanced: "$24,500", status: "ACTIVE" },
    { id: "s-2", name: "Vellum Render Lab", category: "Octane Shaders", activeCampaigns: 2, totalFinanced: "$12,000", status: "ACTIVE" },
    { id: "s-3", name: "Structural Audio Lab", category: "Soundscape Presets", activeCampaigns: 1, totalFinanced: "$5,000", status: "ACTIVE" }
  ]);

  const [newSponsor, setNewSponsor] = useState({ name: '', category: '3D Asset Packs' });

  const handleAddSponsor = (e) => {
    e.preventDefault();
    setSponsors([...sponsors, { id: `s-${Date.now()}`, ...newSponsor, activeCampaigns: 0, totalFinanced: "$0", status: "ACTIVE" }]);
    setShowAddModal(false);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto pb-20 select-none relative">

      <div className="flex justify-between items-end mb-8 border-b border-[#e8e8e8] pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#000000]">Global Sponsors</h1>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#000000] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#5e5e5e] transition"
        >
          <Plus size={14} /> Add Brand Sponsor
        </button>
      </div>

      {/* Grid of Sponsors */}
      <div className="grid grid-cols-3 gap-6">
        {sponsors.map((sp) => (
          <div key={sp.id} className="bg-white border border-[#c6c6c6]/20 p-6 flex flex-col justify-between hover:border-[#000000] transition">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-[#777777]">{sp.id}</span>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">{sp.status}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#f3f3f4] border border-[#c6c6c6] flex items-center justify-center">
                  <Building size={18} className="text-black" />
                </div>
                <div>
                  <h3 className="text-md font-extrabold text-[#000000] uppercase">{sp.name}</h3>
                  <p className="text-[10px] font-bold text-[#777777] uppercase">{sp.category}</p>
                </div>
              </div>

              <div className="bg-[#f3f3f4] p-4 border border-[#c6c6c6]/20 space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#5e5e5e] uppercase text-[10px]">Active Campaigns:</span>
                  <span>{sp.activeCampaigns}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#5e5e5e] uppercase text-[10px]">Total Rewards Financed:</span>
                  <span>{sp.totalFinanced}</span>
                </div>
              </div>
            </div>

            <button className="w-full border border-[#c6c6c6] py-2 text-xs font-bold uppercase hover:bg-[#000000] hover:text-white transition">
              View Partner Vouchers
            </button>
          </div>
        ))}
      </div>

      {/* ADD SPONSOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-[#000000] p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#e8e8e8] pb-4">
              <h3 className="text-xl font-extrabold">Add Partner Sponsor</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddSponsor} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Brand Sponsor Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Adobe Render Systems"
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                  className="w-full border border-[#c6c6c6] p-3 text-xs font-medium focus:outline-none focus:border-black"
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Incentive Category</label>
                <select 
                  value={newSponsor.category}
                  onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                  className="w-full border border-[#c6c6c6] p-3 text-xs font-bold uppercase bg-white focus:outline-none focus:border-black"
                >
                  <option value="3D Asset Packs">3D Asset Packs</option>
                  <option value="Octane Shaders">Octane Shaders</option>
                  <option value="Soundscape Presets">Soundscape Presets</option>
                  <option value="Software Voucher">Software Voucher</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/2 border border-[#c6c6c6] py-3 text-xs font-bold uppercase hover:bg-[#e8e8e8]">Cancel</button>
                <button type="submit" className="w-1/2 bg-[#000000] text-white py-3 text-xs font-bold uppercase hover:bg-[#5e5e5e]">Register Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}