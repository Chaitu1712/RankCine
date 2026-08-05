import { useParams } from 'react-router-dom';
import { mockMovies } from '../data/mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  // Helper to dynamically calculate the custom rounded-square donut segments based on data
  const getConicGradient = (data, colors) => {
    let cumulative = 0;
    const sectors = data.map((item, index) => {
      const start = cumulative;
      cumulative += item.value;
      const color = colors[index % colors.length];
      return `${color} ${start}% ${cumulative}%`;
    });
    return `conic-gradient(${sectors.join(', ')})`;
  };

  const { id } = useParams();
  const movie = mockMovies.find(m => m.id === id) || mockMovies[0];  // Currently loading Neon Horizon. You can change to [1] or [2] to see other data!

  const chartColors = ['#000000', '#6b7280', '#d1d5db']; // Black, Dark Gray, Light Gray

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      <p className="text-xs font-bold text-gray-400 tracking-wider mb-1 uppercase">Content Studio / Draft</p>

      {/* Top Section: Media & High-Level Scores */}
      <div className="flex gap-10 mt-6">
        <div className="w-2/3 bg-gray-100 border border-gray-300 h-80 flex flex-col items-center justify-center relative">
          <p className="text-2xl font-bold tracking-widest uppercase">{movie.title}</p>
          <p className="text-sm text-gray-500 border border-gray-400 px-2 mt-2 bg-white">{movie.type}</p>
          <div className="absolute bottom-4 left-4 right-4 h-1 bg-gray-300">
            <div className="w-1/3 h-full bg-black"></div>
          </div>
        </div>

        <div className="w-1/3 flex flex-col gap-6">
          <div className="border border-gray-200 p-6 bg-white">
            <p className="text-xs font-semibold text-gray-500 mb-1">OVERALL AUDIENCE SCORE</p>
            <p className="text-4xl font-bold">{movie.audienceScore} <span className="text-sm font-normal text-gray-400">/10</span></p>
          </div>
          <div className="border border-gray-200 p-6 bg-white">
            <p className="text-xs font-semibold text-gray-500 mb-1">AI QUALITY SCORE</p>
            <p className="text-4xl font-bold">{movie.aiScore * 10}<span className="text-xl">%</span></p>
          </div>
          <div className="border border-gray-200 p-6 bg-white">
            <p className="text-xs font-semibold text-gray-500 mb-1">TOTAL REVIEWS</p>
            <p className="text-4xl font-bold">{movie.totalReviews}</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Radar Chart */}
      <h3 className="text-sm font-bold mt-12 mb-6 uppercase">Sentiment Profile</h3>
      <div className="bg-white border border-gray-200 p-8 h-96 flex justify-center items-center mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={movie.parameters}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
            <Radar name="Score" dataKey="A" stroke="#000000" fill="#000000" fillOpacity={0.1} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section: Demographics & AI Reviews */}
      <div className="flex gap-10">
        {/* Left: Demographics with Custom Rounded-Square Donut Charts */}
        <div className="w-1/3 flex flex-col gap-10 select-none">

          {/* Age Demographics */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-black"></span> Reviewers by Age
            </h3>
            <div className="flex items-center gap-8">
              {/* Custom Rounded-Square Donut */}
              <div
                className="w-28 h-28 rounded-[24px] relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
                style={{ background: getConicGradient(movie.demographics.age, chartColors) }}
              >
                <div className="w-[84px] h-[84px] bg-white rounded-[18px] flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Age</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {movie.demographics.age.map((a, i) => (
                  <div key={a.name} className="flex justify-between text-xs font-medium items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors[i % chartColors.length] }}></div>
                      <span className="text-gray-500 font-semibold">{a.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gender Demographics */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-black"></span> Reviewers by Gender
            </h3>
            <div className="flex items-center gap-8">
              {/* Custom Rounded-Square Donut */}
              <div
                className="w-28 h-28 rounded-[24px] relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
                style={{ background: getConicGradient(movie.demographics.gender, chartColors) }}
              >
                <div className="w-[84px] h-[84px] bg-white rounded-[18px] flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</span>
                </div>
              </div>                
              {/* Legend */}
              <div className="flex-1 space-y-3">
                {movie.demographics.gender.map((g, i) => (
                  <div key={g.name} className="flex justify-between text-xs font-medium items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors[i % chartColors.length] }}></div>
                      <span className="text-gray-500 font-semibold">{g.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{g.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI-Filtered Reviews */}
        <div className="w-2/3">
          <h3 className="text-sm font-bold mb-4 uppercase text-gray-700">AI-Filtered Audience Reviews</h3>
          <div className="space-y-6">
            {movie.reviews.map((review, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-1 bg-gray-100 border border-gray-200 uppercase">
                    {review.tag}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">{review.time}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex gap-6 text-xs font-semibold text-gray-500">
                  <p>SCORE: <span className="text-black">{review.score}</span></p>
                  <p>SENTIMENT: <span className={`uppercase ${review.sentiment === 'POSITIVE' ? 'text-green-600' : review.sentiment === 'NEGATIVE' ? 'text-red-600' : 'text-gray-800'}`}>{review.sentiment}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}