import React, { useState, useEffect, useMemo, useRef } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/+esm';
import ReactDOM from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/+esm';
import {
    Map,
    Wind,
    BookOpen,
    Send,
    Search,
    Leaf,
    Users,
    ChevronDown,
    ChevronUp,
    ChevronsRight,
    FileText,
    Globe,
    Tractor,
    Scaling,
  Tag
} from 'https://cdn.jsdelivr.net/npm/lucide-react@latest/+esm';
import L from 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/+esm';
import 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/+esm';

// Mock Data: In a real application, this would come from a database.
const initialQuestions = [
    {
        id: 1,
        question: "I'm struggling with severe soil compaction in my no-till corn/soybean rotation, especially after a wet spring. What are my best options for mitigation without deep tillage?",
        region: "Iowa",
        county: "Story",
        croppingSystem: "Corn/Soybean Rotation (No-Till)",
        soilType: "Webster clay loam",
        area: "50-500 acres",
        files: [],
        keywords: ["compaction", "no-till", "soil structure", "cover crops"],
        status: "Answered",
        submittedAt: new Date('2024-05-15T10:00:00Z'),
        answer: {
            answeredBy: "Dr. Alana Reed, Soil Scientist",
            answeredAt: new Date('2024-06-05T14:30:00Z'),
            text: "This is a common challenge in heavy soils under no-till. The primary long-term solution is to build soil structure biologically. Consider planting a cover crop mix with deep-rooting species like daikon radish or cereal rye. The radish taproots create macropores, effectively acting as 'biodrills' to break up compaction pans. Cereal rye's fibrous root system improves aggregation in the topsoil. In the short term, if compaction is severe, a one-time, shallow vertical tillage pass may be necessary to fracture the pan, followed immediately by planting cover crops to stabilize the newly opened channels. Also, ensure you are managing field traffic by using designated tramlines to prevent re-compaction."
        },
        coords: { lat: 42.03, lon: -93.62 }
    },
    {
        id: 2,
        question: "My organic vegetable farm is seeing declining yields and an increase in root-knot nematodes. My soil organic matter is stagnant around 2.5%. How can I boost SOM and suppress nematodes?",
        region: "California",
        county: "Monterey",
        croppingSystem: "Organic Vegetable Production",
        soilType: "Salinas clay",
        area: "10-50 acres",
        files: [],
        keywords: ["organic matter", "nematodes", "soil health", "compost"],
        status: "Answered",
        submittedAt: new Date('2024-05-20T11:20:00Z'),
        answer: {
            answeredBy: "Dr. Marcus Thorne, Agronomist",
            answeredAt: new Date('2024-06-10T09:00:00Z'),
            text: "Boosting Soil Organic Matter (SOM) is key to both fertility and nematode suppression. A multi-pronged approach is best. First, incorporate high-quality compost at a rate of 5-10 tons per acre annually. Second, introduce a suppressive cover crop into your rotation. Crops in the Brassica family, like mustard, release compounds that are nematicidal when incorporated into the soil. Marigolds are also excellent at suppressing root-knot nematodes. Combining compost applications with suppressive cover crops will build your SOM, improve water retention, and create a healthier soil ecosystem that is less favorable to parasitic nematodes."
        },
        coords: { lat: 36.67, lon: -121.65 }
    },
    {
        id: 3,
        question: "How can I improve water infiltration on my sloped grazing pastures in Texas? During heavy rains, I get a lot of runoff and erosion.",
        region: "Texas",
        county: "Gillespie",
        croppingSystem: "Continuous Grazing",
        soilType: "Sandy Loam",
        area: "500+ acres",
        files: [],
        keywords: ["water infiltration", "erosion", "grazing", "pasture"],
        status: "Pending",
        submittedAt: new Date(),
        answer: null,
        coords: { lat: 30.27, lon: -98.87 }
    },
];

