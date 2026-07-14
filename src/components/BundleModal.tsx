import React from 'react';
import { X, ShieldCheck, Gift, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BundleModalProps {
  onClose: () => void;
  onApplyBundle: () => void;
  isBundleApplied: boolean;
}

export default function BundleModal({ onClose, onApplyBundle, isBundleApplied }: BundleModalProps) {
  const [success, setSuccess] = React.useState(false);

  const handleApply = () => {
    onApplyBundle();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="bundle-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        id="bundle-modal"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--app-primary)] text-white">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 fill-white text-[var(--app-primary)]" />
            <h3 className="font-sans font-semibold text-lg">ShieldGuard Bundle Planner</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success ? (
            <div className="p-4 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Bundle Discount Activated!</h4>
              <p className="text-xs text-slate-500">Your policy premiums reflect the bundled pricing.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect your Auto and Home coverages into a ShieldGuard Bundle to instantly receive deep premium discounts of up to 25% annually.
              </p>

              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <strong className="text-sm text-slate-800 block">Current Multi-Policy Discount</strong>
                    <span className="text-xs text-slate-500">Auto + Home bundled premium discount.</span>
                  </div>
                  <span className="text-xs bg-slate-100 text-[var(--app-primary)] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                    {isBundleApplied ? '15% Active' : 'Eligible'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <strong className="text-sm text-slate-800 block">Add umbrella coverage</strong>
                    <span className="text-xs text-slate-500">Get an extra 5% off across all active policies.</span>
                  </div>
                  <button className="text-xs text-[var(--app-primary)] font-semibold hover:underline">
                    Add +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="py-2.5 px-5 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <span>{isBundleApplied ? 'Update Plan' : 'Apply Bundle'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
