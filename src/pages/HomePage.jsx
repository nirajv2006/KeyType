import React from 'react';
import keyboardImg from '../assets/keyboard.png';
import pvc from '../assets/PVC.jpeg';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen overflow-hidden bg-slate-900 px-4">
        <h1>
            <span className="text-4xl font-bold text-slate-100 tracking-wider">Welcome to KeyType</span>
        </h1>
        
        <p className="text-lg text-slate-300 max-w-2xl text-center leading-relaxed">
            This is a typing test application that allows you to practice your typing skills in different modes. Choose a mode below to get started!
        </p>

        <div className="flex flex-row gap-8 items-center justify-center flex-wrap mt-2">
            {/* Solo Typing Button */}
            <button 
                className="w-72 h-72 flex flex-col items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="h-36 w-full flex items-center justify-center mb-4">
                      <img 
                      src={keyboardImg} 
                      className="max-h-full max-w-full object-contain filter drop-shadow-md" 
                      alt="Solo Typing Test"
                      />
                  </div>
                  <h1 className="text-xl font-semibold text-slate-100 tracking-wider group-hover:text-cyan-400">
                      SOLO TYPE TEST
                  </h1>
                </div>
            </button>

            {/* Player vs Computer Button */}
            <button 
                className="w-72 h-72 flex flex-col items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="h-36 w-full flex items-center justify-center mb-4">
                      <img 
                      src={pvc} 
                      className="max-h-full max-w-full object-contain filter drop-shadow-md" 
                      alt="Player VS Computer"
                      />
                  </div>
                  <h1 className="text-xl font-semibold text-slate-100 tracking-wider group-hover:text-cyan-400">
                      PLAYER VS COMPUTER
                  </h1>
                </div>
            </button>
        </div>
    </div>
  );
}