// Helper to get coordinates for a US State (approximations)
const stateCoordinates = {
    "Alabama": { lat: 32.8, lon: -86.6 }, "Alaska": { lat: 61.4, lon: -152.3 }, "Arizona": { lat: 34.2, lon: -111.7 },
    "Arkansas": { lat: 34.9, lon: -92.4 }, "California": { lat: 36.8, lon: -119.4 }, "Colorado": { lat: 39.1, lon: -105.3 },
    "Connecticut": { lat: 41.6, lon: -72.7 }, "Delaware": { lat: 38.9, lon: -75.5 }, "Florida": { lat: 27.8, lon: -81.6 },
    "Georgia": { lat: 32.8, lon: -83.6 }, "Hawaii": { lat: 21.3, lon: -157.8 }, "Idaho": { lat: 44.2, lon: -114.5 },
    "Illinois": { lat: 40.3, lon: -89.0 }, "Indiana": { lat: 39.8, lon: -86.2 }, "Iowa": { lat: 42.0, lon: -93.2 },
    "Kansas": { lat: 38.5, lon: -98.4 }, "Kentucky": { lat: 37.6, lon: -84.6 }, "Louisiana": { lat: 31.2, lon: -92.4 },
    "Maine": { lat: 45.2, lon: -69.4 }, "Maryland": { lat: 39.1, lon: -76.8 }, "Massachusetts": { lat: 42.4, lon: -71.4 },
    "Michigan": { lat: 43.6, lon: -84.5 }, "Minnesota": { lat: 46.7, lon: -94.7 }, "Mississippi": { lat: 32.7, lon: -89.7 },
    "Missouri": { lat: 38.6, lon: -92.6 }, "Montana": { lat: 46.9, lon: -110.3 }, "Nebraska": { lat: 41.5, lon: -99.8 },
    "Nevada": { lat: 38.8, lon: -116.4 }, "New Hampshire": { lat: 43.4, lon: -71.6 }, "New Jersey": { lat: 40.1, lon: -74.4 },
    "New Mexico": { lat: 34.5, lon: -106.0 }, "New York": { lat: 42.9, lon: -74.9 }, "North Carolina": { lat: 35.8, lon: -79.8 },
    "North Dakota": { lat: 47.5, lon: -99.8 }, "Ohio": { lat: 40.4, lon: -82.9 }, "Oklahoma": { lat: 35.5, lon: -98.5 },
    "Oregon": { lat: 43.8, lon: -120.6 }, "Pennsylvania": { lat: 41.2, lon: -77.2 }, "Rhode Island": { lat: 41.6, lon: -71.5 },
    "South Carolina": { lat: 33.8, lon: -81.2 }, "South Dakota": { lat: 44.3, lon: -99.9 }, "Tennessee": { lat: 35.9, lon: -86.6 },
    "Texas": { lat: 31.9, lon: -99.9 }, "Utah": { lat: 39.3, lon: -111.9 }, "Vermont": { lat: 44.2, lon: -72.6 },
    "Virginia": { lat: 37.5, lon: -79.0 }, "Washington": { lat: 47.7, lon: -120.7 }, "West Virginia": { lat: 38.6, lon: -80.6 },
    "Wisconsin": { lat: 44.5, lon: -89.5 }, "Wyoming": { lat: 43.1, lon: -107.6 }
};
const usStates = Object.keys(stateCoordinates);

// Endpoint for Google Apps Script that stores submissions in Google Sheets
// Replace the placeholder URL with your actual deployment URL
const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Submit form data to Google Sheets
async function submitToGoogleSheets(formData) {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            payload.append(key, value.join(','));
        } else {
            payload.append(key, value);
        }
    });
    const response = await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        body: payload
    });
    if (!response.ok) {
        throw new Error('Failed to submit form');
    }
}

