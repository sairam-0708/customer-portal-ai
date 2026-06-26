import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Shield, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentModalProps {
  mode: 'pay' | 'update';
  policyType?: 'auto' | 'home' | 'all';
  defaultAmount?: number;
  paymentMethod: { type: string; last4: string; autoPay: boolean };
  onClose: () => void;
  onPaymentSuccess?: (policyType: 'auto' | 'home', amount: number) => void;
  onUpdatePaymentSuccess?: (method: { type: string; last4: string; autoPay: boolean }) => void;
}

export default function PaymentModal({
  mode,
  policyType = 'auto',
  defaultAmount = 142.00,
  paymentMethod,
  onClose,
  onPaymentSuccess,
  onUpdatePaymentSuccess
}: PaymentModalProps) {
  // Make a payment states
  const [payAmount, setPayAmount] = useState(defaultAmount.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Update payment states
  const [cardBrand, setCardBrand] = useState(paymentMethod.type);
  const [cardNumber, setCardNumber] = useState(`•••• •••• •••• ${paymentMethod.last4}`);
  const [autoPayChecked, setAutoPayChecked] = useState(paymentMethod.autoPay);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || parseFloat(payAmount) <= 0) return;

    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaySuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(
          policyType === 'home' ? 'home' : 'auto',
          parseFloat(payAmount)
        );
      }
    }, 1500);
  };

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = cardNumber.slice(-4);
    if (onUpdatePaymentSuccess) {
      onUpdatePaymentSuccess({
        type: cardBrand,
        last4: isNaN(Number(last4)) ? paymentMethod.last4 : last4,
        autoPay: autoPayChecked
      });
    }
    setUpdateSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="payment-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        id="payment-modal"
      >
        <AnimatePresence mode="wait">
          {mode === 'pay' ? (
            !paySuccess ? (
              <motion.div key="pay-form" className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-bold text-lg text-slate-900">
                      Make Premium Payment
                    </h3>
                  </div>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleMakePayment} className="space-y-4" id="premium-pay-form">
                  {/* Amount Indicator */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                      Payment Amount (USD)
                    </label>
                    <div className="relative rounded-lg border border-slate-300 flex items-center overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
                      <span className="pl-3.5 pr-1.5 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="w-full border-0 py-3 px-1 text-slate-800 text-base font-semibold outline-none focus:ring-0"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Paying premium balance for {policyType === 'home' ? 'Home (412 Maple Street)' : 'Auto (2021 Honda Accord)'}
                    </span>
                  </div>

                  {/* Funding Source Display */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block font-bold text-[9px] mb-1">
                        Paying with Card
                      </span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5 font-sans text-sm">
                        <CreditCard className="w-4 h-4 text-[#0f9d58]" />
                        {paymentMethod.type} •••• {paymentMethod.last4}
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                      Auto-pay ready
                    </span>
                  </div>

                  {/* Security Statement */}
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 leading-normal">
                    <Shield className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>Your transaction is encrypted securely. Funds will be drafted from your primary account.</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2.5 px-4 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center min-w-[120px]"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <span>Pay ${parseFloat(payAmount || '0').toFixed(2)}</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="pay-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 font-sans">Payment Approved</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto font-sans">
                    Thank you! We have received your payment of <strong>${parseFloat(payAmount).toFixed(2)}</strong>. Your digital statement and payment history are updated.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="py-2.5 px-5 bg-[#0f9d58] text-white rounded-lg text-xs font-semibold"
                >
                  Close Window
                </button>
              </motion.div>
            )
          ) : (
            /* UPDATE PAYMENT METHOD MODE */
            <motion.div key="update-form" className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-700">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-slate-900">
                    Update Payment Method
                  </h3>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {updateSuccess ? (
                <div className="p-4 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Payment Method Updated</h4>
                  <p className="text-xs text-slate-500">Your billing profile has been modified successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleUpdatePayment} className="space-y-4" id="update-billing-method-form">
                  {/* Select card brand */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                      Card Provider
                    </label>
                    <select
                      value={cardBrand}
                      onChange={(e) => setCardBrand(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg py-2 px-3 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[#0f9d58] focus:border-transparent outline-none"
                    >
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>Amex</option>
                      <option>Discover</option>
                    </select>
                  </div>

                  {/* Card Number Input (mask) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4821"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg py-2.5 px-3 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[#0f9d58] focus:border-transparent outline-none font-mono"
                      required
                    />
                  </div>

                  {/* Auto-pay toggle */}
                  <div className="flex items-center space-x-2.5 pt-1.5">
                    <input
                      type="checkbox"
                      id="autoPayToggle"
                      checked={autoPayChecked}
                      onChange={(e) => setAutoPayChecked(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="autoPayToggle" className="text-xs font-semibold text-slate-700 cursor-pointer select-none font-sans">
                      Enroll in monthly Auto-Pay for discount
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2.5 px-4 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-[#0f9d58] hover:bg-[#0b8043] text-white rounded-lg text-xs font-semibold transition-all shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
