import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const goHomePage = () => {
        navigate('/');
    };

    const goLoginPage = () => {
        navigate('/LoginPage');
    };

    const userStats = () => {
        setDropdownOpen(false);
        navigate('/UserStats');
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("username");
        setToken(storedToken);
        setUsername(storedUser);
    }, [location]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setToken(null);
        setUsername(null);
        setDropdownOpen(false);
        navigate('/LoginPage');
    };

    return (
        <header className="sticky top-0 z-50">
            <div className="bg-slate-900 text-white py-3 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    {/* Placeholder div on the left */}
                    <div className="w-20 hidden sm:block"></div>

                    {/* Centered Title */}
                    <button
                        onClick={goHomePage}
                        className="text-slate-300 hover:text-cyan-500 hover:scale-110 transition-all duration-200 cursor-pointer group"
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">KeyType</h1>
                    </button>

                    {/* Right side: Login or User profile + Logout */}
                    {token ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-2 text-cyan-400 font-medium text-sm sm:text-base hover:text-cyan-300 transition-colors cursor-pointer"
                            >
                                {username || "User"}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                                    <button
                                        onClick={userStats}
                                        className="w-full text-left px-4 py-2 text-sm text-cyan-400 hover:bg-slate-700/50 hover:text-cyan-300 transition-colors cursor-pointer border-b border-slate-700"
                                    >
                                        Stats
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 hover:text-red-300 transition-colors cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={goLoginPage}
                            className="px-4 py-1 border-2 border-slate-500 rounded-lg text-slate-500 hover:text-cyan-500 hover:border-cyan-500 hover:scale-110 transition-all duration-200 cursor-pointer group"
                        >
                            <span className="text-lg font-semibold">Login</span>
                        </button>
                    )}
                </div>
            </div>

            <hr className="border-gray-700" />
        </header>
    );
}
