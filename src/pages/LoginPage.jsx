import React from "react";
import Header from '../components/Header';
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/'); 
    }

    return(
        <div className="flex flex-col min-h-scren bg-slate-900 px-4 py-4">
            <button
            onClick={handleGoBack}
            className="w-32 h-32items-center justify-center "
            >
                go back
            </button>
        </div>
    );
}