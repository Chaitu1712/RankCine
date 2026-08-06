import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'PRODUCER');

    navigate('/dashboard');
  };
  return (
    <div className="flex h-screen bg-white">
      
      {/* Left side Graphic (Matches the abstract circular blueprint from wireframes) */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 relative overflow-hidden border-r border-gray-200">
        
        {/* Brand Logo Top Left */}
        <div className="absolute top-8 left-10 text-xl font-bold tracking-tighter text-black">RankCine</div>

        {/* Abstract Concentric Circles */}
        <div className="w-[500px] h-[500px] rounded-full border-[1px] border-gray-200 flex items-center justify-center absolute">
           <div className="w-[400px] h-[400px] rounded-full border-[1px] border-gray-300 flex items-center justify-center opacity-60">
              <div className="w-[300px] h-[300px] rounded-full border-[1px] border-gray-400 flex items-center justify-center opacity-40">
                <div className="w-[200px] h-[200px] rounded-full border-[1px] border-gray-500 opacity-20 bg-blue-50/20"></div>
              </div>
           </div>
        </div>
        
        {/* Footer Links on Graphic Side */}
        <div className="absolute bottom-8 flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span className="cursor-pointer hover:text-black transition-colors">Terms of Service</span>
          <span className="cursor-pointer hover:text-black transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-black transition-colors">Contact Support</span>
        </div>
      </div>
      
      {/* Right side Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12 relative">
        
        {/* Mobile-only Header Elements */}
        <div className="absolute top-6 left-8 lg:hidden text-xl font-bold tracking-tighter">RankCine</div>
        <div className="absolute top-6 right-8 text-[10px] font-bold text-gray-400 uppercase cursor-pointer hover:text-black lg:hidden tracking-wider">Contact Support</div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Admin Portal Login</h2>
          <p className="text-gray-500 mb-10 text-sm">Enter your admin credentials to access the production mainframe.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Phone Number</label>
              <div className="flex gap-2">
                <input type="tel" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="+1..." required />
                <button type="button" className="bg-gray-50 px-6 text-[10px] font-bold border border-gray-300 whitespace-nowrap uppercase hover:bg-gray-100 transition-colors">
                  Generate OTP
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">OTP</label>
              <input type="password" placeholder="••••••••" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" required />
            </div>
            
            {/* Remember Me & Forgot Password Row */}
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 accent-black cursor-pointer border-gray-300 rounded-sm" />
                Remember Me
              </label>
              <span className="cursor-pointer hover:text-black transition-colors">Forgot Password?</span>
            </div>
            
            <button type="submit" className="w-full bg-black text-white font-bold py-4 text-xs tracking-widest uppercase mt-4 hover:bg-gray-800 transition-colors">
              Log In →
            </button>

            {/* Registration Link */}
            <div className="text-center pt-6">
              <Link to="/register" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors border-b border-transparent hover:border-black pb-1">
                New Producer? Create an account here.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}