// Main App Component
export default function App() {
    const [page, setPage] = useState('home');
    const [questions, setQuestions] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('userQuestions') || '[]');
        return [...stored, ...initialQuestions];
    });
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

    const handleAddQuestion = async (newQuestionData) => {
        const newQuestion = {
            id: Date.now(),
            ...newQuestionData,
            status: "Pending",
            submittedAt: new Date(),
            answer: null,
            coords: stateCoordinates[newQuestionData.region] || { lat: 39.82, lon: -98.57 } // Default to US center
        };
        try {
            await submitToGoogleSheets(newQuestionData);
            const stored = JSON.parse(localStorage.getItem('userQuestions') || '[]');
            localStorage.setItem('userQuestions', JSON.stringify([newQuestion, ...stored]));
        } catch (err) {
            console.error('Error submitting question:', err);
        }
        setQuestions(prev => [newQuestion, ...prev]);
        setPage('submissionSuccess');
    };

    const navigate = (pageName, questionId = null) => {
        setPage(pageName);
        setSelectedQuestionId(questionId);
        window.scrollTo(0, 0);
    };

    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Header navigate={navigate} />
            <main className="p-4 sm:p-6 md:p-8">
                {page === 'home' && <HomePage navigate={navigate} />}
                {page === 'submit' && <SubmitQuestionPage onFormSubmit={handleAddQuestion} />}
                {page === 'submissionSuccess' && <SubmissionSuccessPage navigate={navigate} />}
                {page === 'hub' && <AnswerHubPage questions={questions} navigate={navigate} />}
                {page === 'questionDetail' && <QuestionDetailPage question={selectedQuestion} navigate={navigate} />}
                {page === 'map' && <ChallengeMapPage questions={questions} navigate={navigate} />}
                {page === 'about' && <AboutPage />}
                {page === 'resources' && <ResourceLibraryPage />}
            </main>
            <Footer />
        </div>
    );
}

