import React from "react";
import HomePage from "../pages/HomePage";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    
    const goHomePage = () =>{
        navigate('/');
    }

    const goLoginPage = () => {
        navigate('/LoginPage');
    };

    return (
        <header className="sticky top-0 z-50">
            <div className="bg-slate-900 text-white py-3 px-4 sm:px-6 lg:px-8">
                {/* Flex container to align title and button horizontally */}
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    {/* Placeholder div on the left to keep "KeyType" perfectly centered */}
                    <div className="w-20 hidden sm:block"></div>

                    {/* Centered Title */}
                    <button 
                    onClick={goHomePage}
                    className="text-slate-300 hover:text-cyan-500 hover:scale-110 transition-all duration-200 cursor-pointer group"
                    >
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ">KeyType</h1>
                    </button>
                    {/* Login Button aligned to the right */}
                    <button
                        onClick={goLoginPage}
                        className="px-4 py-1 border-2 border-slate-500 rounded-lg text-slate-500 hover:text-cyan-500 hover:border-cyan-500 hover:scale-110 transition-all duration-200 cursor-pointer group"
                    >
                        <span className="text-lg font-semibold">Login</span>
                    </button>
                </div>
            </div>
            
            {/* Horizontal Line placed below the header content */}
            <hr className="border-gray-700" />
        </header>
    );
}