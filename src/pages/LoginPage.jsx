import React, { useState } from "react";
import Header from '../components/Header';
import Transition from '../components/PageTransition';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        const endpoint = isSignUp
        ? `${API_BASE_URL}/api/auth/register`
        : `${API_BASE_URL}/api/auth/login`;

        try{
            const response = await fetch(endpoint, {
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.detail || "Authentication failed");
            }
            if(isSignUp){
                setIsSignUp(false);
                setErrorMsg("");
                alert("Account created successfully!");
            }else{
                localStorage.setItem("token", data.access_token);
                navigate("/");
            }
        }catch(err){
            setErrorMsg(err.message);
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <Transition>
            <Header />
            <div className="min-h-[calc(100vh-65px)] bg-slate-900 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-8 shadow-2xl shadow-cyan-950/30">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {isSignUp ? "Create an Account" : "Welcome Back"}
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">
                            {isSignUp
                                ? "Join KeyType to track your speed and stats"
                                : "Sign in to access your KeyType account"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-slate-300">
                                    Password
                                </label>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        onClick={() => alert("Password reset link sent (demo)")}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                                />
                                <span className="text-sm text-slate-400">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer active:scale-[0.99]"
                        >
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        {isSignUp ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(false)}
                                    className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                                >
                                    Sign in
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(true)}
                                    className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Transition>
    );
}
