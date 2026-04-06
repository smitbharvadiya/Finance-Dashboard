import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, User, Fingerprint } from "lucide-react";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {

        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if(!res.ok){
                setMessage(data.message || "Registration failed. Try again.");
                return;
            }

            setMessage(data.message || "Registered Successfully");

            setFormData({
                name: "",
                email: "",
                password: "",
            });

            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
            
            <nav className="absolute top-0 w-full p-8 flex justify-between items-center">
                <div className="flex items-center gap-2" onClick={() => navigate("/")}>
                    <div className="w-6 h-6 bg-black rounded-full" />
                    <span className="font-bold tracking-tighter text-xl">EQUITY.</span>
                </div>
                <button className="text-sm font-medium text-slate-500 hover:text-black transition-colors">
                    Sign In
                </button>
            </nav>

            <div className="w-full max-w-[400px] px-6">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Get started
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Enter your details to access your dashboard.
                    </p>
                </header>

                {message && (
                    <div className="mb-6 py-3 px-4 bg-slate-50 border border-slate-100 rounded-lg text-xs text-center text-slate-600 animate-in fade-in slide-in-from-top-1">
                        {message}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="relative border-b border-slate-100 focus-within:border-black transition-colors group">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Full Name</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Alexander Rossi"
                                    className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-slate-300"
                                    required
                                />
                                <User size={14} className="text-slate-300 group-focus-within:text-black transition-colors" />
                            </div>
                        </div>

                        <div className="relative border-b border-slate-100 focus-within:border-black transition-colors group">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Email Address</label>
                            <div className="flex items-center">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="alex@equity.com"
                                    className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-slate-300"
                                    required
                                />
                                <Mail size={14} className="text-slate-300 group-focus-within:text-black transition-colors" />
                            </div>
                        </div>

                        <div className="relative border-b border-slate-100 focus-within:border-black transition-colors group">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Password</label>
                            <div className="flex items-center">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-slate-300"
                                    required
                                />
                                <Lock size={14} className="text-slate-300 group-focus-within:text-black transition-colors" />
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 flex items-center justify-between bg-black text-white px-6 py-4 rounded-full text-sm font-medium hover:bg-slate-800 transition-all disabled:bg-slate-200 group"
                    >
                        {loading ? (
                            <span className="w-full text-center tracking-tight">Processing...</span>
                        ) : (
                            <>
                                <span>Open Dashboard</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <footer className="mt-12 text-center">
                    <p className="text-xs text-slate-400">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-black font-semibold hover:underline decoration-1 underline-offset-4 cursor-pointer">
                            LogIn
                        </button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Register;