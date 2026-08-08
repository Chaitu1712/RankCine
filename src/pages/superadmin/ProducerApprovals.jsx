import { useState } from 'react';
import { CheckCircle, XCircle, FileText, Check } from 'lucide-react';

export default function ProducerApprovals() {
  const [pendingProducers, setPendingProducers] = useState([
    { id: "p-101", studioName: "Vellum Render Lab", contactPerson: "Elena Vance", email: "elena@vellum.io", taxId: "TAX-994821-US", date: "2026.03.14", licenseType: "Studio Pro Tier" },
    { id: "p-102", studioName: "Kenter Audio Group", contactPerson: "Marcus Kenter", email: "marcus@kenter.studio", taxId: "TAX-104928-DE", date: "2026.03.12", licenseType: "Enterprise Tier" },
  ]);

  const handleApprove = (id) => {
    setPendingProducers(pendingProducers.filter(p => p.id !== id));
  };

  const handleReject = (id) => {
    setPendingProducers(pendingProducers.filter(p => p.id !== id));
  };

  return (
    <div className="p-10 max-w-7xl mx-auto pb-20 select-none relative">

      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-[#000000]">Producer Verifications</h1>

      {/* Pending Applications List */}
      <div className="space-y-6">
        {pendingProducers.map((prod) => (
          <div key={prod.id} className="bg-white border border-[#c6c6c6]/20 p-8 hover:border-[#000000] transition">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold bg-[#e8e8e8] text-[#5e5e5e] px-2 py-1 uppercase tracking-wider mb-2 inline-block">
                  Application ID: {prod.id}
                </span>
                <h3 className="text-2xl font-extrabold text-[#000000]">{prod.studioName}</h3>
                <p className="text-xs text-[#777777] font-medium mt-1">Submitted on {prod.date}</p>
              </div>

              <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                Pending Audit
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6 bg-[#f3f3f4] p-6 border border-[#c6c6c6]/20 mb-6">
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase">Contact Executive</p>
                <p className="text-sm font-extrabold text-[#000000]">{prod.contactPerson}</p>
                <p className="text-xs text-[#777777] font-mono">{prod.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase">Tax / Business ID</p>
                <p className="text-sm font-mono font-extrabold text-[#000000]">{prod.taxId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase">License Tier</p>
                <p className="text-sm font-extrabold text-[#000000]">{prod.licenseType}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-[#e8e8e8] pt-4">
              <button className="flex items-center gap-2 text-xs font-bold text-[#5e5e5e] hover:text-black uppercase">
                <FileText size={14} /> View Attached Business License
              </button>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleReject(prod.id)}
                  className="border border-red-300 text-red-600 px-6 py-2.5 text-xs font-bold uppercase flex items-center gap-2 hover:bg-red-50 transition"
                >
                  <XCircle size={14} /> Reject Application
                </button>

                <button 
                  onClick={() => handleApprove(prod.id)}
                  className="bg-[#000000] text-white px-8 py-2.5 text-xs font-bold uppercase flex items-center gap-2 hover:bg-[#5e5e5e] transition"
                >
                  <Check size={14} /> Approve & Activate Producer
                </button>
              </div>
            </div>

          </div>
        ))}

        {pendingProducers.length === 0 && (
          <div className="bg-[#f3f3f4] p-12 border border-[#c6c6c6]/20 text-center">
            <CheckCircle size={32} className="mx-auto text-green-600 mb-3" />
            <p className="text-sm font-bold text-[#000000] uppercase mb-1">Queue Clear</p>
            <p className="text-xs text-[#777777]">There are no pending producer applications awaiting credentials auditing.</p>
          </div>
        )}
      </div>

    </div>
  );
}