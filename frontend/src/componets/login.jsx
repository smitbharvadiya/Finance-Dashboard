import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                setMessage(data.message || "Login failed. Try again.");
                return;
            }

            setMessage(data.message || "Welcome back.");

            navigate("/dashboard");

        } catch (error) {
            setMessage("Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center font-sans">

            <nav className="absolute top-0 w-full p-8 flex justify-between items-center">
                <div className="flex items-center gap-2" onClick={() => navigate("/")}>
                    <div className="w-6 h-6 bg-black rounded-full" />
                    <span className="font-bold tracking-tighter text-xl cursor-pointer">EQUITY.</span>
                </div>
            </nav>

            <div className="w-full max-w-[360px] px-6">
                <header className="mb-10 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Sign in
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Access your secure wealth portal.
                    </p>
                </header>

                {message && (
                    <div className={`mb-6 py-3 px-4 rounded-xl text-[13px] text-center transition-all ${message.includes("failed") || message.includes("Invalid")
                        ? "bg-red-50 text-red-500 border border-red-100"
                        : "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-5">
                        <div className="group relative border-b border-slate-100 focus-within:border-black transition-all duration-300">
                            <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 group-focus-within:text-black">
                                Account ID
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@firm.com"
                                    className="w-full py-3 bg-transparent text-[15px] focus:outline-none placeholder:text-slate-200"
                                    required
                                />
                                <Mail size={14} className="text-slate-300 group-focus-within:text-black transition-colors" />
                            </div>
                        </div>

                        <div className="group relative border-b border-slate-100 focus-within:border-black transition-all duration-300">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 group-focus-within:text-black">
                                    Passkey
                                </label>
                                <button type="button" className="text-[10px] text-slate-400 hover:text-black transition-colors mb-1">
                                    Forgot?
                                </button>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full py-3 bg-transparent text-[15px] focus:outline-none placeholder:text-slate-200"
                                    required
                                />
                                <Lock size={14} className="text-slate-300 group-focus-within:text-black transition-colors" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-between bg-black text-white pl-7 pr-5 py-4 rounded-full text-sm font-medium hover:bg-slate-800 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 group overflow-hidden"
                    >
                        <span className="tracking-tight">
                            {loading ? "Verifying..." : "Enter Vault"}
                        </span>
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <div className="flex items-center gap-1">
                                <div className="h-[1px] w-4 bg-white/30 group-hover:w-6 transition-all" />
                                <ArrowRight size={18} />
                            </div>
                        )}
                    </button>
                </form>

                <footer className="mt-12 text-center">
                    <p className="text-xs text-slate-400">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="text-black font-semibold hover:underline decoration-1 underline-offset-4 cursor-pointer">
                            Create one
                        </button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Login;