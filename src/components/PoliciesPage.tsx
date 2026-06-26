import React, { useState } from 'react';
import { Policy } from '../types';
import { 
  Shield, 
  Car, 
  Home as HomeIcon, 
  Search, 
  Sliders, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  Layers,
  Percent,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PoliciesPageProps {
  policies: Policy[];
  setPolicies: React.Dispatch<React.SetStateAction<Policy[]>>;
  isPaperlessActive: boolean;
  onIdCardClick: (policy: Policy) => void;
  onDetailsClick: (policy: Policy) => void;
  onDocumentsClick: (policy: Policy) => void;
  onFileClaimClick: (policy: Policy) => void;
  showToast: (message: string) => void;
}

export default function PoliciesPage({
  policies,
  setPolicies,
  isPaperlessActive,
  onIdCardClick,
  onDetailsClick,
  onDocumentsClick,
  onFileClaimClick,
  showToast
}: PoliciesPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'auto' | 'home'>('all');
  const [filterQuery, setFilterQuery] = useState('');

  // Interactive Adjuster State
  const [adjustingPolicyId, setAdjustingPolicyId] = useState<string | null>(null);
  const [simulatedDeductible, setSimulatedDeductible] = useState<number>(500);
  const [simulatedDwellingLimit, setSimulatedDwellingLimit] = useState<number>(350000);

  // Quote Workflow State
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteType, setQuoteType] = useState<'renters' | 'umbrella'>('renters');
  const [quoteAnswers, setQuoteAnswers] = useState({
    zipCode: '21075',
    propertyValue: '25000',
    liabilityLimit: '300000',
  });
  const [calculatedQuote, setCalculatedQuote] = useState<number | null>(null);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Calculations for Adjusted Premiums
  const originalAuto = policies.find(p => p.type === 'auto');
  const currentAutoPremium = originalAuto?.premium || 142;
  const originalDeductible = originalAuto?.deductible || 500;

  // Simple calculation for simulation:
  // Auto premium changes by -15% if deductible is 1000, +20% if deductible is 250, compared to 500
  let simulatedAutoPremium = currentAutoPremium;
  if (simulatedDeductible === 250) simulatedAutoPremium = Math.round(currentAutoPremium * 1.22);
  else if (simulatedDeductible === 1000) simulatedAutoPremium = Math.round(currentAutoPremium * 0.84);

  const originalHome = policies.find(p => p.type === 'home');
  const currentHomePremium = originalHome?.premium || 218;
  const originalDwelling = originalHome?.dwellingLimit || 350000;

  // Home premium changes proportionally to dwelling limit (base 350000 is 218, each 50000 is +/- 25)
  let simulatedHomePremium = currentHomePremium + Math.round((simulatedDwellingLimit - originalDwelling) / 50000 * 24);

  // Handle saving the adjustments
  const handleApplyAdjustments = (policyId: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        if (p.type === 'auto') {
          return {
            ...p,
            deductible: simulatedDeductible,
            premium: simulatedAutoPremium
          };
        } else {
          return {
            ...p,
            dwellingLimit: simulatedDwellingLimit,
            premium: simulatedHomePremium
          };
        }
      }
      return p;
    }));
    setAdjustingPolicyId(null);
    showToast(`Your coverage adjustments have been saved! Your new premium has been updated.`);
  };

  // Generate Quote
  const handleCalculateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    let base = quoteType === 'renters' ? 18 : 32;
    if (quoteType === 'renters') {
      const val = parseInt(quoteAnswers.propertyValue) || 25000;
      base += Math.round((val - 25000) / 10000 * 4);
    } else {
      const limit = parseInt(quoteAnswers.liabilityLimit) || 1000000;
      base += Math.round((limit - 1000000) / 1000000 * 8);
    }
    setCalculatedQuote(base);
  };

  // Add Quote to Policies
  const handleAddQuotedPolicy = () => {
    if (!calculatedQuote) return;
    const isRenters = quoteType === 'renters';
    const newPolicy: Policy = {
      id: `policy_${quoteType}_${Date.now()}`,
      type: isRenters ? 'home' : 'auto', // map to categories for display
      title: isRenters ? 'Renters Insurance Protection' : '1-Million Umbrella liability',
      policyNumber: isRenters ? `R${Math.floor(10 + Math.random()*90)}-${Math.floor(1000+Math.random()*9000)}-${Math.floor(100+Math.random()*900)}` : `U${Math.floor(10 + Math.random()*90)}-${Math.floor(1000+Math.random()*9000)}-${Math.floor(100+Math.random()*900)}`,
      status: 'Active',
      renewalDate: new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      premium: calculatedQuote,
      coverage: isRenters ? 'Personal Property • Loss of Use' : 'Excess Liability protection',
      dwellingLimit: isRenters ? parseInt(quoteAnswers.propertyValue) : undefined,
    };

    setPolicies(prev => [...prev, newPolicy]);
    setShowQuoteForm(false);
    setCalculatedQuote(null);
    showToast(`Congratulations! Your new ShieldGuard ${isRenters ? 'Renters' : 'Umbrella'} coverage is now active and linked.`);
  };

  // Filtering
  const filteredPolicies = policies.filter(p => {
    const matchesTab = activeTab === 'all' || p.type === activeTab;
    const query = filterQuery.toLowerCase();
    const matchesQuery = !filterQuery || 
      p.title.toLowerCase().includes(query) ||
      p.policyNumber.toLowerCase().includes(query) ||
      p.coverage.toLowerCase().includes(query);
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-8" id="policies-page-wrapper">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#0f9d58] block uppercase font-sans">ShieldGuard Coverages</span>
          <h1 className="text-2xl sm:text-3xl font-sans font-medium text-slate-900 mt-1">My Policies & Coverages</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans">Review limits, download ID cards, and adjust deductibles on active coverages</p>
        </div>
        <button
          onClick={() => {
            setShowQuoteForm(true);
            setCalculatedQuote(null);
          }}
          className="px-4 py-2.5 bg-[#0f9d58] hover:bg-[#0b8043] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Get a New Quote</span>
        </button>
      </div>

      {/* Quote Form Overlay / Dynamic Block */}
      <AnimatePresence>
        {showQuoteForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-50 to-[#e6f4ea] border border-slate-200 rounded-2xl p-6 relative">
              <button 
                onClick={() => setShowQuoteForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#0f9d58]" />
                <h3 className="font-sans font-bold text-base text-slate-900">ShieldGuard Direct Quote Estimator</h3>
              </div>

              {!calculatedQuote ? (
                <form onSubmit={handleCalculateQuote} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Quote Type</label>
                    <select
                      value={quoteType}
                      onChange={(e) => setQuoteType(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 outline-none"
                    >
                      <option value="renters">Renters Insurance</option>
                      <option value="umbrella">Personal Umbrella Liability</option>
                    </select>
                  </div>

                  {quoteType === 'renters' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Property Worth</label>
                      <select
                        value={quoteAnswers.propertyValue}
                        onChange={(e) => setQuoteAnswers(prev => ({ ...prev, propertyValue: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 outline-none"
                      >
                        <option value="15000">$15,000 protection</option>
                        <option value="25000">$25,000 protection</option>
                        <option value="50000">$50,000 protection</option>
                        <option value="100000">$100,000 protection</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Liability Limit</label>
                      <select
                        value={quoteAnswers.liabilityLimit}
                        onChange={(e) => setQuoteAnswers(prev => ({ ...prev, liabilityLimit: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 outline-none"
                      >
                        <option value="1000000">$1 Million Limit</option>
                        <option value="2000000">$2 Million Limit</option>
                        <option value="5000000">$5 Million Limit</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Your Elkridge ZIP</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={quoteAnswers.zipCode}
                      onChange={(e) => setQuoteAnswers(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-medium text-slate-800 outline-none"
                      placeholder="21075"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0f9d58] hover:bg-[#0b8043] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Calculate Premium
                  </button>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-slate-200 rounded-xl gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700">Calculated ShieldGuard Rate Quote</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {quoteType === 'renters' ? 'ShieldGuard Renters Protection Pack' : 'ShieldGuard Personal Umbrella Excess Liability'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Based on Elkridge ZIP 21075. No credit check or agent signature required to start today.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#0f9d58] block">${calculatedQuote}.00</span>
                      <span className="text-[10px] text-slate-400 block font-sans">per month premium</span>
                    </div>
                    <button
                      onClick={handleAddQuotedPolicy}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs"
                    >
                      Bind Coverage
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs and Searching */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200/40 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all' 
                ? 'bg-[#0f9d58] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Coverages ({policies.length})
          </button>
          <button
            onClick={() => setActiveTab('auto')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'auto' 
                ? 'bg-[#0f9d58] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Auto Only
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'home' 
                ? 'bg-[#0f9d58] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Property/Home Only
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search within policies..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#0f9d58] focus:border-transparent"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Policies Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="policies-main-grid">
        {filteredPolicies.map((policy) => {
          const isAuto = policy.type === 'auto';
          const isAdjusting = adjustingPolicyId === policy.id;
          const displayPremium = isPaperlessActive ? policy.premium - 1.5 : policy.premium;

          return (
            <motion.div
              layout
              key={policy.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Card Title Banner */}
              <div className="bg-[#0f9d58] p-5 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    {isAuto ? <Car className="w-5 h-5" /> : <HomeIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest text-slate-300 uppercase font-bold block">
                      {isAuto ? 'Auto Insurance Policy' : 'Homeowners Insurance Policy'}
                    </span>
                    <h3 className="font-bold text-base leading-snug">{policy.title}</h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0">
                  {policy.status}
                </span>
              </div>

              {/* Coverages Table details */}
              <div className="p-5 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Policy Number</span>
                    <span className="font-mono font-bold text-slate-800 text-sm block">{policy.policyNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Renewal Date</span>
                    <span className="font-bold text-slate-800 block text-sm">{policy.renewalDate}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Core Coverages:</span>
                    <span className="font-bold text-slate-800 text-right">{policy.coverage}</span>
                  </div>

                  {isAuto ? (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Comprehensive Deductible:</span>
                      <span className="font-bold text-slate-800">${policy.deductible || 500}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Dwelling Rebuild Limit:</span>
                      <span className="font-bold text-slate-800">${policy.dwellingLimit?.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs border-t border-dashed border-slate-100 pt-2.5 items-baseline">
                    <span className="text-slate-500">Monthly Premium Contribution:</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-base">${displayPremium.toFixed(2)}</span>
                      {isPaperlessActive && (
                        <span className="block text-[9px] text-green-600 font-medium">Paperless discount of $1.50 active</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Simulated Premium Adjuster Slide Tray */}
                <AnimatePresence>
                  {isAdjusting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-xl space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Sliders className="w-3.5 h-3.5 text-[#0f9d58]" />
                        <span>Interactive Coverage & Premium Adjuster</span>
                      </div>
                      
                      {isAuto ? (
                        <div className="space-y-2">
                          <label className="block text-xs text-slate-500">Choose Deductible Limit:</label>
                          <div className="flex justify-between gap-2">
                            {[250, 500, 1000].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setSimulatedDeductible(val)}
                                className={`flex-1 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                                  simulatedDeductible === val 
                                    ? 'bg-[#0f9d58] border-[#0f9d58] text-white shadow-xs' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                ${val}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400">Higher deductibles lower your monthly premium payout instantly.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Adjust Dwelling Limit:</span>
                            <span className="font-bold text-slate-800">${simulatedDwellingLimit.toLocaleString()}</span>
                          </div>
                          <input 
                            type="range" 
                            min={300000} 
                            max={500000} 
                            step={50000}
                            value={simulatedDwellingLimit}
                            onChange={(e) => setSimulatedDwellingLimit(parseInt(e.target.value))}
                            className="w-full accent-[#0f9d58]"
                          />
                          <p className="text-[10px] text-slate-400">Increase dwelling limits to protect against post-inflation rebuild costs.</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-[#0f9d58] uppercase">Simulated Premium Rate</span>
                        <span className="text-sm font-black text-[#0f9d58]">
                          ${isAuto ? simulatedAutoPremium : simulatedHomePremium}/mo
                        </span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setAdjustingPolicyId(null)}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleApplyAdjustments(policy.id)}
                          className="px-3 py-1.5 bg-[#0f9d58] text-white text-[10px] font-bold rounded-lg hover:bg-[#0b8043] transition-colors"
                        >
                          Save Adjustments
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 justify-between">
                <div className="flex gap-2">
                  {isAuto ? (
                    <button
                      onClick={() => onIdCardClick(policy)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      ID Card
                    </button>
                  ) : (
                    <button
                      onClick={() => onDocumentsClick(policy)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Docs Vault
                    </button>
                  )}
                  <button
                    onClick={() => onDetailsClick(policy)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Coverage limits
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (isAdjusting) {
                        setAdjustingPolicyId(null);
                      } else {
                        setAdjustingPolicyId(policy.id);
                        if (isAuto) {
                          setSimulatedDeductible(policy.deductible || 500);
                        } else {
                          setSimulatedDwellingLimit(policy.dwellingLimit || 350000);
                        }
                      }
                    }}
                    className="px-3 py-1.5 bg-[#0f9d58]/10 text-[#0f9d58] hover:bg-[#0f9d58]/20 text-xs font-bold rounded-lg transition-colors"
                  >
                    {isAdjusting ? 'Close Adjuster' : 'Adjust Limits'}
                  </button>
                  <button
                    onClick={() => onFileClaimClick(policy)}
                    className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold rounded-lg transition-colors"
                  >
                    Report Claim
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
