import React, { useState, useRef } from "react";
import Transition from "../components/PageTransition.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";

export default function STT() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  // State & Ref for handling typing input
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef(null);

  const targetText =
    "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Practice makes progress, and consistency builds speed. Focus on accuracy first, and your typing rhythm will naturally improve over time.";

  // Force focus to the hidden input on click
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Transition>
      <div className=" min-h-screen bg-slate-900 px-4 pb-8">
        <Header />

        <button
        onClick={() => handleGoBack()}
        className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-cyan-500 rounded border border-5 border-slate-200 hover:border-cyan-500 rounded-xl p-2 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          Go Back
        </button>
        <div className="flex flex-col items-center justify-center">
        {/* Main Content Area */}
        <main className="flex flex-col items-center justify-center gap-6 w-full max-w-4xl my-auto mt-8">
          
          {/* Status / Timer Selector Bar */}
          <div className="w-full h-12 flex items-center justify-center border-slate-700 border rounded-xl px-6 bg-slate-800/50 shadow-md gap-4">
            <button className="cursor-pointer text-slate-200 text-sm sm:text-base font-semibold tracking-wider hover:text-cyan-400 transition-all duration-200">
              30s
            </button>
            <span className="text-slate-500">|</span>
            <button className="cursor-pointer text-slate-200 text-sm sm:text-base font-semibold tracking-wider hover:text-cyan-400 transition-all duration-200">
              45s
            </button>
            <span className="text-slate-500">|</span>
            <button className="cursor-pointer text-slate-200 text-sm sm:text-base font-semibold tracking-wider hover:text-cyan-400 transition-all duration-200">
              60s
            </button>
          </div>

          {/* Subtitle Instructions */}
          <div className="text-center my-1">
            <h1 className="font-bold text-slate-100 tracking-wider text-lg sm:text-xl md:text-2xl">
              Start typing to record your speed and accuracy.
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Solo practice mode — focus on accuracy over speed.
            </p>
          </div>

          {/* Typing Container */}
          <div
            onClick={handleContainerClick}
            className="relative w-full min-h-[180px] flex items-start justify-start border-2 border-slate-700 bg-slate-800/40 rounded-2xl p-6 shadow-xl cursor-text overflow-hidden"
          >
            {/* Invisible Input capturing keypresses */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
              autoFocus
            />

            {/* Target Text with Character-by-Character Highlighting */}
            <p className="text-lg sm:text-xl font-mono leading-relaxed select-none pointer-events-none z-0">
              {targetText.split("").map((char, index) => {
                let colorClass = "text-slate-500"; // Default color for untyped letters

                if (index < userInput.length) {
                  // Correct letter = Cyan accent, Mistake = Red highlight
                  colorClass =
                    userInput[index] === char
                      ? "text-cyan-400 bg-cyan-950/30 rounded-xs"
                      : "text-red-400 bg-red-950/60 underline rounded-xs";
                }

                return (
                  <span key={index} className={colorClass}>
                    {char}
                  </span>
                );
              })}
            </p>
          </div>
        </main>
        </div>
      </div>
    </Transition>
  );
}