import React, {useState} from 'react';
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

function AI() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatResponse = (text) => {
        return text
            .replace(/\*\*(\d+)\.\*\*\n\n([^\n]+):/g, '<h3 class="text-xl font-bold mt-6 mb-2">$2</h3>')
            .replace(/\*\*([^*]+):\*\*/g, '<h4 class="text-lg font-semibold mt-4 mb-1">$1</h4>')
            .replace(/(\d+\.)\s+([^:\n]+):([^\n]*)/g, '<div class="mb-4"><strong class="block font-semibold text-gray-800">$1 $2:</strong>$3</div>')
            .replace(/(\n)(?=[^\d\n])/g, '<br />')
            .replace(/\n{2,}/g, '</div><div class="mb-4">')
            .replace(/(<br \/>)*$/, '</div>')
            .replace(/<div class="mb-4"><\/div>/g, '')
            .replace(/<\/h3>/g, '</h3><div class="mb-4">')
            .replace(/<\/h4>/g, '</h4><div class="mb-3">');
    };

    const handleSubmit = async () => {
        if (input.length > 100) {
            setError('Prompt exceeds 100 characters limit.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await axios.post(`${baseURL}api/AI/generate`, {prompt: input});

            if (result.data.message && typeof result.data.message === 'object') {
                setResponse(formatResponse(result.data.message.content));
            } else {
                setResponse(formatResponse(result.data.message));
            }

        } catch (error) {
            setResponse('Error: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 py-8">
            <div className="flex flex-col items-center space-y-6 mx-auto px-4 max-w-4xl">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-800">
                        <span className="text-red-600">AI</span> Workout Assistant
                    </h1>
                    <p className="text-lg text-gray-600">Get personalized exercise recommendations powered by AI</p>
                </div>

                <div className="w-full space-y-3 bg-white p-6 rounded-xl shadow-lg">
                    <input
                        type="text"
                        placeholder="Ask for workout recommendations (e.g. 'Best ab exercises for beginners')"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setError('');
                        }}
                        className="w-full px-6 py-4 border-2 border-red-100 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg placeholder-gray-400 transition-all"
                        maxLength={100}
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-gray-400 text-sm order-2 sm:order-1">
            {100 - input.length} characters remaining
          </span>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center
                      shadow-lg hover:shadow-red-200 order-1 sm:order-2"
                        >
                            {loading ? (<>
                                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>) : (<>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Generate Plan
                            </>)}
                        </button>
                    </div>
                </div>

                {response && !loading && (
                    <div className="w-full p-6 bg-white border-2 border-red-50 rounded-xl shadow-lg">
                        <div className="prose-lg max-w-none">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-red-100 rounded-lg mr-3">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Custom Workout Plan</h2>
                            </div>
                            <div className="space-y-5" dangerouslySetInnerHTML={{__html: response}}/>
                        </div>
                    </div>
                )}

                {loading && (<div className="py-8 flex flex-col items-center space-y-3 w-full text-center">
                        <div
                            className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Analyzing your request...</p>
                    </div>
                )}

                {error && (<div className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center">
                        <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"/>
                        </svg>
                        <span className="text-red-600 font-medium">{error}</span>
                    </div>
                )}

                {!response && !loading && (
                    <div className="w-full p-6 bg-white border-2 border-red-200 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                      clipRule="evenodd"/>
                            </svg>
                            Pro Tips for Best Results
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                            <li>Specify duration: "20-minute HIIT routine"</li>
                            <li>Mention equipment: "No equipment needed"</li>
                            <li>Include fitness level: "Beginner-friendly exercises"</li>
                            <li>Target areas: "Core and upper body focus"</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AI;