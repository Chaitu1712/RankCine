import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function GlobalDashboard() {
  // Mock Traffic Data for Line Chart
  const trafficData = [
    { day: 'Mon', value: 400 }, { day: 'Tue', value: 300 }, { day: 'Wed', value: 550 },
    { day: 'Thu', value: 450 }, { day: 'Fri', value: 700 }, { day: 'Sat', value: 650 }, { day: 'Sun', value: 800 }
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">System Overview</p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-10">Overview Dashboard</h1>

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-0 border border-gray-200 mb-12">
        <div className="p-8 bg-white border-r border-gray-200">
          <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Total App Users</p>
          <p className="text-4xl font-bold">124.8k <span className="text-xs text-green-500 font-normal">+12%</span></p>
        </div>
        <div className="p-8 bg-white border-r border-gray-200">
          <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">B2B Producers</p>
          <p className="text-4xl font-bold">1,204 <span className="text-xs text-green-500 font-normal">+3.1%</span></p>
        </div>
        <div className="p-8 bg-white border-r border-gray-200">
          <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Media Items</p>
          <p className="text-4xl font-bold">842.1k <span className="text-xs text-green-500 font-normal">+42k</span></p>
        </div>
        <div className="p-8 bg-black text-white relative">
          <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Pending Moderation</p>
          <p className="text-4xl font-bold">42</p>
          <span className="absolute top-8 right-8 text-white">⚠️</span>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Left: Chart */}
        <div className="w-2/3">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xs font-bold tracking-widest uppercase">Active Traffic / Reviews</h3>
            <div className="flex text-xs font-bold border border-gray-200">
              <span className="bg-black text-white px-4 py-1">7D</span>
              <span className="bg-white text-gray-400 px-4 py-1">30D</span>
            </div>
          </div>
          <div className="h-80 w-full bg-white border border-gray-200 relative p-4 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <Line type="monotone" dataKey="value" stroke="#000000" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 px-2">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
          </div>
        </div>

        {/* Right: API Health */}
        <div className="w-1/3">
          <h3 className="text-xs font-bold tracking-widest uppercase mb-6">System API Health</h3>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-xs font-bold text-black flex items-center gap-2"><span className="w-1.5 h-1.5 bg-black"></span> OPENAI API NORMAL</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">22MS AVG • VERIFIED 2M AGO</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-xs font-bold text-black flex items-center gap-2"><span className="w-1.5 h-1.5 bg-black"></span> PRODUCER PRD-9921 PENDING</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">ACTION REQUIRED • HIGH PRIORITY</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-xs font-bold text-gray-400 flex items-center gap-2"><span className="w-1.5 h-1.5 border border-gray-400"></span> SCHEDULED MAINTENANCE</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">OCT 24, 02:00 UTC • 4H DUR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}