import React from 'react';
import { X, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ResourceItem } from '../types';

interface ResourceModalProps {
  resource: ResourceItem;
  onClose: () => void;
}

export default function ResourceModal({ resource, onClose }: ResourceModalProps) {
  const isClaims = resource.category === 'CLAIMS';
  const isHome = resource.category === 'HOME';
  const isAuto = resource.category === 'AUTO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="resource-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        id="resource-modal"
      >
        {/* Color bar indicator */}
        <div className={`h-2 w-full ${
          isClaims ? 'bg-red-500' : isHome ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] font-bold tracking-wider uppercase block font-sans ${
                isClaims ? 'text-red-600' : isHome ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {resource.category} • {resource.type.toUpperCase()}
              </span>
              <h3 className="font-sans font-bold text-lg text-slate-900 mt-1 leading-snug">
                {resource.title}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic Content Details */}
          <div className="text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed font-sans">
            <p className="font-medium text-slate-800">{resource.description}</p>

            {isClaims && (
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900">Step-by-Step Claims Process:</h4>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Document the Scene:</strong> Take clear photographs of any damages or vehicle collisions safely.
                  </li>
                  <li>
                    <strong>Submit the Report:</strong> Use our portal’s <em>File a Claim</em> form to attach incident photos and loss details.
                  </li>
                  <li>
                    <strong>Adjuster Review:</strong> A licensed ShieldGuard claims specialist will review your report and inspect damage.
                  </li>
                  <li>
                    <strong>Resolution & Drafts:</strong> Approved payments will be drafted or direct-deposited to complete repair works.
                  </li>
                </ol>
              </div>
            )}

            {isHome && (
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900">Checking your Dwelling Protection Limits:</h4>
                <p>
                  Rebuild costs have risen steadily due to supply costs and labor market changes. If your home coverage limit was determined years ago, you might be underinsured.
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>
                    <strong>Regular Audits:</strong> Review structural extensions, roofing updates, or remodeling values.
                  </li>
                  <li>
                    <strong>Extended Replacement Cost:</strong> Check if your policy has a buffer limit extension (e.g. 125% structural cost protection).
                  </li>
                  <li>
                    <strong>Agent Consult:</strong> Speak with <strong>Michael Reardon</strong> to estimate localized building costs.
                  </li>
                </ul>
              </div>
            )}

            {isAuto && (
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900">Accident Response Checklist:</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>
                    <strong>Safety First:</strong> Guide your car to a safe shoulder and switch hazard flashers on immediately.
                  </li>
                  <li>
                    <strong>Exchange Details:</strong> Capture the name, phone number, vehicle plate, and insurance policy of other drivers.
                  </li>
                  <li>
                    <strong>Law Enforcement:</strong> Request a local police report even for minor traffic incidents.
                  </li>
                  <li>
                    <strong>Take Notes:</strong> Write down precise weather conditions, street names, and passenger details.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer Close */}
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
