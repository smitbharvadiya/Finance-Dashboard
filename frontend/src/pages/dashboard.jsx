import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    ArrowUpRight, ArrowDownLeft, Filter,
    Download, Search, MoreHorizontal,
    Plus, Calendar, Wallet, LogOut, X, Trash2
} from "lucide-react";

const Dashboard = () => {
    const [records, setRecords] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: "",
        type: "expense",
        category: "",
        status: "Success",
        note: "",
        date: new Date().toISOString().split('T')[0]
    });

    const navigate = useNavigate();

    // 1. Fetch Records
    const fetchRecords = async () => {
        setFetching(true);
        try {
            const res = await fetch("http://localhost:3000/record/", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json" 
                },
                credentials: "include"
            });
            const data = await res.json();
            setRecords(data.records || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchRecords(); }, []);

    // 2. Add Record
    const handleAddRecord = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/record/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });
            if (res.ok) {
                setIsPanelOpen(false);
                fetchRecords(); // Refresh list
                setFormData({ amount: "", type: "expense", category: "", note: "", date: new Date().toISOString().split('T')[0] });
            }
        } catch (err) {
            console.error("Add error:", err);
        }
    };

    // 3. Delete Record
    const deleteRecord = async (id) => {
        if (!window.confirm("Permanent delete?")) return;
        try {
            await fetch(`http://localhost:3000/record/delete/${id}`, { 
                method: "DELETE",
                credentials: "include"
             });
            setRecords(records.filter(r => r._id !== id));
        } catch (err) { console.error(err); }
    };

    // Calculate Totals
    const totalIncome = records.filter(r => r.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans pb-20 relative overflow-x-hidden">
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-6 h-6 bg-black rounded-full" />
                        <span className="font-bold tracking-tighter text-lg italic uppercase">Equity.</span>
                    </div>
                    <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                        <button className="text-black border-b-2 border-black pb-1">Ledger</button>
                        <button className="hover:text-black transition-colors">Analytics</button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/")} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <LogOut size={18} />
                    </button>
                    <div className="w-8 h-8 bg-slate-200 rounded-full border border-white shadow-sm overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Equity" alt="user" />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 mt-12">
                <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight">Vault Overview</h1>
                        <p className="text-slate-400 text-sm mt-1">Real-time tracking of institutional flow.</p>
                    </div>
                    <button
                        onClick={() => setIsPanelOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        <Plus size={16} /> New Entry
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard label="Total Liquidity" value={totalIncome - totalExpense} icon={<Wallet size={20} />} color="bg-black text-white" />
                    <StatCard label="Inflow" value={totalIncome} icon={<ArrowUpRight size={20} />} color="bg-white text-emerald-600" />
                    <StatCard label="Outflow" value={totalExpense} icon={<ArrowDownLeft size={20} />} color="bg-white text-slate-900" />
                </div>

                {/* Main Table */}
                {/* Optimized Main Table */}
<div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
    <table className="w-full text-left border-collapse">
        <thead>
            <tr className="bg-slate-50/40 border-b border-slate-100">
                <th className="pl-10 pr-6 py-6 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">Ledger Identity</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">Allocation / Note</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">Status</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400 text-right">Amount (USD)</th>
                <th className="pl-6 pr-10 py-6"></th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
            {fetching ? (
                <tr>
                    <td colSpan={5} className="p-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Syncing Ledger...</p>
                        </div>
                    </td>
                </tr>
            ) : records.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400 italic text-sm">No transactions found in this vault.</td>
                </tr>
            ) : records.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                    {/* Column 1: Identity & Date */}
                    <td className="pl-10 pr-6 py-7">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
                                TXN-{row._id.slice(-6)}
                            </span>
                            <span className="text-sm font-medium text-slate-900">
                                {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </td>

                    {/* Column 2: Category & Memo */}
                    <td className="px-6 py-7">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{row.category}</span>
                            <span className="text-xs text-slate-400 mt-1 font-light italic max-w-[200px] truncate">
                                {row.note || "Operational entry"}
                            </span>
                        </div>
                    </td>

                    {/* Column 3: Status */}
                    <td className="px-6 py-7">
                        <StatusBadge status={row.status} />
                    </td>

                    {/* Column 4: Amount */}
                    <td className="px-6 py-7 text-right">
                        <div className={`text-lg font-bold tabular-nums ${row.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {row.type === 'income' ? '+' : '-'}{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] font-bold uppercase text-slate-300 tracking-widest">
                            {row.type}
                        </div>
                    </td>

                    {/* Column 5: Actions */}
                    <td className="pl-6 pr-10 py-7 text-right">
                        <button 
                            onClick={() => deleteRecord(row._id)} 
                            className="p-2 opacity-0 group-hover:opacity-100 bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all duration-200"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
            </main>

            {/* Slide-over Panel (Add Record) */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col p-10">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Equity Entry.</h2>
                        <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleAddRecord} className="space-y-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Transaction Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['expense', 'income'].map((t) => (
                                    <button
                                        key={t} type="button"
                                        onClick={() => setFormData({ ...formData, type: t })}
                                        className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${formData.type === t ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Amount ($)</label>
                            <input
                                type="number" required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full text-4xl font-semibold tracking-tighter border-b-2 border-slate-100 focus:border-black outline-none pb-2 transition-colors"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text" placeholder="Category (e.g. Dividend, SaaS, Travel)"
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-1 ring-slate-200 text-sm"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Note (Optional)"
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-1 ring-slate-200 text-sm h-32 resize-none"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">
                                Status
                            </label>

                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm"
                            >

                                <option value="Success">Success</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>

                            </select>

                        </div>

                        <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-lg shadow-black/10">
                            Confirm Settlement
                        </button>
                    </form>
                </div>
            </div>
            {isPanelOpen && <div onClick={() => setIsPanelOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" />}
        </div>
    );
};

// Sub-component for clean code
const StatCard = ({ label, value, icon, color }) => (
    <div className={`${color} p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40`}>
        <div className="flex justify-between items-start w-full">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{label}</span>
            <div className="opacity-40">{icon}</div>
        </div>
        <p className="text-3xl font-medium tracking-tighter tabular-nums">${value.toLocaleString()}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = {
        Success: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Pending: "bg-amber-50 text-amber-600 border-amber-100",
        Failed: "bg-red-50 text-red-600 border-red-100",
    };

    return (
        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border shadow-sm ${config[status] || config.Pending}`}>
            {status}
        </span>
    );
};

export default Dashboard;