import React from "react";
import Transition from "../components/PageTransition.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";

export default function STT(){
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/');
    }

    return (
        <Transition>
            <Header />
            <div className="flex flex-col items-center min-h-screen bg-slate-900 px-4 pb-8">

                {/* Main Content Area - Single Container with tight gaps */}
                <main className="flex flex-col items-center justify-center gap-4 w-full max-w-4xl my-auto">
                    
                    <div className="w-full h-12 flex items-center justify-center border-slate-700 border rounded-xl px-6 bg-slate-800/50 shadow-md gap-3">
                        <button className="flex flex-row items-center justify-center text-slate-300 hover:text-cyan-400 transition-all duration-200 gap-4">
                            <h1 className="text-slate-200 text-sm sm:text-lg md:text-xl font-semibold tracking-wider hover:text-cyan-400 transition-all duration-200 ">
                                30s  
                            </h1>
                        </button>
                            <span className="text-slate-300">|</span>
                        <button>
                            <h1 className="text-slate-200 text-sm sm:text-lg md:text-xl font-semibold tracking-wider hover:text-cyan-400 transition-all duration-200">
                                45s
                            </h1>
                        </button>
                            <span className="text-slate-300">|</span>
                        <button>
                            <h1 className="text-slate-200 text-sm sm:text-lg md:text-xl font-semibold tracking-wider hover:text-cyan-400 transition-all duration-200">
                                60s
                            </h1>
                        </button>
                    </div>

                    {/* Subtitle Instructions */}
                    <div className="text-center my-2">
                        <h1 className="font-bold text-slate-100 tracking-wider text-lg sm:text-xl md:text-2xl">
                            Start typing to record your speed and accuracy.
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-lg md:text-xlmt-1">
                            Solo practice mode — focus on accuracy over speed.
                        </p>
                    </div>

                    <div className="w-full h-36 flex items-center justify-center border-2 border-slate-700 bg-slate-800/40 rounded-2xl p-6 shadow-xl">
                        <p className="text-slate-300 text-sm sm:text-lg md:text-xl">
                                The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Practice makes progress, and consistency builds speed. Focus on accuracy first, and your typing rhythm will naturally improve over time.
                        </p>
                    </div>

                </main>
            </div>
        </Transition>
    );
}