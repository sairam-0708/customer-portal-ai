import React from 'react';
import { Offer } from '../types';
import { Mail, Check, Gift, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OffersSectionProps {
  offer: Offer;
  onTogglePaperless: () => void;
  onLearnMore: (offer: Offer) => void;
}

export default function OffersSection({ offer, onTogglePaperless, onLearnMore }: OffersSectionProps) {
  return (
    <div className="flex flex-col space-y-6" id="offers-section">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-600 block uppercase font-sans">
            EXCLUSIVE FOR YOU
          </span>
          <h2 className="text-2xl font-sans font-medium text-slate-900 mt-0.5">
            My Offers
          </h2>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center space-x-1 hover:underline">
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Offer Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border p-6 space-y-4 transition-all duration-300 ${
          offer.active
            ? 'bg-emerald-50/40 border-emerald-200 shadow-sm'
            : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
        }`}
        id="offer-card-paperless"
      >
        {/* Top Details & Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
              offer.active 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                : 'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[15px] sm:text-base text-slate-900 leading-snug">
                {offer.title}
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {offer.subtitle}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              offer.active 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-blue-100 text-[#004f8f] border border-blue-200'
            }`}>
              Save ${offer.savingsYearly} / yr
            </span>
          </div>
        </div>

        {/* Description Text */}
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          {offer.description}
        </p>

        {/* Dynamic Warning of Savings Applied */}
        {offer.active && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xs bg-emerald-100/60 border border-emerald-200 rounded-lg p-2.5 text-emerald-800 font-medium flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Success! Paperless discount of <strong>$3.00/mo</strong> is now applied to your active policies!</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3" id="offer-actions-bar">
          <button
            onClick={() => onLearnMore(offer)}
            className="flex-1 py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 text-center transition-all cursor-pointer shadow-2xs"
            id="btn-offer-learn"
          >
            Learn more
          </button>

          <button
            onClick={onTogglePaperless}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer flex items-center justify-center space-x-1 border ${
              offer.active
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs'
                : 'bg-white hover:bg-[#e6f0fa] border-slate-200 hover:border-blue-300 text-slate-700 shadow-2xs'
            }`}
            id="btn-offer-toggle"
          >
            {offer.active ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                <span>Go paperless</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                <span>Go paperless</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
