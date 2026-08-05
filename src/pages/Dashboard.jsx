import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { mockMovies } from '../data/mockData';
import { CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const [toast, setToast] = useState(null);

  // Check if a redirect toast state was passed
  useEffect(() => {
    if (location.state?.showToast) {
      setToast(location.state.message);
      
      // Clear history state immediately so refreshing doesn't trigger the toast again
      window.history.replaceState({}, document.title);

      // Auto-dismiss the toast after 4 seconds (matching CSS timer)
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="p-10 max-w-6xl mx-auto relative">
      {/* Polished Top-Right Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-[800px] bg-white border border-gray-200 shadow-xl p-4 flex gap-3 w-80 items-start animate-fade-in relative overflow-hidden">
          <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <div className="pb-1 select-none">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Success</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast}</p>
          </div>
          
          {/* GPU-Accelerated Bottom-Border Timer */}
          <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-green-500 origin-left animate-toast-timer"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold text-gray-400 tracking-wider mb-1">SYSTEM OVERVIEW</p>
          <h1 className="text-3xl font-bold">Main Performance</h1>
        </div>
        <div className="flex gap-3">
          <button className="text-xs font-semibold border border-gray-300 px-4 py-2 hover:bg-gray-50">EXPORT REPORT</button>
          <button className="text-xs font-semibold bg-black text-white px-4 py-2">GENERATE AI INSIGHTS</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-6 border border-gray-200 bg-white">
          <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Total Active Items</p>
          <p className="text-3xl font-bold">1,248 <span className="text-sm text-green-500 font-normal">+12%</span></p>
        </div>
        <div className="p-6 border border-gray-200 bg-white">
          <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Total Audience Reviews</p>
          <p className="text-3xl font-bold">42.5K <span className="text-sm text-green-500 font-normal">+4.1K</span></p>
        </div>
        <div className="p-6 bg-black text-white">
          <p className="text-xs text-gray-400 mb-2 uppercase font-semibold">Average Audience Score</p>
          <p className="text-3xl font-bold">8.9 <span className="text-sm text-gray-300 font-normal">TOP 5%</span></p>
        </div>
      </div>

      <h3 className="text-sm font-bold mb-4 uppercase">Recent Content Performance</h3>
      <div className="bg-white border border-gray-200 w-full">
        <table className="w-full text-left text-sm text-center">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold">Media Type</th>
              <th className="p-4 font-semibold">Content Title</th>
              <th className="p-4 font-semibold">Date Added</th>
              <th className="p-4 font-semibold">AI Rating</th>
              <th className="p-4 font-semibold">Audience</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockMovies.map((movie) => (
              <tr key={movie.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4"><span className="bg-gray-200 border border-gray-400 font-bold text-xs px-2 py-1 uppercase">{movie.type}</span></td>
                <td className="p-4 font-medium">{movie.title}</td>
                <td className="p-4 text-gray-500">{movie.dateAdded}</td>
                <td className="p-4"><span className="bg-black text-white font-[1000] px-2 py-1 rounded text-xs">{movie.aiScore}</span></td>
                <td className="p-4 font-semibold">{movie.audienceScore}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 ${movie.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {movie.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link to={`/analytics/${movie.id}`} className="text-xs font-bold underline text-gray-600 hover:text-black transition-colors">
                    VIEW DETAILED
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}