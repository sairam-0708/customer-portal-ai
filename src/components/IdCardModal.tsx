import React, { useRef } from 'react';
import { X, Shield, Printer, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { Policy } from '../types';

interface IdCardModalProps {
  policy: Policy;
  onClose: () => void;
}

export default function IdCardModal({ policy, onClose }: IdCardModalProps) {
  const [copied, setCopied] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(policy.policyNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = cardRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      const win = window.open('', '', 'height=500,width=800');
      win?.document.write(`
        <html>
          <head>
            <title>ShieldGuard Insurance ID Card</title>
            <style>
              body { font-family: sans-serif; padding: 40px; }
              .card { border: 2px solid #004f8f; border-radius: 8px; padding: 24px; max-width: 500px; margin: 0 auto; }
              .header { border-bottom: 2px solid #004f8f; padding-bottom: 12px; margin-bottom: 16px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
              .full { grid-column: span 2; }
              .label { color: #666; font-size: 11px; margin-bottom: 2px; text-transform: uppercase; }
              .value { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="card">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      win?.document.close();
      win?.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="id-card-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        id="id-card-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#004f8f] text-white">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 fill-white text-[#004f8f]" />
            <h3 className="font-sans font-semibold text-lg">Digital Insurance ID Card</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            id="close-id-card-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Canvas */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-500 font-sans">
            Carry this proof of coverage on your mobile device or print it for your vehicle dashboard.
          </p>

          {/* Printable Card area */}
          <div 
            ref={cardRef}
            className="border-2 border-[#004f8f] rounded-xl p-5 bg-slate-50 relative overflow-hidden shadow-inner"
            id="id-card-canvas"
          >
            {/* Watermark logo */}
            <div className="absolute right-4 bottom-4 opacity-[0.03] select-none pointer-events-none">
              <Shield className="w-48 h-48 text-[#004f8f]" />
            </div>

            {/* Top Row Logo */}
            <div className="flex justify-between items-start border-b border-[#004f8f]/30 pb-3 mb-4">
              <div>
                <span className="font-bold text-lg tracking-wider text-[#004f8f] block font-sans">S H I E L D G U A R D</span>
                <span className="text-[9px] tracking-widest text-slate-500 uppercase block font-mono">INSURANCE COMPANY</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-sans block">STATE</span>
                <span className="text-xs font-bold text-slate-700 font-sans uppercase">MARYLAND (MD)</span>
              </div>
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-sans">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Policyholder</span>
                <strong className="text-slate-800 text-sm">Alex Mercer</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Policy number</span>
                <div className="flex items-center space-x-1">
                  <strong className="text-slate-800 text-sm font-mono">{policy.policyNumber}</strong>
                  <button 
                    onClick={handleCopy}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
                    title="Copy Policy Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Vehicle Details</span>
                <strong className="text-slate-800 text-sm">{policy.title}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Effective Date</span>
                <strong className="text-slate-800">Sep 14, 2025</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Expiration Date</span>
                <strong className="text-slate-800">Sep 14, 2026</strong>
              </div>

              <div className="col-span-2 border-t border-[#004f8f]/10 pt-3 flex justify-between items-center text-[10px] text-slate-500">
                <span>Subject to policy provisions and limits</span>
                <span className="font-mono">NAIC Code: 26271</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 bg-[#004f8f] hover:bg-[#003c6e] text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              id="print-proof-btn"
            >
              <Printer className="w-4 h-4" />
              <span>Print Proof Card</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all border border-slate-200 cursor-pointer"
              id="cancel-proof-btn"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
