import { mockMovies } from '../data/mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useParams, Link } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';

export default function Analytics() {
  const { id } = useParams();
  const movie = mockMovies.find(m => m.id === id) || mockMovies[0];

  const chartColors = ['#000000', '#6b7280', '#d1d5db'];

  // Helper for custom rounded-square donut charts
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

  // Strictly filter and slice to TOP 3 RELEVANT REVIEWS ONLY
  const top3Reviews = [...(movie.reviews || [])]
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, 3);

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-[#5e5e5e]"></div>
          <p className="text-[11px] font-bold text-[#5e5e5e] tracking-wider uppercase">Content Studio / Draft Analytics</p>
        </div>

        <Link 
          to={`/campaigns?id=${movie.id}`} 
          className="flex items-center gap-2 bg-[#000000] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#5e5e5e] transition"
        >
          <Award size={14} /> Manage Sponsor Campaigns →
        </Link>
      </div>

      {/* Top Section: Media & High-Level Scores */}
      <div className="flex gap-10 mt-6">
        <div className="w-2/3 bg-[#f3f3f4] border border-[#c6c6c6]/20 h-80 flex flex-col items-center justify-center relative">
           <p className="text-2xl font-bold tracking-widest uppercase text-[#000000]">{movie.title}</p>
           <p className="text-xs text-[#5e5e5e] border border-[#c6c6c6] px-3 py-1 mt-2 bg-white uppercase font-bold">{movie.type}</p>
           <div className="absolute bottom-4 left-4 right-4 h-1 bg-[#e8e8e8]">
             <div className="w-1/3 h-full bg-black"></div>
           </div>
        </div>
        
        <div className="w-1/3 flex flex-col gap-6">
          <div className="border border-[#c6c6c6]/20 p-6 bg-white">
            <p className="text-[10px] font-bold text-[#777777] mb-1 uppercase">OVERALL AUDIENCE SCORE</p>
            <p className="text-4xl font-extrabold text-[#000000]">{movie.audienceScore} <span className="text-sm font-normal text-gray-400">/10</span></p>
          </div>
          <div className="border border-[#c6c6c6]/20 p-6 bg-white">
            <p className="text-[10px] font-bold text-[#777777] mb-1 uppercase">AI QUALITY SCORE</p>
            <p className="text-4xl font-extrabold text-[#000000]">{movie.aiScore * 10}<span className="text-xl">%</span></p>
          </div>
          <div className="border border-[#c6c6c6]/20 p-6 bg-white">
            <p className="text-[10px] font-bold text-[#777777] mb-1 uppercase">TOTAL REVIEWS</p>
            <p className="text-4xl font-extrabold text-[#000000]">{movie.totalReviews}</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Radar Chart */}
      <h3 className="text-xs font-bold mt-12 mb-6 uppercase tracking-wider text-[#000000]">Sentiment Profile</h3>
      <div className="bg-white border border-[#c6c6c6]/20 p-8 h-96 flex justify-center items-center mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={movie.parameters}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#5e5e5e', fontSize: 11, fontWeight: 700 }} />
            <Radar name="Score" dataKey="A" stroke="#000000" fill="#000000" fillOpacity={0.1} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section: Demographics & Top 3 AI Reviews */}
      <div className="flex gap-10">
        
        {/* Left: Demographics with Rounded-Square Donut Charts */}
        <div className="w-1/3 flex flex-col gap-10 select-none">
          
          {/* Age Demographics */}
          <div>
            <h3 className="text-xs font-bold text-[#000000] mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-black"></span> Reviewers by Age
            </h3>
            <div className="flex items-center gap-8">
              <div 
                className="w-28 h-28 rounded-[24px] relative flex items-center justify-center flex-shrink-0"
                style={{ background: getConicGradient(movie.demographics.age, chartColors) }}
              >
                <div className="w-[84px] h-[84px] bg-white rounded-[18px] flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-[#777777] uppercase tracking-widest">Age</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                {movie.demographics.age.map((a, i) => (
                  <div key={a.name} className="flex justify-between text-xs font-medium items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors[i % chartColors.length] }}></div>
                      <span className="text-[#5e5e5e] font-semibold">{a.name}</span>
                    </div>
                    <span className="font-bold text-[#000000]">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gender Demographics */}
          <div>
            <h3 className="text-xs font-bold text-[#000000] mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-black"></span> Reviewers by Gender
            </h3>
            <div className="flex items-center gap-8">
              <div 
                className="w-28 h-28 rounded-[24px] relative flex items-center justify-center flex-shrink-0"
                style={{ background: getConicGradient(movie.demographics.gender, chartColors) }}
              >
                <div className="w-[84px] h-[84px] bg-white rounded-[18px] flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-[#777777] uppercase tracking-widest">Gender</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                {movie.demographics.gender.map((g, i) => (
                  <div key={g.name} className="flex justify-between text-xs font-medium items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors[i % chartColors.length] }}></div>
                      <span className="text-[#5e5e5e] font-semibold">{g.name}</span>
                    </div>
                    <span className="font-bold text-[#000000]">{g.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right: TOP 3 RELEVANT REVIEWS ONLY */}
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-6 border-b border-[#e8e8e8] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#000000]">
              Top 3 Relevant Audience Reviews
            </h3>

            <Link 
              to={`/reviews?id=${movie.id}`} 
              className="text-xs font-bold text-[#5e5e5e] hover:text-black uppercase tracking-wider flex items-center gap-1"
            >
              View All Reviews ({movie.reviews?.length || 0}) <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-6">
            {top3Reviews.map((review) => (
              <div key={review.id} className="border-b border-[#e8e8e8] pb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-1 bg-[#f3f3f4] border border-[#c6c6c6]/20 uppercase">
                    {review.tag}
                  </span>
                  <span className="text-[10px] font-semibold text-[#777777] uppercase">{review.time}</span>
                </div>
                <p className="text-sm text-[#474747] leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex gap-6 text-xs font-bold text-[#5e5e5e]">
                  <span>RELEVANCE: <strong className="text-black">{review.relevanceScore}%</strong></span>
                  <span>SCORE: <strong className="text-black">{review.score}/10</strong></span>
                  <span>SENTIMENT: <strong className={review.sentiment === 'POSITIVE' ? 'text-green-700' : 'text-black'}>{review.sentiment}</strong></span>
                </div>
              </div>
            ))}

            {top3Reviews.length === 0 && (
              <p className="text-xs text-[#777777] italic py-6">No audience reviews submitted yet for this asset.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}