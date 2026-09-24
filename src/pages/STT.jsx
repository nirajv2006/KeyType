import React, { useState, useRef, useEffect } from "react";
import Transition from "../components/PageTransition.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function STT() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  // State & Ref for handling typing input and timer
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [targetText, setTargetText] = useState("Loading words...");
  const [userInput, setUserInput] = useState("");
  const [finalStats, setFinalStats] = useState({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const userInputRef = useRef("");

  const fetchNewWords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/words?count=100`);
      const data = await response.json();
      setTargetText(data.text);
      setUserInput("");
    } catch (error) {
      console.error("Failed to connect : ", error);
      setTargetText("failed to load text from server");
    }
  };
  useEffect(() => { fetchNewWords(); }, []);

  // Keep userInputRef updated with current typing
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  // Reset test state
  const resetTest = (duration = selectedDuration, fetchNew = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
    userInputRef.current = "";
    setUserInput("");
    setIsStarted(false);
    setIsFinished(false);
    setSelectedDuration(duration);
    setTimeLeft(duration);
    setFinalStats({
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    });
    if (fetchNew) {
      fetchNewWords();
    }
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Change duration handler
  const handleDurationChange = (duration) => {
    resetTest(duration);
  };

  // Finish the test and calculate final metrics accurately
  const finishTest = (inputVal = userInputRef.current) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsFinished(true);

    // Calculate actual elapsed seconds from timestamp
    const now = Date.now();
    const elapsedSeconds = startTimeRef.current
      ? Math.max(1, Math.round((now - startTimeRef.current) / 1000))
      : 1;
    const elapsedMinutes = elapsedSeconds / 60;

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < inputVal.length; i++) {
      if (inputVal[i] === targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const totalChars = inputVal.length;
    // Standard WPM formula: (correct characters typed / 5) / elapsed minutes
    const calculatedWpm = Math.round((correctChars / 5) / elapsedMinutes);
    const calculatedAccuracy =
      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    const finalWpm = Math.max(0, calculatedWpm);
    const finalAccuracy = Math.max(0, calculatedAccuracy);

    setFinalStats({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      correctChars,
      incorrectChars,
      totalChars,
    });

    saveTestResults(finalWpm, finalWpm, finalAccuracy, elapsedSeconds);
  };

  // Timer countdown management
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            finishTest(userInputRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isStarted, isFinished]);

  // Handle typing input
  const handleInputChange = (e) => {
    if (isFinished) return;

    let val = e.target.value.toLowerCase();

    // If a space was just pressed, automatically jump to the start of the next word
    if (val.length > userInput.length && val.endsWith(" ")) {
      const currentPos = userInput.length;
      const nextSpaceIdx = targetText.indexOf(" ", currentPos);

      if (nextSpaceIdx !== -1) {
        // Pad with spaces or fill up through the space after current word
        // This advances the cursor index to the beginning of the next word
        val = val.slice(0, -1).padEnd(nextSpaceIdx + 1, " ");
      }
    }

    // Start timer on first keystroke
    if (!isStarted && val.length > 0) {
      startTimeRef.current = Date.now();
      setIsStarted(true);
    }

    setUserInput(val);

    // If player finishes typing the entire target text
    if (val.length >= targetText.length) {
      finishTest(val);
    }
  };

  // Force focus to the hidden input on click
  const handleContainerClick = () => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  };

  const saveTestResults = async (wpm, rwpm, accuracy, duration) => {
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/tests`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          wpm: wpm,
          rwpm: rwpm,
          accuracy: accuracy,
          duration: duration,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Test Saved with ID:", data.id);
      }
    } catch (error) {
      console.error("Failed to save test results:", error);
    }
  };

  return (
    <Transition>
      <div className="relative min-h-screen bg-slate-900 px-4 pb-8">
        <Header />

        <div className="max-w-4xl mx-auto flex items-center justify-between mb-4">
          <button
            onClick={handleGoBack}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-cyan-400 rounded-xl border border-slate-700 hover:border-cyan-500 px-4 py-2 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 font-medium"
          >
            ← Go Back
          </button>

          {/* Active Timer Display */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2">
            <span className="text-slate-400 text-sm font-medium">Time Remaining:</span>
            <span
              className={`text-lg font-mono font-bold ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-cyan-400"
                }`}
            >
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Main Content Area */}
          <main className="flex flex-col items-center justify-center gap-6 w-full max-w-4xl my-auto mt-4">

            {/* Status / Timer Selector Bar - disappears once typing starts */}
            {!isStarted && (
              <div className="w-full h-12 flex items-center justify-center border-slate-700 border rounded-xl px-6 bg-slate-800/50 shadow-md gap-4 transition-all duration-300">
                {[30, 45, 60].map((dur, index) => (
                  <React.Fragment key={dur}>
                    {index > 0 && <span className="text-slate-600">|</span>}
                    <button
                      onClick={() => handleDurationChange(dur)}
                      className={`cursor-pointer text-sm sm:text-base font-semibold tracking-wider transition-all duration-200 px-3 py-1 rounded-lg ${selectedDuration === dur
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                          : "text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50"
                        }`}
                    >
                      {dur}s
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Subtitle Instructions */}
            <div className="text-center my-1">
              <h1 className="font-bold text-slate-100 tracking-wider text-lg sm:text-xl md:text-2xl">
                Start typing to record your speed and accuracy.
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Solo practice mode — choose 30s, 45s, or 60s test. Type in the box below!
              </p>
            </div>

            {/* Typing Container */}
            <div
              onClick={handleContainerClick}
              className={`relative w-full min-h-[190px] flex items-start justify-start border-2 bg-slate-800/40 rounded-2xl p-6 shadow-xl cursor-text overflow-hidden transition-all duration-200 ${isFinished ? "opacity-40 pointer-events-none border-slate-700" : "border-slate-700 hover:border-slate-600"
                }`}
            >
              {/* Invisible Input capturing keypresses */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                disabled={isFinished}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
                autoFocus
              />

              {/* Target Text with Character-by-Character Highlighting */}
              <p className="text-lg sm:text-xl font-mono leading-relaxed select-none pointer-events-none z-0">
                {targetText.split("").map((char, index) => {
                  let colorClass = "text-slate-500"; // Default untyped letter

                  if (index < userInput.length) {
                    // Correct letter = Cyan accent, Mistake = Red highlight
                    colorClass =
                      userInput[index] === char
                        ? "text-cyan-400 bg-cyan-950/30 rounded-xs"
                        : "text-red-400 bg-red-950/60 underline rounded-xs";
                  } else if (index === userInput.length) {
                    // Current cursor position indicator
                    colorClass = "text-slate-200 border-l-2 border-cyan-400 animate-pulse";
                  }

                  return (
                    <span key={index} className={colorClass}>
                      {char}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Restart Button */}
            <button
              onClick={() => resetTest(selectedDuration)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
            >
              Restart Test
            </button>
          </main>
        </div>

        {/* Results Modal Popup */}
        {isFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center transform scale-100 transition-all">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mb-4 text-cyan-400 text-2xl font-bold">
                🏆
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1">
                Test Complete!
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Here is your solo typing test summary ({selectedDuration}s test)
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Speed
                  </span>
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                    {finalStats.wpm}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">Words Per Minute</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Accuracy
                  </span>
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                    {finalStats.accuracy}%
                  </span>
                  <span className="text-xs text-slate-500 mt-1">Correct Keystrokes</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 mb-6 flex justify-around text-xs text-slate-300">
                <div>
                  <span className="text-slate-500">Correct:</span>{" "}
                  <span className="text-emerald-400 font-semibold">{finalStats.correctChars}</span>
                </div>
                <div>
                  <span className="text-slate-500">Errors:</span>{" "}
                  <span className="text-red-400 font-semibold">{finalStats.incorrectChars}</span>
                </div>
                <div>
                  <span className="text-slate-500">Characters:</span>{" "}
                  <span className="text-slate-200 font-semibold">{finalStats.totalChars}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => resetTest(selectedDuration, true)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg cursor-pointer hover:scale-[1.02]"
                >
                  Next Test
                </button>
                <button
                  onClick={() => resetTest(selectedDuration, false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                >
                  Retry Same Words
                </button>
                <button
                  onClick={handleGoBack}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Transition>
  );
}