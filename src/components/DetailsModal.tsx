import React from 'react';
import { X, Shield, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Policy } from '../types';

interface DetailsModalProps {
  policy: Policy;
  onClose: () => void;
}

export default function DetailsModal({ policy, onClose }: DetailsModalProps) {
  const isAuto = policy.type === 'auto';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="details-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        id="details-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--app-primary)] text-white">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 fill-white text-[var(--app-primary)]" />
            <h3 className="font-sans font-semibold text-lg">Policy Coverage Details</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors animate-pulse"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Policy Name</span>
              <strong className="text-base text-slate-800 font-sans block mt-0.5">{policy.title}</strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Policy Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 mt-1">
                {policy.status}
              </span>
            </div>
          </div>

          {/* Core Info list */}
          <div className="space-y-3.5 pt-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100">
              Contract Specifications
            </h4>
            
            <div className="grid grid-cols-2 gap-y-3 text-xs sm:text-sm">
              <div className="text-slate-500 font-medium">Policy number:</div>
              <div className="text-slate-800 font-mono font-semibold text-right">{policy.policyNumber}</div>

              <div className="text-slate-500 font-medium">Coverage scope:</div>
              <div className="text-slate-800 font-semibold text-right">{policy.coverage}</div>

              <div className="text-slate-500 font-medium">Monthly premium:</div>
              <div className="text-slate-800 font-semibold text-right">${policy.premium.toFixed(2)} / mo</div>

              <div className="text-slate-500 font-medium">Renewal schedule:</div>
              <div className="text-slate-800 font-medium text-right">{policy.renewalDate}</div>

              <div className="text-slate-500 font-medium">
                {isAuto ? 'Deductible limit:' : 'Property dwelling limit:'}
              </div>
              <div className="text-slate-800 font-semibold text-right">
                {isAuto 
                  ? `$${policy.deductible}` 
                  : `$${policy.dwellingLimit?.toLocaleString()}`
                }
              </div>
            </div>
          </div>

          {/* Coverages Breakdown details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100">
              Coverages Included
            </h4>

            {isAuto ? (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50/50 rounded-lg flex justify-between border border-slate-100">
                  <div>
                    <strong className="text-slate-800 block">Comprehensive Coverage</strong>
                    <span className="text-slate-500">Covers non-collision incidents like theft, fire, or animal damage.</span>
                  </div>
                  <span className="font-semibold text-slate-700 shrink-0">$500 Deductible</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 rounded-lg flex justify-between border border-slate-100">
                  <div>
                    <strong className="text-slate-800 block">Collision Coverage</strong>
                    <span className="text-slate-500">Covers repairs to your vehicle after a traffic accident.</span>
                  </div>
                  <span className="font-semibold text-slate-700 shrink-0">$500 Deductible</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 rounded-lg flex justify-between border border-slate-100">
                  <div>
                    <strong className="text-slate-800 block">Bodily Injury Liability</strong>
                    <span className="text-slate-500">Covers medical bills of injured parties if you cause an accident.</span>
                  </div>
                  <span className="font-semibold text-slate-700 shrink-0">$100k / $300k limit</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50/50 rounded-lg flex justify-between border border-slate-100">
                  <div>
                    <strong className="text-slate-800 block">Dwelling Protection</strong>
                    <span className="text-slate-500">Covers rebuild/repair cost of your primary home structure.</span>
                  </div>
                  <span className="font-semibold text-slate-700 shrink-0">$350,000 limit</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 rounded-lg flex justify-between border border-slate-100">
                  <div>
                    <strong className="text-slate-800 block">Personal Liability</strong>
                    <span className="text-slate-500">Covers lawsuits or accidental medical expenses of guests.</span>
                  </div>
                  <span className="font-semibold text-slate-700 shrink-0">$300,000 limit</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 rounded-lg flex justify-between border border-slate-100">
                  <div>
                    <strong className="text-slate-800 block">Loss of Use Coverage</strong>
                    <span className="text-slate-500">Covers temporary lodging costs if your home is uninhabitable.</span>
                  </div>
                  <span className="font-semibold text-slate-700 shrink-0">Up to 12 months</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
