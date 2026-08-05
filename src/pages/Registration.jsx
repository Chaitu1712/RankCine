import { Link, useNavigate } from 'react-router-dom';
import { registerProducer } from '../dataconnect-generated'; 

export default function Registration() {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const companyName = formData.get('companyName');
    const role = formData.get('role');
    
    try {
      const mockAuthId = `producer-uid-${Date.now()}`;

      await registerProducer({
        id: mockAuthId, 
        email: email,
        role: role,
        companyName: companyName
      });

      console.log("User & Producer saved to local database successfully!");
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Failed to register in local database:", error);
      alert("Database error. Check console!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">
      
      {/* Top Nav */}
      <div className="absolute top-6 left-10 text-xl font-bold tracking-tighter">RankCine</div>
      <div className="absolute top-6 right-10 text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-black">Contact Support</div>

      <div className="w-full max-w-md bg-white border border-gray-200 p-10 shadow-sm">
        <h2 className="text-2xl font-bold mb-8">Create Producer/Admin Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Full Name</label>
            <input name="fullName" type="text" placeholder="Enter your full name" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Email Address</label>
            <input name="email" type="email" placeholder="name@studio.com" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Company/Studio Name</label>
            <input name="companyName" type="text" placeholder="Enter legal entity name" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Primary Role</label>
            <select name="role" defaultValue="" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer" required>
              <option value="" disabled>Select your role</option>
              <option value="PRODUCER">Lead Producer</option>
              <option value="ADMIN">Studio Admin</option>
              <option value="CONTENT_MANAGER">Content Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Phone Number</label>
            <div className="flex gap-2">
              <input name="phone" type="tel" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="+1..." required />
              <button type="button" className="bg-gray-50 px-4 text-[10px] font-bold border border-gray-300 whitespace-nowrap uppercase hover:bg-gray-100 transition-colors">
                Generate OTP
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">OTP</label>
            <input name="otp" type="password" placeholder="••••••••" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
          </div>

          <button type="submit" className="w-full bg-black text-white font-bold py-4 text-xs tracking-widest uppercase mt-4 hover:bg-gray-800 transition-colors active:scale-95">
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