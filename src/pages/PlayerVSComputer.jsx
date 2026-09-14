import React from 'react';
import Transition from '../components/PageTransition.jsx';
import Header from '../components/Header.jsx';
import { useNavigate } from 'react-router-dom';

export default function PlayerVSComputer() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/'); 
    }
    return (
        <Transition>
            <Header />
            <div className="flex flex-col gap-5  min-h-screen bg-slate-900 ">
                <div className=" h-32 gap-2 justify-start px-4">
                    <button
                    onClick={handleGoBack} 
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-cyan-500 rounded border border-5 border-slate-200 hover:border-cyan-500 rounded-xl p-2 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group"
                    >
                        <h1> Go back</h1>
                    </button>
                </div>
                { /* This is text */}
                <div className="flex flex-col gap-5 items-center justify-center py-4">
                    <h1 className="font-bold text-slate-100 tracking-wider text-2xl sm:text-3xl md:text-4xl">
                        Player VS Computer Mode
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl text-center leading-relaxed">
                        In this mode, you will compete against the computer in a typing challenge. The computer will type at a fixed speed, and your goal is to type faster and more accurately than the computer. Good luck!
                    </p>
                    <p className="text-extrabold text-slate-100 max-w-2xl text-center text-2xl sm:text-3xl md:text-4xl leading-relaxed">
                        This Feature is not yet implemented. Please check back later for updates!
                    </p>
                </div>
            </div>
        </Transition>
    )
}