import React, { useState } from 'react';
import { Policy, PaymentRecord } from '../types';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Search, 
  DollarSign, 
  FileText, 
  Percent, 
  Download, 
  Printer, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BillingPageProps {
  policies: Policy[];
  autoPayments: PaymentRecord[];
  homePayments: PaymentRecord[];
  paymentMethod: { type: string; last4: string; autoPay: boolean };
  setPaymentMethod: React.Dispatch<React.SetStateAction<{ type: string; last4: string; autoPay: boolean }>>;
  isPaperlessActive: boolean;
  onUpdatePayment: (policyType: 'auto' | 'home' | 'all') => void;
  onMakePayment: (policyType: 'auto' | 'home', amount: number) => void;
  showToast: (message: string) => void;
}

export default function BillingPage({
  policies,
  autoPayments,
  homePayments,
  paymentMethod,
  setPaymentMethod,
  isPaperlessActive,
  onUpdatePayment,
  onMakePayment,
  showToast
}: BillingPageProps) {
  const [billingFilter, setBillingFilter] = useState<'all' | 'auto' | 'home'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<{
    record: PaymentRecord;
    policyName: string;
    policyNumber: string;
  } | null>(null);

  // Auto premiums
  const autoBase = policies.find(p => p.type === 'auto')?.premium || 142;
  const homeBase = policies.find(p => p.type === 'home')?.premium || 218;

  const actualAuto = isPaperlessActive ? autoBase - 1.5 : autoBase;
  const actualHome = isPaperlessActive ? homeBase - 1.5 : homeBase;
  const combinedTotal = actualAuto + actualHome;

  // Combine payments for list view
  const allPayments = [
    ...autoPayments.map(p => ({ ...p, policyType: 'auto' as const, policyName: '2021 Honda Accord', policyNum: 'Q55-8821-004' })),
    ...homePayments.map(p => ({ ...p, policyType: 'home' as const, policyName: '412 Maple Street', policyNum: 'H32-4490-117' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter payments
  const filteredPayments = allPayments.filter(p => {
    const matchesType = billingFilter === 'all' || p.policyType === billingFilter;
    const matchesSearch = !searchQuery || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.amount.toString().includes(searchQuery);
    return matchesType && matchesSearch;
  });

  // Toggle Auto pay
  const handleToggleAutoPay = () => {
    const nextVal = !paymentMethod.autoPay;
    setPaymentMethod(prev => ({ ...prev, autoPay: nextVal }));
    showToast(
      nextVal 
        ? "Auto-pay successfully activated! Next billing cycle will draft automatically."
        : "Auto-pay deactivated. Please ensure manual payments are submitted by due dates."
    );
  };

  const handlePrintReceipt = () => {
    showToast("Opening operating system print dialog... Receipt prepared.");
  };

  return (
    <div className="space-y-8" id="billing-page-wrapper">
      {/* 1. Page Header */}
      <div>
        <span className="text-xs font-bold tracking-wider text-[#0f9d58] block uppercase font-sans">Premium Management</span>
        <h1 className="text-2xl sm:text-3xl font-sans font-medium text-slate-900 mt-1">Billing & Premium Invoices</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans">Verify payment records, update drafting credentials, and review invoices</p>
      </div>

      {/* 2. Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="billing-stats-grid">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Next Payment Due</span>
          <span className="text-2xl font-bold text-slate-900 block mt-1">${combinedTotal.toFixed(2)}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Due Date: Jul 1, 2026</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Combined Premium</span>
          <span className="text-2xl font-bold text-slate-900 block mt-1">${combinedTotal.toFixed(2)}/mo</span>
          <span className="text-[11px] text-green-600 font-medium block mt-1">
            {isPaperlessActive ? '✓ GoPaperless $3.00 off applied' : 'Paperless discount available'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Drafting Card</span>
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-2">
            <CreditCard className="w-4 h-4 text-[#0f9d58]" />
            {paymentMethod.type} •••• {paymentMethod.last4}
          </span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <button 
              onClick={handleToggleAutoPay}
              className={`text-[10px] font-bold ${paymentMethod.autoPay ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-500 hover:text-slate-700'} underline`}
            >
              {paymentMethod.autoPay ? 'Auto-Pay: On' : 'Auto-Pay: Off'}
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">Quick Actions</span>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onMakePayment('auto', actualAuto)}
              className="flex-1 py-1.5 text-center bg-[#0f9d58] text-white text-[10px] font-bold rounded-lg hover:bg-[#0b8043] transition-colors"
            >
              Pay Auto
            </button>
            <button
              onClick={() => onMakePayment('home', actualHome)}
              className="flex-1 py-1.5 text-center bg-[#0f9d58] text-white text-[10px] font-bold rounded-lg hover:bg-[#0b8043] transition-colors"
            >
              Pay Home
            </button>
          </div>
        </div>
      </div>

      {/* 3. Splitted Cards - Auto vs Home Details & Cost Estimator Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (2/3 width) - Policies Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Auto Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="font-bold text-sm text-slate-900">Auto premium breakdown</h3>
                  <span className="px-2 py-0.5 bg-slate-50 text-slate-800 text-[10px] font-bold rounded-md">Accord</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Liability premium:</span>
                    <span className="font-semibold text-slate-800">${(actualAuto * 0.65).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Collision & Physical Damage:</span>
                    <span className="font-semibold text-slate-800">${(actualAuto * 0.35).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 border-t border-slate-100 pt-2 font-bold text-slate-800">
                    <span>Total Monthly Amount:</span>
                    <span>${actualAuto.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-100 pt-4 mt-4">
                <button
                  onClick={() => onUpdatePayment('auto')}
                  className="flex-1 py-2 text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                >
                  Change Card
                </button>
                <button
                  onClick={() => onMakePayment('auto', actualAuto)}
                  className="flex-1 py-2 text-center bg-white hover:bg-slate-50 border border-slate-200 text-[#0f9d58] text-[11px] font-bold rounded-lg transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>

            {/* Home Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="font-bold text-sm text-slate-900">Property premium breakdown</h3>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md">Maple St</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Dwelling Rebuild premium:</span>
                    <span className="font-semibold text-slate-800">${(actualHome * 0.70).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Personal liability pack:</span>
                    <span className="font-semibold text-slate-800">${(actualHome * 0.30).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 border-t border-slate-100 pt-2 font-bold text-slate-800">
                    <span>Total Monthly Amount:</span>
                    <span>${actualHome.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-100 pt-4 mt-4">
                <button
                  onClick={() => onUpdatePayment('home')}
                  className="flex-1 py-2 text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                >
                  Change Card
                </button>
                <button
                  onClick={() => onMakePayment('home', actualHome)}
                  className="flex-1 py-2 text-center bg-white hover:bg-slate-50 border border-slate-200 text-[#0f9d58] text-[11px] font-bold rounded-lg transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Transaction Log list */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-950">Billing Statement & Payments History</h3>
                <p className="text-xs text-slate-400">View premium records and print physical statement invoices</p>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={billingFilter}
                  onChange={(e) => setBillingFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 outline-none"
                >
                  <option value="all">All Statements</option>
                  <option value="auto">Auto Only</option>
                  <option value="home">Home Only</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 outline-none w-40 sm:w-48"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="text-center p-8 text-xs text-slate-400 border border-slate-100 rounded-xl bg-slate-50/50">
                No statement records correspond to current query filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-400 border-b border-slate-100 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Draft Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Premium Paid</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Invoices</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{p.date}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          <span className="font-semibold text-slate-700 block">{p.description}</span>
                          <span className="text-[10px] font-mono block">{p.policyName} ({p.policyNum})</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">${p.amount.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-1.5"></span>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedReceipt({ record: p, policyName: p.policyName, policyNumber: p.policyNum })}
                            className="text-[#0f9d58] hover:underline font-bold text-xs flex items-center justify-end ml-auto gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Statement</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width) - Cost Allocation Insight & AutoPay info */}
        <div className="space-y-6">
          {/* Allocation Insight Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-bold text-sm text-slate-900">Premium Allocation Fund</h4>
              <Percent className="w-4 h-4 text-[#0f9d58]" />
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              Wondering where your insurance premium dollars go? Here is exactly how your payments are distributed to secure coverages:
            </p>

            <div className="space-y-3">
              {/* Allocation 1 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Rebuild & Damage coverage (Home/Auto)</span>
                  <span>52%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[#0f9d58] h-full w-[52%]"></div>
                </div>
              </div>

              {/* Allocation 2 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Bodily Liability & Legal Defense fund</span>
                  <span>28%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[28%]"></div>
                </div>
              </div>

              {/* Allocation 3 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Medical payments & Personal Injured protection</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[15%]"></div>
                </div>
              </div>

              {/* Allocation 4 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>State taxes & administrative regulatory logs</span>
                  <span>5%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-[5%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 bg-[#e6f4ea] border border-slate-200 rounded-xl flex gap-2 text-[10px] text-slate-600">
              <Info className="w-3.5 h-3.5 text-[#0f9d58] shrink-0" />
              <span>Deductibles apply on a per-incident base and are subtracted from final claims paychecks.</span>
            </div>
          </div>

          {/* Secure Guarantee */}
          <div className="p-5 border border-slate-200/80 rounded-2xl bg-slate-50 space-y-3 text-center">
            <ShieldCheck className="w-8 h-8 text-[#0f9d58] mx-auto" />
            <h5 className="text-xs font-bold text-slate-800">ShieldGuard Secure Drafting Shield</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your payments are processed with standard Bank-level AES 256-bit encryption. Drafting will show on your bank statement as "SHIELDGUARD INDEMNITY PREMIUM PULL".
            </p>
          </div>
        </div>

      </div>

      {/* Printable Invoice Popups */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="bg-[#0f9d58] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span className="font-bold text-xs uppercase tracking-wider">ShieldGuard Statement Invoice</span>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-white/80 hover:text-white font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Receipt Body */}
              <div className="p-6 space-y-6 font-sans">
                {/* Logo and metadata */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 tracking-wider text-sm uppercase">SHIELDGUARD INSURANCE GROUP</h4>
                    <p className="text-[10px] text-slate-400">100 ShieldGuard Way • Baltimore, MD 21201</p>
                    <p className="text-[10px] text-slate-400">Customer Support: 1-800-458-0811</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase rounded-md block mb-1">
                      PAID STATEMENT
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">ID: {selectedReceipt.record.id}</span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Statement Issued To</span>
                      <strong className="text-slate-800 block mt-0.5">Alex Johnson</strong>
                      <span className="text-[10px] text-slate-400">Elkridge, MD 21075</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Draft Date</span>
                      <strong className="text-slate-800 block mt-0.5">{selectedReceipt.record.date}</strong>
                    </div>
                  </div>

                  <div className="border-t border-b border-slate-100 py-3 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 border-b border-slate-50 pb-2 mb-2">
                      <span>Description</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <div>
                        <span>{selectedReceipt.record.description}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Policy: {selectedReceipt.policyName} ({selectedReceipt.policyNumber})
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">${selectedReceipt.record.amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline text-slate-900 text-right">
                    <span className="text-xs text-slate-500 font-bold uppercase">Total Charged Draft:</span>
                    <span className="text-xl font-black text-slate-950">${selectedReceipt.record.amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Note */}
                <p className="text-[10px] text-slate-400 leading-relaxed text-center italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  This transaction represents an automatic draft charge securely drafted under ShieldGuard Automatic Payment enrollment rules from card ending in 4821. No further action is required.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="bg-slate-50 px-6 py-4 flex gap-3 justify-end border-t border-slate-100">
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 bg-[#0f9d58] hover:bg-[#0b8043] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Close Statement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
