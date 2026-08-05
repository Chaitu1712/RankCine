import { User, Archive, CheckCircle } from 'lucide-react';

export default function AdminProfile() {
  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      
      {/* Header Profile Section */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-400">
            <User size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin User</h1>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              Lead Producer • Axiom Design Studio
            </p>
          </div>
        </div>
        <button className="bg-black text-white px-6 py-2 text-xs font-bold uppercase hover:bg-gray-800 transition">
          Edit Profile
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 p-6 bg-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase">Metric 01</p>
            <Archive size={16} className="text-gray-300" />
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Content Uploaded</p>
          <p className="text-4xl font-bold">1,284 <span className="text-sm font-normal text-gray-400">UNITS</span></p>
        </div>
        
        <div className="border border-gray-200 p-6 bg-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase">Metric 02</p>
            <CheckCircle size={16} className="text-gray-300" />
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Reviews Collected</p>
          <p className="text-4xl font-bold">492 <span className="text-sm font-normal text-gray-400">VERIFIED</span></p>
        </div>
      </div>

      {/* Account Details Form/List */}
      <div>
        <h2 className="text-lg font-bold mb-6">Account Details</h2>
        
        <div className="border border-gray-200 bg-white mb-8">
          <div className="flex border-b border-gray-100 p-6">
            <div className="w-1/3 text-xs font-bold text-gray-500 uppercase">Email Address</div>
            <div className="w-2/3 text-sm font-medium">j.sterling@axiom-studio.xyz</div>
          </div>
          
          <div className="flex border-b border-gray-100 p-6">
            <div className="w-1/3 text-xs font-bold text-gray-500 uppercase">Language Preference</div>
            <div className="w-2/3 text-sm font-medium">English (Universal)</div>
          </div>
          
          <div className="flex p-6">
            <div className="w-1/3 text-xs font-bold text-gray-500 uppercase">Joined Date</div>
            <div className="w-2/3 text-sm font-medium text-gray-600">October 12, 2023</div>
          </div>
        </div>

        <button className="border border-gray-300 px-6 py-3 text-xs font-bold uppercase hover:bg-gray-50 transition">
          Change Password
        </button>
      </div>

    </div>
  );
}