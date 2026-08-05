import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Image, Wand2, Trash2, Plus } from 'lucide-react';

export default function Upload() {
    const navigate = useNavigate();
    const [params, setParams] = useState([
        "High contrast visuals",
        "Structural integrity check",
        "Monochrome balance",
        "Wireframe density",
        "Asymmetric grid alignment"
    ]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Handlers for Parameter Array
    const handleUpdateParam = (index, newValue) => {
        const newParams = [...params];
        newParams[index] = newValue;
        setParams(newParams);
    };

    const handleRemoveParam = (index) => {
        setParams(params.filter((_, i) => i !== index));
    };

    const handleAddParam = () => {
        setParams([...params, "New Parameter"]);
    };

    const handleGenerateAI = () => {
        setIsGenerating(true);
        // Simulate AI loading delay
        setTimeout(() => {
            setParams([
                ...params,
                "Pacing and deceleration",
                "Audio spatial depth",
                "Color grading consistency"
            ]);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="p-10 max-w-4xl mx-auto pb-20">
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-1 uppercase">Content Studio / Draft</p>
            <h1 className="text-3xl font-bold mb-10">New Content Submission</h1>

            {/* Step 1: Upload */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-6 bg-black text-white text-xs flex items-center justify-center font-bold">01</div>
                    <h2 className="text-lg font-bold">Upload Media Assets</h2>
                </div>
                <div className="flex gap-6 mb-6 pl-10">
                    <div className="w-1/3">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Media Type</label>
                        <select className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer">
                            <option>Trailer</option>
                            <option>Poster</option>
                            <option>Song</option>
                        </select>
                    </div>
                    <div className="w-2/3">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Title</label>
                        <input type="text" placeholder="Enter content title..." className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black" />
                    </div>
                </div>
                <div className="ml-10 border-2 border-dashed border-gray-300 bg-gray-50 h-48 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition">
                    <Image size={32} className="mb-3" />
                    <p className="text-sm font-semibold text-gray-600">Upload Media or Paste URL</p>
                    <p className="text-xs">DRAG AND DROP SUPPORTED</p>
                </div>
            </div>

            {/* Step 2: AI Parameters */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-6 bg-black text-white text-xs flex items-center justify-center font-bold">02</div>
                    <h2 className="text-lg font-bold">Automated Parameters</h2>
                </div>
                <div className="ml-10 bg-gray-50 border border-gray-200 p-8 flex flex-col items-center text-center transition">
                    <p className="text-sm text-gray-600 mb-6">Utilize AI to scan your content and generate compliant rating parameters.</p>
                    <button
                        onClick={handleGenerateAI}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase transition ${isGenerating ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>
                        <Wand2 size={16} className={isGenerating ? "animate-pulse" : ""} />
                        {isGenerating ? "Analyzing Media..." : "Generate AI Rating Parameters"}
                    </button>
                </div>
            </div>

            {/* Step 3: Parameter Approval */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-6 bg-black text-white text-xs flex items-center justify-center font-bold">03</div>
                    <h2 className="text-lg font-bold">Parameter Approval</h2>
                </div>
                <div className="ml-10 space-y-3 mb-6">
                    {params.map((param, i) => (
                        <div key={i} className="flex justify-between items-center border border-gray-200 bg-white p-4 focus-within:border-black transition-colors">
                            <div className="flex items-center gap-4 text-sm font-medium w-full mr-4">
                                <span className="text-xs text-gray-400 font-bold uppercase w-20 flex-shrink-0">Parameter {i + 1}</span>
                                <input
                                    type="text"
                                    value={param}
                                    onChange={(e) => handleUpdateParam(i, e.target.value)}
                                    className="w-full bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300 pb-1"
                                />
                            </div>
                            <div className="flex gap-3 text-gray-400 flex-shrink-0">
                                <Trash2 size={16} onClick={() => handleRemoveParam(i)} className="cursor-pointer hover:text-red-500 transition" />
                            </div>
                        </div>
                    ))}
                    {params.length === 0 && <p className="text-sm text-gray-400 italic">No parameters added yet.</p>}
                </div>
                <button onClick={handleAddParam} className="ml-10 flex items-center gap-2 border border-gray-300 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-50 transition">
                    <Plus size={14} /> Parameter
                </button>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                    onClick={() => {
                        // Redirect to dashboard and pass the toast message as state
                        navigate('/dashboard', {
                            state: {
                                showToast: true,
                                message: "Content uploaded successfully!"
                            }
                        });
                    }}
                    className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition active:scale-95"
                >
                    Publish ►
                </button>
            </div>
        </div>
    );
}