import { Link, useNavigate } from 'react-router-dom';

export default function Registration() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard'); // Route to dashboard on success
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">
      
      {/* Top Nav (Optional, matching wireframe style) */}
      <div className="absolute top-6 left-10 text-xl font-bold tracking-tighter">RankCine</div>
      <div className="absolute top-6 right-10 text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-black">Contact Support</div>

      <div className="w-full max-w-md bg-white border border-gray-200 p-10 shadow-sm">
        <h2 className="text-2xl font-bold mb-8">Create Producer/Admin Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Full Name</label>
            <input type="text" placeholder="Enter your full name" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Company/Studio Name</label>
            <input type="text" placeholder="Enter legal entity name" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Primary Role</label>
            <select className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer" required>
              <option value="" disabled selected>Select your role</option>
              <option value="producer">Lead Producer</option>
              <option value="admin">Studio Admin</option>
              <option value="content">Content Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Phone Number</label>
            <div className="flex gap-2">
              <input type="tel" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="+1..." required />
              <button type="button" className="bg-gray-50 px-4 text-[10px] font-bold border border-gray-300 whitespace-nowrap uppercase hover:bg-gray-100 transition-colors">
                Generate OTP
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">OTP</label>
            <input type="password" placeholder="••••••••" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
          </div>

          <button type="submit" className="w-full bg-black text-white font-bold py-4 text-xs tracking-widest uppercase mt-4 hover:bg-gray-800 transition-colors">
            Create Account
          </button>

          <div className="text-center mt-4">
            <Link to="/" className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-6 flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <span className="cursor-pointer hover:text-black transition-colors">Terms of Service</span>
        <span className="cursor-pointer hover:text-black transition-colors">Privacy Policy</span>
      </div>
    </div>
  );
}