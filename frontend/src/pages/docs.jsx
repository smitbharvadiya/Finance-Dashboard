import React, { useState } from 'react';
import { Copy, Check, Lock, Shield, Server, Globe, Database, Info, AlertCircle, Code } from 'lucide-react';

const ApiDocumentation = () => {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const TableRow = ({ name, type, description, required }) => (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="py-4 pr-4">
        <code className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{name}</code>
        {required && <span className="ml-2 text-[9px] text-rose-500 font-bold uppercase tracking-tighter">Required</span>}
      </td>
      <td className="py-4 px-4 text-[11px] font-mono text-slate-400 uppercase">{type}</td>
      <td className="py-4 pl-4 text-xs text-slate-500 leading-relaxed">{description}</td>
    </tr>
  );

  const EndpointSection = ({ title, method, url, description, params, body, response, errors }) => (
    <div className="mb-24 scroll-mt-24" id={title.replace(/\s+/g, '-').toLowerCase()}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${
          method === 'GET' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          method === 'POST' ? 'bg-blue-50 text-blue-600 border-blue-100' :
          method === 'DELETE' ? 'bg-rose-50 text-rose-600 border-rose-100' :
          'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          {method}
        </span>
        <code className="text-sm font-mono font-bold text-slate-800">{url}</code>
      </div>
      
      <h3 className="text-2xl font-semibold mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-2xl">{description}</p>

      {params && (
        <div className="mb-8">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
            <Info size={12} /> Query Parameters
          </h4>
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden px-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] uppercase tracking-widest text-slate-300">
                  <th className="py-4 font-bold">Parameter</th>
                  <th className="py-4 px-4 font-bold">Type</th>
                  <th className="py-4 pl-4 font-bold">Description</th>
                </tr>
              </thead>
              <tbody>
                {params.map(p => <TableRow key={p.name} {...p} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {body && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Request Payload</span>
              <div className="relative group">
                <pre className="bg-slate-900 text-slate-300 p-6 rounded-3xl text-[12px] font-mono overflow-x-auto shadow-2xl border border-white/5">
                  {JSON.stringify(body, null, 2)}
                </pre>
                <button onClick={() => handleCopy(JSON.stringify(body, null, 2), title + 'body')} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white">
                  {copied === title + 'body' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
          
          {errors && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Potential Errors</span>
              <div className="space-y-2">
                {errors.map(err => (
                  <div key={err.code} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-mono font-bold text-rose-500 w-8">{err.code}</span>
                    <span className="text-[11px] text-slate-600 font-medium">{err.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Success Response</span>
          <div className="relative group">
            <pre className="bg-slate-50 text-slate-600 border border-slate-100 p-6 rounded-3xl text-[12px] font-mono overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 pb-32">
      <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row gap-20">
        
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-5 h-5 bg-black rounded-full" />
                <span className="font-bold tracking-tighter uppercase italic">Equity.Docs</span>
              </div>
              <nav className="space-y-4">
                {['Introduction', 'Authentication', 'Errors'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-colors">{item}</a>
                ))}
              </nav>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Endpoints</h4>
              <nav className="space-y-5">
                {['Fetch Records', 'Add Record', 'Update Entry', 'Delete Entry', 'Financial Summary'].map(item => (
                  <a key={item} href={`#${item.replace(/\s+/g, '-').toLowerCase()}`} className="block text-xs font-bold text-slate-500 hover:text-black transition-colors">{item}</a>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <section id="introduction" className="mb-24">
            <h1 className="text-6xl font-semibold tracking-tighter mb-8 italic">API Reference.</h1>
            <p className="text-xl text-slate-400 leading-relaxed font-light">
              Automate your vault operations with the Equity Ledger API. Built on REST principles, our API returns JSON-encoded responses and uses standard HTTP response codes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
               <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                 <Server size={24} className="mb-6 text-slate-900" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">Service Endpoint</h4>
                 <code className="text-xs font-mono text-slate-400">http://localhost:3000/record</code>
               </div>
               <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                 <Lock size={24} className="mb-6 text-slate-900" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">Authorization</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Session-based JWT cookies. Ensure <code className="bg-slate-50 px-1">withCredentials: true</code> is set in your client.</p>
               </div>
            </div>
          </section>

          <section id="authentication" className="mb-24 scroll-mt-24">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">Authentication</h2>
            <div className="bg-slate-900 text-slate-300 p-8 rounded-[2.5rem] space-y-4 font-mono text-xs leading-relaxed">
              <p className="text-emerald-400">// To authenticate, include the token in your request headers</p>
              <p>fetch('http://localhost:3000/record', &#123;</p>
              <p className="ml-4">method: 'GET',</p>
              <p className="ml-4 text-white font-bold">credentials: 'include',</p>
              <p className="ml-4">headers: &#123; 'Content-Type': 'application/json' &#125;</p>
              <p>&#125;);</p>
            </div>
          </section>

          <hr className="border-slate-100 mb-24" />

          <EndpointSection 
            title="Fetch Records"
            method="GET"
            url="/"
            description="Returns a paginated list of financial entries filtered by user session. Use parameters to narrow down specific asset flows."
            params={[
              { name: 'page', type: 'number', description: 'The page index (1-based)', required: false },
              { name: 'limit', type: 'number', description: 'Results per page (Max 100)', required: false },
              { name: 'search', type: 'string', description: 'Filter by category name or notes', required: false },
              { name: 'type', type: 'string', description: 'income | expense', required: false }
            ]}
            response={{
              records: [
                { _id: "65f...", amount: 4500, type: "income", category: "SaaS Revenue", status: "Success", date: "2026-04-06" }
              ],
              pagination: { total: 120, totalPages: 12, page: 1, limit: 10, hasNextPage: true }
            }}
            errors={[{ code: 401, message: "Unauthorized - Token missing or expired" }]}
          />

          <EndpointSection 
            title="Add Record"
            method="POST"
            url="/add"
            description="Records a new transaction in the ledger. This requires Admin role permissions."
            body={{
              amount: 2500.00,
              type: "expense",
              category: "Cloud Hosting",
              status: "Success",
              note: "AWS Monthly Billing",
              date: "2026-04-06"
            }}
            response={{ success: true, message: "Transaction settled and recorded" }}
            errors={[
              { code: 400, message: "Validation Failed - Amount must be positive" },
              { code: 403, message: "Forbidden - Insufficient Role" }
            ]}
          />

          <EndpointSection 
            title="Financial Summary"
            method="GET"
            url="/summary"
            description="Aggregated intelligence for the dashboard. Calculates net balance, trend lines, and category distribution percentages."
            response={{
              metrics: { netBalance: 125000, totalIncome: 200000, totalExpense: 75000 },
              trends: [
                { period: "2026-04-01", income: 1200, expense: 400, net: 800 }
              ],
              categories: [
                { _id: "SaaS", total: 45000 }
              ]
            }}
          />

          <section id="errors" className="mb-24 scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
               <AlertCircle className="text-rose-500" />
               <h2 className="text-3xl font-semibold tracking-tight">Global Error Handling</h2>
            </div>
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden px-8 py-4 shadow-sm">
                <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { code: '400', title: 'Bad Request', desc: 'Invalid parameters or malformed JSON payload.' },
                            { code: '401', title: 'Unauthorized', desc: 'Authentication token is invalid or has expired.' },
                            { code: '403', title: 'Forbidden', desc: 'Authenticated user lacks the role required for this action.' },
                            { code: '404', title: 'Not Found', desc: 'The requested record or endpoint does not exist.' },
                            { code: '500', title: 'Server Error', desc: 'Internal fault. Please monitor the system status page.' },
                        ].map(err => (
                            <tr key={err.code}>
                                <td className="py-6 font-mono font-bold text-rose-500 text-sm">{err.code}</td>
                                <td className="py-6 font-bold text-xs uppercase tracking-widest">{err.title}</td>
                                <td className="py-6 text-sm text-slate-400">{err.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </section>
          
          <div className="p-12 bg-black rounded-[3rem] text-white flex flex-col items-center text-center gap-6 overflow-hidden relative shadow-2xl">
            <div className="relative z-10">
                <Code className="mx-auto mb-6 opacity-20" size={48} />
                <h3 className="text-2xl font-bold tracking-tight italic">Ready for integration?</h3>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-transparent to-transparent" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiDocumentation;