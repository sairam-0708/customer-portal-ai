import React from 'react';
import { Policy, Claim, PaymentRecord, Offer, AgentInfo } from '../types';
import { 
  Shield, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import AgentSection from './AgentSection';
import OffersSection from './OffersSection';

interface PortfolioPageProps {
  policies: Policy[];
  claims: Claim[];
  autoPayments: PaymentRecord[];
  homePayments: PaymentRecord[];
  paymentMethod: { type: string; last4: string; autoPay: boolean };
  paperlessOffer: Offer;
  onTogglePaperless: () => void;
  onIdCardClick: (policy: Policy) => void;
  onDetailsClick: (policy: Policy) => void;
  onDocumentsClick: (policy: Policy) => void;
  onNavigateToTab: (tab: string) => void;
  onMakePaymentClick: (type: 'auto' | 'home' | 'all', amount: number) => void;
  isBundleApplied: boolean;
  onLearnMorePaperless: () => void;
  agent: AgentInfo;
  onContactAgent: () => void;
}

export default function PortfolioPage({
  policies,
  claims,
  autoPayments,
  homePayments,
  paymentMethod,
  paperlessOffer,
  onTogglePaperless,
  onIdCardClick,
  onDetailsClick,
  onDocumentsClick,
  onNavigateToTab,
  onMakePaymentClick,
  isBundleApplied,
  onLearnMorePaperless,
  agent,
  onContactAgent
}: PortfolioPageProps) {
  // Calculations
  const activePoliciesCount = policies.filter(p => p.status === 'Active').length;
  const activeClaimsCount = claims.filter(c => c.status !== 'Closed').length;
  
  // Total monthly premium sum
  const totalMonthlyPremium = policies
    .filter(p => p.status === 'Active')
    .reduce((sum, p) => sum + p.premium, 0) - (paperlessOffer.active ? 6 : 0) - (isBundleApplied ? 45 : 0);

  // Total amount due on Jul 1, 2026
  const nextPaymentAmount = totalMonthlyPremium;

  return (
    <div className="space-y-8" id="portfolio-page-container">
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="portfolio-stats-grid">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-4"
        >
          <div className="p-3 bg-slate-50 rounded-xl text-[#0f9d58]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Active Policies</span>
            <span className="text-2xl font-bold text-slate-800 block mt-0.5">{activePoliciesCount}</span>
            <button 
              onClick={() => onNavigateToTab('policies')}
              className="text-xs text-[#0f9d58] font-medium hover:underline mt-1.5 flex items-center"
            >
              Manage policies <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-4"
        >
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Premium Due</span>
            <span className="text-2xl font-bold text-slate-800 block mt-0.5">${nextPaymentAmount.toFixed(2)}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Due Jul 1, 2026</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-4"
        >
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Open Claims</span>
            <span className="text-2xl font-bold text-slate-800 block mt-0.5">{activeClaimsCount}</span>
            <button 
              onClick={() => onNavigateToTab('claims')}
              className="text-xs text-[#0f9d58] font-medium hover:underline mt-1.5 flex items-center"
            >
              View claims center <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-4"
        >
          <div className="p-3 bg-[#e6f4ea] rounded-xl text-[#0f9d58]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Total Savings</span>
            <span className="text-2xl font-bold text-[#0f9d58] block mt-0.5">
              ${(paperlessOffer.active ? 36 : 0) + (isBundleApplied ? 540 : 0)}/yr
            </span>
            <span className="text-[11px] text-[#0f9d58] font-medium block mt-1">Active discounts</span>
          </div>
        </motion.div>
      </div>

      {/* 2. Main Double-Column split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Col (2/3 width) - Policy Previews & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Policies Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950 font-sans">Active Insurance Policies</h2>
                <p className="text-xs text-slate-400 font-sans">Quick-access view of your auto and home coverages</p>
              </div>
              <button 
                onClick={() => onNavigateToTab('policies')}
                className="text-xs font-semibold text-[#0f9d58] hover:underline flex items-center"
              >
                View all details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="space-y-4">
              {policies.map((policy) => {
                const isAuto = policy.type === 'auto';
                return (
                  <div 
                    key={policy.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                        isAuto ? 'bg-slate-100 text-[#0f9d58]' : 'bg-orange-100/70 text-orange-700'
                      }`}>
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{policy.title}</h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            {policy.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{policy.policyNumber}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Coverage: <span className="font-medium text-slate-700">{policy.coverage}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                      {isAuto && (
                        <button
                          onClick={() => onIdCardClick(policy)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                        >
                          Auto ID Card
                        </button>
                      )}
                      <button
                        onClick={() => onDetailsClick(policy)}
                        className="px-3 py-1.5 bg-[#0f9d58]/5 hover:bg-[#0f9d58]/10 text-[#0f9d58] text-xs font-bold rounded-lg transition-all"
                      >
                        View Limits
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950 font-sans">Recent Account Activity</h2>
                <p className="text-xs text-slate-400 font-sans">Transactions, policy modifications, and claims updates</p>
              </div>
              <button 
                onClick={() => onNavigateToTab('billing')}
                className="text-xs font-semibold text-[#0f9d58] hover:underline flex items-center"
              >
                View payment records <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="relative border-l border-slate-200 pl-4 ml-2.5 space-y-6">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 bg-emerald-500 border-2 border-white w-3 h-3 rounded-full shadow-xs" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">ShieldGuard Premium Automatic Withdrawal</span>
                    <span className="text-[10px] text-slate-400">Jun 1, 2026</span>
                  </div>
                  <p className="text-xs text-slate-500">Auto premium (${policies.find(p=>p.type==='auto')?.premium} due) and Home premium (${policies.find(p=>p.type==='home')?.premium} due) automatically processed via Visa ending in 4821.</p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 bg-slate-400 border-2 border-white w-3 h-3 rounded-full shadow-xs" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Claims Incident Closed</span>
                    <span className="text-[10px] text-slate-400">Feb 12, 2026</span>
                  </div>
                  <p className="text-xs text-slate-500">Bumper scraping claim on Honda Accord completed. Deductible applied, final check paid out to authorized body shop.</p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 bg-slate-500 border-2 border-white w-3 h-3 rounded-full shadow-xs" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Welcome to MyShieldGuard Customer Portal</span>
                    <span className="text-[10px] text-slate-400">Jan 15, 2026</span>
                  </div>
                  <p className="text-xs text-slate-500">Account successfully setup securely online. Home & Auto policies linked.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col (1/3 width) - Agent Block & Offers Block */}
        <div className="space-y-8">
          <AgentSection
            agent={agent}
            onContactClick={onContactAgent}
          />

          <OffersSection
            offer={paperlessOffer}
            onTogglePaperless={onTogglePaperless}
            onLearnMore={onLearnMorePaperless}
          />
        </div>
      </div>
    </div>
  );
}
