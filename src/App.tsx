import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PortfolioPage from './components/PortfolioPage';
import PoliciesPage from './components/PoliciesPage';
import BillingPage from './components/BillingPage';
import ClaimsPage from './components/ClaimsPage';
import DocumentsPage from './components/DocumentsPage';
import HelpPage from './components/HelpPage';

// Modals
import IdCardModal from './components/IdCardModal';
import ClaimModal from './components/ClaimModal';
import PaymentModal from './components/PaymentModal';
import DetailsModal from './components/DetailsModal';
import DocsModal from './components/DocsModal';
import BundleModal from './components/BundleModal';
import ResourceModal from './components/ResourceModal';

// Mock Data Loaders
import {
  INITIAL_POLICIES,
  INITIAL_AGENT,
  INITIAL_OFFERS,
  INITIAL_AUTO_PAYMENTS,
  INITIAL_HOME_PAYMENTS,
  INITIAL_RESOURCES,
  INITIAL_CLAIMS,
  getStoredData,
  setStoredData
} from './data/mockData';
import { Policy, Claim, PaymentRecord, Offer, ResourceItem } from './types';
import { Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation & Filtering
  const [currentTab, setCurrentTab] = useState('portfolio');
  const [searchQuery, setSearchQuery] = useState('');

  // Domain States (persisted)
  const [policies, setPolicies] = useState<Policy[]>(() => 
    getStoredData('policies', INITIAL_POLICIES)
  );
  const [autoPayments, setAutoPayments] = useState<PaymentRecord[]>(() => 
    getStoredData('auto_payments', INITIAL_AUTO_PAYMENTS)
  );
  const [homePayments, setHomePayments] = useState<PaymentRecord[]>(() => 
    getStoredData('home_payments', INITIAL_HOME_PAYMENTS)
  );
  const [paymentMethod, setPaymentMethod] = useState(() => 
    getStoredData('payment_method', { type: 'Visa', last4: '4821', autoPay: true })
  );
  const [claims, setClaims] = useState<Claim[]>(() => 
    getStoredData('claims', INITIAL_CLAIMS)
  );
  const [paperlessOffer, setPaperlessOffer] = useState<Offer>(() => 
    getStoredData('paperless_offer', INITIAL_OFFERS[0])
  );
  const [isBundleApplied, setIsBundleApplied] = useState(() => 
    getStoredData('bundle_applied', false)
  );

  // Modal Control States
  const [activeIdCardPolicy, setActiveIdCardPolicy] = useState<Policy | null>(null);
  const [activeDetailsPolicy, setActiveDetailsPolicy] = useState<Policy | null>(null);
  const [activeDocsPolicy, setActiveDocsPolicy] = useState<Policy | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [activePaymentMode, setActivePaymentMode] = useState<{ mode: 'pay' | 'update'; type: 'auto' | 'home' | 'all'; amount?: number } | null>(null);
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);

  // Application feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const footerLogoSrc = `${import.meta.env.BASE_URL}shieldguard-logo.png`;

  // Persist states automatically when changed
  useEffect(() => {
    setStoredData('policies', policies);
  }, [policies]);

  useEffect(() => {
    setStoredData('auto_payments', autoPayments);
  }, [autoPayments]);

  useEffect(() => {
    setStoredData('home_payments', homePayments);
  }, [homePayments]);

  useEffect(() => {
    setStoredData('payment_method', paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    setStoredData('claims', claims);
  }, [claims]);

  useEffect(() => {
    setStoredData('paperless_offer', paperlessOffer);
  }, [paperlessOffer]);

  useEffect(() => {
    setStoredData('bundle_applied', isBundleApplied);
  }, [isBundleApplied]);

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // State Mutators
  const handleTogglePaperless = () => {
    const updated = { ...paperlessOffer, active: !paperlessOffer.active };
    setPaperlessOffer(updated);
    showToast(
      updated.active 
        ? "Paperless Billing activated! $3.00 monthly discount applied." 
        : "Paperless Billing deactivated."
    );
  };

  const handleApplyBundle = () => {
    setIsBundleApplied(true);
    showToast("ShieldGuard Insurance Bundle discount successfully applied to active policies!");
  };

  const handleUpdatePaymentSuccess = (method: { type: string; last4: string; autoPay: boolean }) => {
    setPaymentMethod(method);
    setActivePaymentMode(null);
    showToast(`Payment method successfully updated to ${method.type} •••• ${method.last4}`);
  };

  const handlePaymentSuccess = (policyType: 'auto' | 'home', amount: number) => {
    const newRecord: PaymentRecord = {
      id: `p_new_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: 'One-time premium payment',
      amount,
      status: 'Paid'
    };

    if (policyType === 'auto') {
      setAutoPayments(prev => [newRecord, ...prev]);
    } else {
      setHomePayments(prev => [newRecord, ...prev]);
    }
    setActivePaymentMode(null);
    showToast(`Successfully processed payment of $${amount.toFixed(2)} for ${policyType.toUpperCase()} policy.`);
  };

  const handleClaimSubmit = (claimData: Omit<Claim, 'id'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim_${Date.now()}`
    };
    setClaims(prev => [newClaim, ...prev]);
    setIsClaimModalOpen(false);
    showToast(`Claims Report successfully submitted for ${claimData.policyTitle}. Reference registered.`);
  };

  return (
    <div className="app-shell font-sans selection:bg-[#0f9d58]/20" id="portal-root">
      
      {/* Header and Quick Navigation / Search */}
      <Header
        onSearch={setSearchQuery}
        onFileClaim={() => {
          setCurrentTab('claims');
          setIsClaimModalOpen(true);
        }}
        onMakePayment={() => {
          setCurrentTab('billing');
          setActivePaymentMode({ mode: 'pay', type: 'auto', amount: 142.00 });
        }}
        onViewPolicies={() => {
          setCurrentTab('policies');
        }}
        onDownloadIdCard={() => {
          setCurrentTab('documents');
        }}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 space-y-10 w-full">
        
        {/* Render Dedicated tab views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            id="tab-content-container"
          >
            {currentTab === 'portfolio' && (
              <PortfolioPage
                policies={policies}
                claims={claims}
                autoPayments={autoPayments}
                homePayments={homePayments}
                paymentMethod={paymentMethod}
                paperlessOffer={paperlessOffer}
                onTogglePaperless={handleTogglePaperless}
                onIdCardClick={setActiveIdCardPolicy}
                onDetailsClick={setActiveDetailsPolicy}
                onDocumentsClick={setActiveDocsPolicy}
                onNavigateToTab={setCurrentTab}
                onMakePaymentClick={(type, amount) => {
                  setActivePaymentMode({ mode: 'pay', type, amount });
                }}
                isBundleApplied={isBundleApplied}
                onLearnMorePaperless={() => {
                  showToast("Switch to paperless to clear up physical mail and save $36/year across policies.");
                }}
                agent={INITIAL_AGENT}
                onContactAgent={() => {
                  showToast(`Contact email sent to Michael Reardon at ${INITIAL_AGENT.email}`);
                }}
              />
            )}

            {currentTab === 'policies' && (
              <PoliciesPage
                policies={policies}
                setPolicies={setPolicies}
                isPaperlessActive={paperlessOffer.active}
                onIdCardClick={setActiveIdCardPolicy}
                onDetailsClick={setActiveDetailsPolicy}
                onDocumentsClick={setActiveDocsPolicy}
                onFileClaimClick={(policy) => {
                  setCurrentTab('claims');
                  setIsClaimModalOpen(true);
                }}
                showToast={showToast}
              />
            )}

            {currentTab === 'billing' && (
              <BillingPage
                policies={policies}
                autoPayments={autoPayments}
                homePayments={homePayments}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                isPaperlessActive={paperlessOffer.active}
                onUpdatePayment={(type) => {
                  setActivePaymentMode({ mode: 'update', type });
                }}
                onMakePayment={(type, amount) => {
                  setActivePaymentMode({ mode: 'pay', type, amount });
                }}
                showToast={showToast}
              />
            )}

            {currentTab === 'claims' && (
              <ClaimsPage
                claims={claims}
                policies={policies}
                onFileClaimClick={() => setIsClaimModalOpen(true)}
                showToast={showToast}
              />
            )}

            {currentTab === 'documents' && (
              <DocumentsPage
                showToast={showToast}
              />
            )}

            {currentTab === 'help' && (
              <HelpPage
                policies={policies}
                agent={INITIAL_AGENT}
                showToast={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bundle Banner */}
        <div className="bg-[#0f9d58] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md" id="bundle-save-banner">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-sans">
              Bundle and save up to 25%
            </h3>
            <p className="text-sm text-slate-100 font-sans max-w-lg">
              Pair two or more policies, like Auto and Home together, and start saving on your premiums today.
            </p>
          </div>
          <button
            onClick={() => setIsBundleModalOpen(true)}
            className="px-6 py-3.5 bg-white hover:bg-[#e6f4ea] border border-[#b7dfc2] rounded-xl text-[#0f9d58] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            id="btn-learn-bundles"
          >
            Learn about bundles
          </button>
        </div>
      </main>

      {/* Footer block */}
      <footer className="w-full bg-[#1a202c] text-slate-400 text-xs py-10 mt-16 border-t border-slate-800" id="portal-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-6 gap-4">
            {/* Brand */}
            <div className="flex items-center space-x-2 bg-transparent">
              <img
                src={footerLogoSrc}
                alt="ShieldGuard logo"
                width={168}
                height={48}
                className="object-contain"
              />
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-slate-400">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast("Displaying Privacy Policy statements."); }} className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); showToast("Displaying Terms of Service."); }} className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#accessibility" onClick={(e) => { e.preventDefault(); showToast("Displaying Accessibility resources."); }} className="hover:text-white transition-colors">Accessibility</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); showToast(`Contacting headquarters support desk at 1-800-458-0811.`); }} className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>

          {/* Legal notes */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2">
            <p>© 2026 @valuemomentum. All rights reserved.</p>            
          </div>
        </div>
      </footer>

      {/* Dynamic Popups Modals Overlay */}
      <AnimatePresence>
        {/* Toast Feedback */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1a202c] text-white text-xs py-3 px-5 rounded-xl border border-slate-800 shadow-2xl flex items-center space-x-2.5 max-w-sm"
          >
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <span className="font-sans font-medium">{toastMessage}</span>
          </motion.div>
        )}

        {/* Id Card Modal */}
        {activeIdCardPolicy && (
          <IdCardModal
            policy={activeIdCardPolicy}
            onClose={() => setActiveIdCardPolicy(null)}
          />
        )}

        {/* Details Modal */}
        {activeDetailsPolicy && (
          <DetailsModal
            policy={activeDetailsPolicy}
            onClose={() => setActiveDetailsPolicy(null)}
          />
        )}

        {/* Docs Modal */}
        {activeDocsPolicy && (
          <DocsModal
            policy={activeDocsPolicy}
            onClose={() => setActiveDocsPolicy(null)}
          />
        )}

        {/* Claim Modal */}
        {isClaimModalOpen && (
          <ClaimModal
            policies={policies}
            onClose={() => setIsClaimModalOpen(false)}
            onSubmitClaim={handleClaimSubmit}
          />
        )}

        {/* Payment Modal */}
        {activePaymentMode && (
          <PaymentModal
            mode={activePaymentMode.mode}
            policyType={activePaymentMode.type}
            defaultAmount={activePaymentMode.amount}
            paymentMethod={paymentMethod}
            onClose={() => setActivePaymentMode(null)}
            onPaymentSuccess={handlePaymentSuccess}
            onUpdatePaymentSuccess={handleUpdatePaymentSuccess}
          />
        )}

        {/* Resource detail popup */}
        {activeResource && (
          <ResourceModal
            resource={activeResource}
            onClose={() => setActiveResource(null)}
          />
        )}

        {/* Bundle Save modal */}
        {isBundleModalOpen && (
          <BundleModal
            onClose={() => setIsBundleModalOpen(false)}
            onApplyBundle={handleApplyBundle}
            isBundleApplied={isBundleApplied}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
