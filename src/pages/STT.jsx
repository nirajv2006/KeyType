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
                    
                    <div className="w-full h-12 flex items-center justify-between border-slate-700 border rounded-xl px-6 bg-slate-800/50 shadow-md">

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
                        {/* Typing words will be rendered here dynamically */}
                    </div>

                </main>
            </div>
        </Transition>
    );
}