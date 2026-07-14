import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  FileCheck2, 
  AlertCircle, 
  Info,
  Layers,
  Sparkles,
  Lock,
  Signature
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentsPageProps {
  showToast: (message: string) => void;
}

interface VaultItem {
  id: string;
  title: string;
  category: 'policies' | 'billing' | 'claims';
  date: string;
  fileSize: string;
  status: 'Ready' | 'Pending Signature' | 'Signed';
  description: string;
}

export default function DocumentsPage({ showToast }: DocumentsPageProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'policies' | 'billing' | 'claims'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // PDF Vault Files State (including dynamic electronic signing status!)
  const [documents, setDocuments] = useState<VaultItem[]>([
    {
      id: 'doc_1',
      title: 'ShieldGuard Auto Policy Declarations Page (2025-2026)',
      category: 'policies',
      date: 'Sep 14, 2025',
      fileSize: '2.4 MB',
      status: 'Ready',
      description: 'Official schedule of coverages, policy limits, and deductibles for the 2021 Honda Accord.'
    },
    {
      id: 'doc_2',
      title: 'Homeowners Policy Declarations Schedule',
      category: 'policies',
      date: 'Mar 1, 2026',
      fileSize: '3.1 MB',
      status: 'Ready',
      description: 'Official schedule detailing property limits, personal liability caps, and deductible parameters.'
    },
    {
      id: 'doc_3',
      title: 'ShieldGuard Auto Identification Cards - Accord',
      category: 'policies',
      date: 'Sep 14, 2025',
      fileSize: '1.2 MB',
      status: 'Ready',
      description: 'Printable standard wallet-sized insurance cards for glove-box storage.'
    },
    {
      id: 'doc_4',
      title: 'June Premium Statement & Invoice',
      category: 'billing',
      date: 'Jun 1, 2026',
      fileSize: '680 KB',
      status: 'Ready',
      description: 'Monthly receipt of premiums paid for auto and home combined accounts.'
    },
    {
      id: 'doc_5',
      title: '2026 Policy Renewal & Signature Packet',
      category: 'policies',
      date: 'Jun 20, 2026',
      fileSize: '1.8 MB',
      status: 'Pending Signature',
      description: 'Pending legal agreement acknowledging annual coverage continuation rules.'
    },
    {
      id: 'doc_6',
      title: 'Bumper scraping Damage Valuation report',
      category: 'claims',
      date: 'Feb 15, 2026',
      fileSize: '1.6 MB',
      status: 'Ready',
      description: 'Official parts inventory and authorized body shop repair payouts estimate schedule.'
    },
    {
      id: 'doc_7',
      title: '2025 Annual Tax Premium Summary log',
      category: 'billing',
      date: 'Jan 02, 2026',
      fileSize: '1.1 MB',
      status: 'Ready',
      description: 'Summarized payments logs eligible for tax deductibles schedules.'
    }
  ]);

  // Download simulation progress states
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Signing Modal State
  const [signingDoc, setSigningDoc] = useState<VaultItem | null>(null);
  const [signerName, setSignerName] = useState('Alex Johnson');
  const [signerInitials, setSignerInitials] = useState('AJ');
  const [drawSignature, setDrawSignature] = useState(false); // drawing pad checkbox

  // Filtering
  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeFilter === 'all' || doc.category === activeFilter;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Download logic
  const handleSimulateDownload = (doc: VaultItem) => {
    if (downloadingDocId) return;
    setDownloadingDocId(doc.id);
    setDownloadProgress(10);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingDocId(null);
            showToast(`PDF file "${doc.title}" downloaded successfully! Saved to downloads folder.`);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  // Sign Document logic
  const handleSignDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingDoc) return;

    setDocuments(prev => prev.map(doc => {
      if (doc.id === signingDoc.id) {
        return {
          ...doc,
          status: 'Signed',
          title: `${doc.title} (SIGNED)`
        };
      }
      return doc;
    }));

    const signedTitle = signingDoc.title;
    setSigningDoc(null);
    showToast(`Successfully signed electronically as "${signerName}". Renewal document authorized!`);
  };

  return (
    <div className="space-y-8" id="documents-vault-wrapper">
      {/* 1. Page Header */}
      <div>
        <span className="text-xs font-bold tracking-wider text-[var(--app-primary)] block uppercase font-sans">Secure PDF Vault</span>
        <h1 className="text-2xl sm:text-3xl font-sans font-medium text-slate-900 mt-1">ShieldGuard Documents Vault</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans">View, print, or download electronic PDFs of policy binders and statements</p>
      </div>

      {/* 2. Double Splitted Category Selector & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-50 border border-slate-200/40 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'all' 
                ? 'bg-[var(--app-primary)] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Folders ({documents.length})
          </button>
          <button
            onClick={() => setActiveFilter('policies')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'policies' 
                ? 'bg-[var(--app-primary)] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Policies
          </button>
          <button
            onClick={() => setActiveFilter('billing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'billing' 
                ? 'bg-[var(--app-primary)] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Billing/Invoices
          </button>
          <button
            onClick={() => setActiveFilter('claims')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'claims' 
                ? 'bg-[var(--app-primary)] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search within file names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* 3. Main Documents Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No PDFs matched your search in the current directory.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => {
              const isDownloading = downloadingDocId === doc.id;
              const isPending = doc.status === 'Pending Signature';
              const isSigned = doc.status === 'Signed';

              return (
                <div 
                  key={doc.id}
                  className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* File Metadata */}
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="p-3 bg-slate-50 text-[var(--app-primary)] rounded-xl shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{doc.title}</h4>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-500 rounded-md uppercase">
                          {doc.category}
                        </span>
                        {isPending && (
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md uppercase animate-pulse flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Action Required</span>
                          </span>
                        )}
                        {isSigned && (
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>E-Signed</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-2xl">{doc.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span>Issued: <strong className="text-slate-600">{doc.date}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-slate-600">{doc.fileSize}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Drawer */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {isPending ? (
                      <button
                        onClick={() => setSigningDoc(doc)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1"
                      >
                        <Signature className="w-3.5 h-3.5" />
                        <span>Sign Pack</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSimulateDownload(doc)}
                        disabled={isDownloading}
                        className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                          isDownloading 
                            ? 'bg-slate-50 text-[var(--app-primary)] border border-slate-200 cursor-not-allowed' 
                            : 'bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white shadow-xs'
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <span className="w-3 h-3 border-2 border-[var(--app-primary)] border-t-transparent rounded-full animate-spin"></span>
                            <span>{downloadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signing Modal (Electronic Signature form) */}
      <AnimatePresence>
        {signingDoc && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-300 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative"
            >
              <div className="bg-[var(--app-primary)] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Signature className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-wider">ShieldGuard electronic signing pad</span>
                </div>
                <button
                  onClick={() => setSigningDoc(null)}
                  className="text-white/80 hover:text-white font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSignDocument} className="p-6 space-y-5 font-sans">
                <div>
                  <span className="text-[10px] text-slate-700 font-bold uppercase block tracking-wider mb-1">Electronic Signature Request</span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{signingDoc.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    By completing the electronic signature box below, you legally verify to continue coverages under the ShieldGuard Indemnity 2026 guidelines.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Signer Legal Name</label>
                    <input
                      type="text"
                      required
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Initials</label>
                      <input
                        type="text"
                        maxLength={3}
                        required
                        value={signerInitials}
                        onChange={(e) => setSignerInitials(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 text-center outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
                      />
                    </div>
                    
                    {/* Simulated canvas checkbox */}
                    <div className="col-span-2 flex flex-col justify-end">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer mb-2.5">
                        <input
                          type="checkbox"
                          checked={drawSignature}
                          onChange={(e) => setDrawSignature(e.target.checked)}
                          className="rounded border-slate-300 text-[var(--app-primary)] focus:ring-[var(--app-primary)]"
                        />
                        <span>Draw signature pad</span>
                      </label>
                    </div>
                  </div>

                  {drawSignature && (
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 text-center">
                      <span className="text-[10px] text-slate-400 block mb-3 font-medium">Use mouse or touch finger to write signature</span>
                      <div className="h-20 bg-white border border-slate-100 rounded-lg flex items-center justify-center font-serif text-slate-400 italic text-sm relative overflow-hidden select-none">
                        {signerName ? (
                          <span className="text-slate-800 text-lg tracking-wider opacity-80 font-playfair">
                            {signerName}
                          </span>
                        ) : (
                          <span>Sign here</span>
                        )}
                        <div className="absolute bottom-2 right-2 text-[8px] font-mono uppercase bg-slate-100 p-1 rounded-sm text-slate-400">
                          PAD ACTIVE
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-[var(--app-primary-soft)] border border-slate-200 rounded-xl flex gap-2 text-[10px] text-slate-600 leading-relaxed">
                  <Lock className="w-4 h-4 text-[var(--app-primary)] shrink-0" />
                  <span>Secure electronic signatures are compliant with the federal ESIGN Act of 2000 and have standard legally binding properties.</span>
                </div>

                <div className="pt-2 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setSigningDoc(null)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Authorize E-Signature
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
