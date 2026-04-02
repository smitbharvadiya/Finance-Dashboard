import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Shield, BarChart3, Globe, ChevronRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <div className="w-3 h-[1px] bg-white rotate-45 absolute" />
            <div className="w-3 h-[1px] bg-white -rotate-45 absolute" />
          </div>
          <span className="font-bold tracking-tighter text-2xl uppercase italic">Equity.</span>
        </div>
        
        <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400">
          <a href="#" className="hover:text-black transition-colors">Institutions</a>
          <a href="#" className="hover:text-black transition-colors">Markets</a>
          <a href="#" className="hover:text-black transition-colors">Security</a>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-xs font-bold uppercase tracking-widest px-6 py-2 hover:text-blue-600 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/register")}
            className="bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-black/10 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <section>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Markets Open: NYSE +0.42%</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-semibold tracking-tighter leading-[0.9] mb-8">
              The new <br /> 
              <span className="text-slate-300 italic">standard</span> <br /> 
              of capital.
            </h1>
            
            <p className="max-w-md text-slate-500 text-lg leading-relaxed mb-10">
              Institutional-grade tools for private investors. Real-time analytics, automated hedging, and seamless global transfers.
            </p>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate("/register")}
                className="group flex items-center gap-3 bg-black text-white pl-8 pr-2 py-2 rounded-full font-medium transition-all hover:pr-4"
              >
                Start your portfolio
                <div className="bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </button>
              <button className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-slate-500 hover:border-slate-300 transition-all">
                View Methodology
              </button>
            </div>
          </section>

          {/* Minimalist Feature Cards */}
          <section className="grid grid-cols-2 gap-4">
            <div className="p-8 border border-slate-100 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-default group">
              <BarChart3 className="mb-4 text-slate-300 group-hover:text-black transition-colors" size={24} />
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Alpha Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Predictive modeling using proprietary neural networks.</p>
            </div>
            <div className="p-8 border border-slate-100 rounded-[2rem] bg-slate-50/50 mt-12 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-default group">
              <Shield className="mb-4 text-slate-300 group-hover:text-black transition-colors" size={24} />
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Vault Guard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Multi-sig biometric encryption for every transaction.</p>
            </div>
            <div className="p-8 border border-slate-100 rounded-[2rem] bg-slate-50/50 -mt-6 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-default group">
              <Globe className="mb-4 text-slate-300 group-hover:text-black transition-colors" size={24} />
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Zero Borders</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Instant settlement across 140+ global currencies.</p>
            </div>
            <div className="p-8 bg-black rounded-[2rem] mt-6 flex flex-col justify-between text-white group cursor-pointer overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                 <ArrowUpRight size={100} />
               </div>
               <h3 className="font-bold text-sm uppercase tracking-wider">Ready?</h3>
               <div className="flex items-center gap-2 text-xs font-bold group-hover:gap-4 transition-all">
                 Join the Waitlist <ChevronRight size={14} />
               </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em]">© 2026 Equity Holdings International</p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <a href="#" className="hover:text-black transition-colors">Privacy</a>
             <a href="#" className="hover:text-black transition-colors">Terms</a>
             <a href="#" className="hover:text-black transition-colors">SDR Data</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;