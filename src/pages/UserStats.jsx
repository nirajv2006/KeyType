import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Transition from '../components/PageTransition';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function UserStats() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // "all", 30, 45, 60

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/LoginPage");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/tests`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("username");
                        navigate("/LoginPage");
                        return;
                    }
                    throw new Error("Failed to fetch stats from server");
                }

                const data = await response.json();
                setTests(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

    // Helper to calculate stats for a subset of tests
    const calculateStats = (testList) => {
        const count = testList.length;
        if (count === 0) {
            return { count: 0, avgWpm: 0, avgAccuracy: 0, highestWpm: 0 };
        }
        const avgWpm = (testList.reduce((acc, curr) => acc + curr.wpm, 0) / count).toFixed(1);
        const avgAccuracy = (testList.reduce((acc, curr) => acc + curr.accuracy, 0) / count).toFixed(1);
        const highestWpm = Math.max(...testList.map(t => t.wpm));
        return { count, avgWpm, avgAccuracy, highestWpm };
    };

    const stats30 = calculateStats(tests.filter(t => t.duration === 30));
    const stats45 = calculateStats(tests.filter(t => t.duration === 45));
    const stats60 = calculateStats(tests.filter(t => t.duration === 60));
    const statsAll = calculateStats(tests);

    const filteredTests = activeFilter === "all"
        ? tests
        : tests.filter(t => t.duration === Number(activeFilter));

    return (
        <Transition>
            <Header />
            <div className="min-h-[calc(100vh-65px)] bg-slate-900 text-white p-4 sm:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Title & Total Tests Banner */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                Performance Statistics
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Detailed breakdown across all 3 timing modes: 30s, 45s, and 60s
                            </p>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl text-sm text-slate-300">
                            Total Tests Taken: <span className="font-bold text-cyan-400">{statsAll.count}</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center text-cyan-500 text-xl py-16 animate-pulse">Loading your stats...</div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
                            {error}
                        </div>
                    ) : tests.length === 0 ? (
                        <div className="bg-slate-800/50 border border-slate-700 p-12 rounded-2xl text-center text-slate-400">
                            <p className="text-xl mb-4">You haven't completed any typing tests yet!</p>
                            <button
                                onClick={() => navigate("/STT")}
                                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/20"
                            >
                                Start a Test
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* 3 Duration Cards Grid */}
                            <div>
                                <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                    <span>⏱️</span> Timing Mode Breakdown
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <TimingCard
                                        duration="30s"
                                        label="Sprint Mode"
                                        stats={stats30}
                                        accent="cyan"
                                        onStart={() => navigate("/STT")}
                                    />
                                    <TimingCard
                                        duration="45s"
                                        label="Standard Mode"
                                        stats={stats45}
                                        accent="blue"
                                        onStart={() => navigate("/STT")}
                                    />
                                    <TimingCard
                                        duration="60s"
                                        label="Endurance Mode"
                                        stats={stats60}
                                        accent="indigo"
                                        onStart={() => navigate("/STT")}
                                    />
                                </div>
                            </div>

                            {/* Overall Summary Row */}
                            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                    Overall Combined Stats
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">All-time High WPM</div>
                                        <div className="text-2xl font-bold text-cyan-400 mt-1">{statsAll.highestWpm}</div>
                                    </div>
                                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">Overall Avg WPM</div>
                                        <div className="text-2xl font-bold text-slate-200 mt-1">{statsAll.avgWpm}</div>
                                    </div>
                                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">Overall Avg Accuracy</div>
                                        <div className="text-2xl font-bold text-slate-200 mt-1">{statsAll.avgAccuracy}%</div>
                                    </div>
                                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">Total Completed</div>
                                        <div className="text-2xl font-bold text-slate-200 mt-1">{statsAll.count}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Test History with Duration Filters */}
                            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl shadow-cyan-950/20">
                                <div className="px-6 py-4 border-b border-slate-700/60 bg-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <h2 className="text-lg font-semibold text-slate-200">Test History</h2>

                                    {/* Duration Filter Tabs */}
                                    <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80">
                                        {[
                                            { id: "all", label: "All" },
                                            { id: 30, label: "30s" },
                                            { id: 45, label: "45s" },
                                            { id: 60, label: "60s" }
                                        ].map((filter) => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setActiveFilter(filter.id)}
                                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                                    activeFilter === filter.id
                                                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                                }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    {filteredTests.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400 text-sm">
                                            No test records found for {activeFilter === "all" ? "this profile" : `${activeFilter}s mode`}.
                                        </div>
                                    ) : (
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase border-b border-slate-700/60">
                                                <tr>
                                                    <th className="px-6 py-3.5 font-medium">Date & Time</th>
                                                    <th className="px-6 py-3.5 font-medium">Duration</th>
                                                    <th className="px-6 py-3.5 font-medium">Speed</th>
                                                    <th className="px-6 py-3.5 font-medium">Accuracy</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                                {filteredTests.map((test) => (
                                                    <tr key={test.id} className="hover:bg-slate-700/30 transition-colors">
                                                        <td className="px-6 py-4 text-slate-300">
                                                            {new Date(test.created_at).toLocaleString(undefined, {
                                                                month: 'short', day: 'numeric', year: 'numeric',
                                                                hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                                                                test.duration === 30
                                                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                                                                    : test.duration === 45
                                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                                                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                                                            }`}>
                                                                {test.duration}s
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-cyan-400">
                                                            {test.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-slate-200">
                                                            {test.accuracy}%
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Transition>
    );
}

function TimingCard({ duration, label, stats, accent, onStart }) {
    const accentColors = {
        cyan: {
            border: "border-cyan-500/40 hover:border-cyan-400",
            badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
            wpm: "text-cyan-400"
        },
        blue: {
            border: "border-blue-500/40 hover:border-blue-400",
            badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
            wpm: "text-blue-400"
        },
        indigo: {
            border: "border-indigo-500/40 hover:border-indigo-400",
            badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
            wpm: "text-indigo-400"
        }
    }[accent];

    return (
        <div className={`bg-slate-800/60 border ${accentColors.border} rounded-2xl p-6 shadow-xl transition-all duration-200 flex flex-col justify-between`}>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border ${accentColors.badge}`}>
                            {duration}
                        </span>
                        <h3 className="text-slate-200 font-semibold text-base mt-1">{label}</h3>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
                        {stats.count} {stats.count === 1 ? "test" : "tests"}
                    </span>
                </div>

                {/* Stats Breakdown */}
                {stats.count === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-sm italic">
                        No tests completed yet for {duration}
                    </div>
                ) : (
                    <div className="space-y-3 my-4">
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-700/50">
                            <span className="text-xs text-slate-400">Best Speed</span>
                            <span className={`text-lg font-bold ${accentColors.wpm}`}>
                                {stats.highestWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-slate-700/50">
                            <span className="text-xs text-slate-400">Average Speed</span>
                            <span className="text-base font-semibold text-slate-200">
                                {stats.avgWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                            <span className="text-xs text-slate-400">Average Accuracy</span>
                            <span className="text-base font-semibold text-slate-200">
                                {stats.avgAccuracy}%
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}