// Sub-components
const Header = ({ navigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { name: 'Answer Hub', page: 'hub', icon: BookOpen },
        { name: 'Challenge Map', page: 'map', icon: Map },
        { name: 'Resource Library', page: 'resources', icon: FileText },
        { name: 'Our Process', page: 'about', icon: Users },
    ];
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('home')}>
                        <div className="flex items-center">
                            <Leaf className="h-8 w-8 text-green-600" />
                            <h1 className="ml-2 text-2xl font-bold text-gray-800">Soil Health Exchange</h1>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map(item => (
                            <button key={item.name} onClick={() => navigate(item.page)} className="flex items-center text-gray-600 hover:text-green-700 transition duration-150 ease-in-out">
                                <item.icon className="h-5 w-5 mr-1" />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                    <div className="hidden md:block">
                        <button onClick={() => navigate('submit')} className="bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105 flex items-center">
                            <Send className="h-5 w-5 mr-2" />
                            Ask a Question
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-green-700">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navItems.map(item => (
                            <button key={item.name} onClick={() => {navigate(item.page); setIsOpen(false);}} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-700 hover:bg-gray-100">
                                <item.icon className="h-5 w-5 mr-2" />
                                {item.name}
                            </button>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="px-5">
                             <button onClick={() => {navigate('submit'); setIsOpen(false);}} className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center justify-center">
                                <Send className="h-5 w-5 mr-2" />
                                Ask a Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const HomePage = ({ navigate }) => (
    <div className="container mx-auto text-center py-12 sm:py-20">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border border-green-100">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
                Actionable Answers for Your Soil. <span className="text-green-600">Anonymously.</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                The Soil Health Exchange connects producers with experts to solve real-world soil challenges. Ask a question, browse solutions, and see what's happening in your region.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button onClick={() => navigate('submit')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 flex items-center justify-center text-lg">
                    <Send className="h-6 w-6 mr-3" />
                    Ask Your Question
                </button>
                <button onClick={() => navigate('hub')} className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-300 transition duration-300 transform hover:scale-105 flex items-center justify-center text-lg">
                    <BookOpen className="h-6 w-6 mr-3" />
                    Find Answers
                </button>
            </div>
        </div>

        <div className="mt-20 max-w-6xl mx-auto">
             <h3 className="text-3xl font-bold text-gray-800 mb-8">How It Works</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center mb-3">
                        <div className="bg-green-100 p-3 rounded-full"><span className="text-green-600 font-bold text-xl">1</span></div>
                        <h4 className="ml-4 text-xl font-semibold">You Ask Anonymously</h4>
                    </div>
                    <p className="text-gray-600">Submit your challenge with operational details. Your identity is always kept private.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center mb-3">
                        <div className="bg-green-100 p-3 rounded-full"><span className="text-green-600 font-bold text-xl">2</span></div>
                        <h4 className="ml-4 text-xl font-semibold">Experts Analyze</h4>
                    </div>
                     <p className="text-gray-600">Our team of soil scientists and agronomists reviews your data to craft a practical solution.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center mb-3">
                        <div className="bg-green-100 p-3 rounded-full"><span className="text-green-600 font-bold text-xl">3</span></div>
                        <h4 className="ml-4 text-xl font-semibold">Solutions are Shared</h4>
                    </div>
                    <p className="text-gray-600">We publish the answer for you and the entire community to learn from, usually within a month.</p>
                </div>
             </div>
        </div>
    </div>
);

const SubmitQuestionPage = ({ onFormSubmit }) => {
    const [formData, setFormData] = useState({
        question: '', region: '', county: '', croppingSystem: '', soilType: '', area: '', files: [], keywords: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if(errors[name]) {
            setErrors(prev => ({...prev, [name]: null}));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, files: [...e.target.files] }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.question.trim()) newErrors.question = "Question is required.";
        if (!formData.region) newErrors.region = "Region is required.";
        if (!formData.croppingSystem) newErrors.croppingSystem = "Cropping system is required.";
        if (!formData.soilType.trim()) newErrors.soilType = "Soil type or description is required.";
        if (!formData.area) newErrors.area = "Area is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onFormSubmit(formData);
        }
    };
    
    const croppingSystems = ["Corn/Soybean Rotation", "Continuous Corn", "Wheat/Fallow", "Continuous Grazing", "Dairy/Forage", "Orchard/Vineyard", "Organic Vegetable Production", "Diversified Mixed Farm", "Other"];
    const areas = ["< 10 acres", "10-50 acres", "50-500 acres", "500-2000 acres", "2000+ acres"];
    
    const FormRow = ({ label, children, error, required=false }) => (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
            {children}
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Submit Your Question</h2>
            <p className="text-gray-600 mb-6">Your submission is <span className="font-bold text-green-600">100% anonymous</span>. We do not collect or store any personal data.</p>
            <form onSubmit={handleSubmit} noValidate>
                 <FormRow label="Your Question or Challenge" required error={errors.question}>
                    <textarea name="question" value={formData.question} onChange={handleChange}
                        className={`w-full p-3 border ${errors.question ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                        rows="5" placeholder="Be as detailed as possible. e.g., 'I'm struggling with waterlogging in my lower fields...'"></textarea>
                 </FormRow>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormRow label="Region / State" required error={errors.region}>
                        <select name="region" value={formData.region} onChange={handleChange} className={`w-full p-3 border ${errors.region ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white`}>
                            <option value="">Select a State</option>
                            {usStates.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                    </FormRow>
                     <FormRow label="County (Optional)">
                        <input type="text" name="county" value={formData.county} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Story"/>
                    </FormRow>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                     <FormRow label="Primary Cropping System" required error={errors.croppingSystem}>
                         <select name="croppingSystem" value={formData.croppingSystem} onChange={handleChange} className={`w-full p-3 border ${errors.croppingSystem ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white`}>
                            <option value="">Select a system</option>
                            {croppingSystems.map(system => <option key={system} value={system}>{system}</option>)}
                        </select>
                     </FormRow>
                    <FormRow label="Area / Acreage" required error={errors.area}>
                         <select name="area" value={formData.area} onChange={handleChange} className={`w-full p-3 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white`}>
                            <option value="">Select an area</option>
                            {areas.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                     </FormRow>
                </div>

                 <FormRow label="Soil Type or Description" required error={errors.soilType}>
                    <input type="text" name="soilType" value={formData.soilType} onChange={handleChange} className={`w-full p-3 border ${errors.soilType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`} placeholder="e.g., 'Cecil sandy loam' or 'heavy clay'"/>
                </FormRow>

                 <FormRow label="Attach Files (Optional)">
                    <p className="text-gray-500 text-xs mb-2">Attach soil test results, photos of the issue, etc. (Max 10MB)</p>
                    <input type="file" name="files" onChange={handleFileChange} multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"/>
                 </FormRow>

                <FormRow label="Keywords (Optional)">
                    <p className="text-gray-500 text-xs mb-2">Comma-separated keywords to help others find your question. e.g., compaction, cover crops</p>
                    <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., erosion, salinity, low organic matter"/>
                </FormRow>

                <div className="mt-8 text-center">
                     <button type="submit" className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 flex items-center justify-center mx-auto">
                        <Send className="h-5 w-5 mr-2" />
                        Submit My Question Anonymously
                    </button>
                </div>
            </form>
        </div>
    );
};

const SubmissionSuccessPage = ({ navigate }) => (
    <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white p-10 rounded-xl shadow-lg">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                <Leaf className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Thank You!</h2>
            <p className="text-gray-600 mt-4">
                Your question has been submitted successfully. Our experts will review it, and an answer will be posted to the Answer Hub, typically within one month.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => navigate('hub')} className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition">
                    Go to Answer Hub
                </button>
                 <button onClick={() => navigate('home')} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                    Back to Home
                </button>
            </div>
        </div>
    </div>
);

const AnswerHubPage = ({ questions, navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ region: 'all', croppingSystem: 'all' });
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };
    
    const answeredQuestions = questions.filter(q => q.status === "Answered");

    const filteredQuestions = useMemo(() => {
        return answeredQuestions.filter(q => {
            const matchesSearch = searchTerm === '' ||
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (q.answer && q.answer.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (q.keywords && Array.isArray(q.keywords) && q.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));

            const matchesRegion = filters.region === 'all' || q.region === filters.region;
            const matchesSystem = filters.croppingSystem === 'all' || q.croppingSystem === filters.croppingSystem;

            return matchesSearch && matchesRegion && matchesSystem;
        });
    }, [searchTerm, filters, answeredQuestions]);

    const allRegions = useMemo(() => [...new Set(answeredQuestions.map(q => q.region))].sort(), [answeredQuestions]);
    const allSystems = useMemo(() => [...new Set(answeredQuestions.map(q => q.croppingSystem))].sort(), [answeredQuestions]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-800">Answer Hub</h2>
                <p className="mt-4 text-lg text-gray-600">Search and browse expert answers to community questions.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8 sticky top-20 z-40">
                <div className="grid md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Questions & Answers</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g., 'compaction', 'nematodes', 'water infiltration'..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Region</label>
                        <select
                            value={filters.region}
                            onChange={e => setFilters({...filters, region: e.target.value})}
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Regions</option>
                            {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Cropping System</label>
                        <select
                             value={filters.croppingSystem}
                             onChange={e => setFilters({...filters, croppingSystem: e.target.value})}
                             className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Systems</option>
                            {allSystems.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div className="text-right">
                        <p className="text-gray-600 font-medium">{filteredQuestions.length} result(s) found</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
                    <QuestionCard key={q.id} question={q} navigate={navigate} />
                )) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700">No matching questions found.</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuestionCard = ({ question, navigate }) => {
  const { id, question: qText, region, croppingSystem, keywords, answer } = question;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="p-6">
            <p className="text-lg font-semibold text-gray-800 mb-3 leading-snug">"{qText}"</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {keywords.map(kw => (
                    <span key={kw} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>
                ))}
            </div>

            <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-2 border-t pt-4">
                <div className="flex items-center"><Globe className="w-4 h-4 mr-1.5 text-gray-400" /> {region}</div>
                <div className="flex items-center"><Tractor className="w-4 h-4 mr-1.5 text-gray-400" /> {croppingSystem}</div>
            </div>

            <div className="mt-4 text-right">
                <button
                    onClick={() => navigate('questionDetail', id)}
                    className="inline-flex items-center font-semibold text-green-600 hover:text-green-800 transition-colors"
                >
                    View Full Answer
                    <ChevronsRight className="w-5 h-5 ml-1" />
                </button>
            </div>
        </div>
    </div>
  );
};

const QuestionDetailPage = ({ question, navigate }) => {
    if (!question) {
        return <div className="text-center py-16">Loading question...</div>;
    }
    
    const { question: qText, region, county, croppingSystem, soilType, area, keywords, files, answer, submittedAt } = question;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('hub')} className="mb-6 inline-flex items-center text-green-600 hover:text-green-800 font-semibold">
                &larr; Back to Answer Hub
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-8">
                    {/* Question Section */}
                    <div className="border-b pb-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-500 mb-4">The Challenge:</h2>
                        <blockquote className="text-xl font-semibold text-gray-800 leading-relaxed italic border-l-4 border-green-500 pl-4">
                            "{qText}"
                        </blockquote>
                         <div className="mt-6 flex flex-wrap gap-2">
                            {keywords.map(kw => (
                                <span key={kw} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Details Section */}
                    <div className="border-b pb-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-500 mb-4">Operational Details</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                            <DetailItem icon={Globe} label="Region" value={`${region}${county ? `, ${county}` : ''}`} />
                            <DetailItem icon={Tractor} label="Cropping System" value={croppingSystem} />
                            <DetailItem icon={Wind} label="Soil Type" value={soilType} />
                            <DetailItem icon={Scaling} label="Area" value={area} />
                            <DetailItem icon={FileText} label="Submitted" value={new Date(submittedAt).toLocaleDateString()} />
                        </div>
                    </div>

                    {/* Answer Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Expert Answer:</h2>
                        {answer ? (
                            <div>
                                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                    <p>{answer.text}</p>
                                </div>
                                <p className="mt-6 text-sm text-gray-500 italic">
                                    Answered by {answer.answeredBy} on {new Date(answer.answeredAt).toLocaleDateString()}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-gray-700">This question is currently under review by our experts.</p>
                                <p className="text-gray-500 mt-1">An answer will be posted soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon: Icon, label, value }) => (
    <div>
        <div className="flex items-center text-gray-500 mb-1">
            <Icon className="w-4 h-4 mr-2" />
            <span className="font-semibold">{label}</span>
        </div>
        <p className="text-gray-800 font-medium">{value}</p>
    </div>
);


const ChallengeMapPage = ({ questions, navigate }) => {
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const [showHeatmap, setShowHeatmap] = useState(false);

    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map('challenge-map').setView([39.82, -98.57], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            mapRef.current = map;
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;
        if (layerRef.current) {
            layerRef.current.remove();
        }
        if (showHeatmap) {
            const points = questions.filter(q => q.coords).map(q => [q.coords.lat, q.coords.lon, 1]);
            layerRef.current = L.heatLayer(points, { radius: 25 });
        } else {
            const group = L.layerGroup();
            questions.forEach(q => {
                if (!q.coords) return;
                const marker = L.circleMarker([q.coords.lat, q.coords.lon], {
                    radius: 6,
                    fillColor: q.status === 'Answered' ? '#16a34a' : '#eab308',
                    color: '#ffffff',
                    weight: 1,
                    fillOpacity: 1
                }).on('click', () => navigate('questionDetail', q.id));
                group.addLayer(marker);
            });
            layerRef.current = group;
        }
        layerRef.current.addTo(mapRef.current);
    }, [showHeatmap, questions]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-800">Regional Challenge Map</h2>
                <p className="mt-4 text-lg text-gray-600">Visualize where challenges are emerging across the country.</p>
            </div>
            <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <div id="challenge-map" className="w-full h-96 rounded-lg"></div>
                <div className="mt-4 flex justify-center">
                    <button
                        className={`px-4 py-2 border rounded-l ${!showHeatmap ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setShowHeatmap(false)}
                    >
                        Points
                    </button>
                    <button
                        className={`px-4 py-2 border rounded-r ${showHeatmap ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setShowHeatmap(true)}
                    >
                        Heatmap
                    </button>
                </div>
                <div className="flex justify-center items-center gap-6 mt-6">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                        <span className="text-sm text-gray-600">Answered</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Pending Review</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AboutPage = () => (
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6">Our Mission & Process</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
            <p>
                The Soil Health Exchange was founded on a simple principle: every producer deserves access to unbiased, science-based information to solve their unique soil health challenges. We aim to bridge the gap between academic research and on-the-ground application, creating a community of shared knowledge that benefits everyone.
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mt-8">Our Process</h3>
            <ol>
                <li>
                    <strong>Anonymous Submission:</strong> You submit your question through our secure form. We guarantee your anonymity. The only data we use is related to your operation (region, soil type, etc.) to provide a relevant answer and for regional analysis.
                </li>
                <li>
                    <strong>Expert Triage:</strong> Your question is received and directed to the most appropriate expert on our team, which includes certified agronomists, soil scientists, and conservation specialists.
                </li>
                <li>
                    <strong>In-Depth Research:</strong> Our team analyzes the information you provided, consulting the latest research, regional data, and practical case studies to formulate a comprehensive and actionable response.
                </li>
                 <li>
                    <strong>Publication:</strong> Within approximately one month, the full question and expert answer are published to the Answer Hub and added to the Challenge Map. This allows the entire community to learn from your question.
                </li>
            </ol>
            <h3 className="text-2xl font-bold text-gray-800 mt-8">Meet Our Team (Example)</h3>
            <p>
                Our team consists of professionals dedicated to sustainable agriculture. While we operate with a degree of privacy to encourage open dialogue, our expertise is rooted in decades of collective experience.
            </p>
            <ul>
                <li><strong>Lead Soil Scientist:</strong> PhD in Soil Science, 15+ years of experience in nutrient management and soil microbiology.</li>
                <li><strong>Senior Agronomist:</strong> Certified Crop Adviser (CCA) with 20 years of field experience in diverse cropping systems.</li>
                 <li><strong>Conservation Specialist:</strong> Expertise in cover cropping, no-till systems, and water management.</li>
            </ul>
        </div>
    </div>
);

const ResourceLibraryPage = () => (
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6">Resource Library</h2>
        <p className="text-gray-700 mb-4">Helpful links to external programs and guides for building soil health.</p>
        <ul className="list-disc list-inside space-y-2 text-green-700">
            <li><a className="hover:underline" href="https://www.nrcs.usda.gov/resources/guides-and-instructions" target="_blank">USDA-NRCS Conservation Guides</a></li>
            <li><a className="hover:underline" href="https://www.sare.org/resources/cover-crops/" target="_blank">SARE Cover Crop Resources</a></li>
            <li><a className="hover:underline" href="https://extension.psu.edu/soil-health" target="_blank">Penn State Extension Soil Health</a></li>
            <li><a className="hover:underline" href="https://extension.umn.edu/crop-production/soil-management-and-health" target="_blank">University of Minnesota Extension Soil Management</a></li>
        </ul>
    </div>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {new Date().getFullYear()} Soil Health Exchange. A community-driven knowledge hub.</p>
            <p className="text-sm text-gray-400 mt-2">All questions are submitted anonymously and answered by a panel of volunteer experts.</p>
        </div>
    </footer>
);

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}

