import React from 'react';
import { X, FileText, Download, Printer, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Policy } from '../types';

interface DocsModalProps {
  policy: Policy;
  onClose: () => void;
}

export default function DocsModal({ policy, onClose }: DocsModalProps) {
  const [downloadingDocId, setDownloadingDocId] = React.useState<string | null>(null);

  const mockDocs = [
    { id: 'doc_dec', title: 'Policy Declaration Page', date: 'Mar 1, 2026', size: '1.2 MB' },
    { id: 'doc_bind', title: 'Insurance Policy Binder', date: 'Feb 15, 2026', size: '450 KB' },
    { id: 'doc_bill_1', title: 'Billing Statement - June 2026', date: 'Jun 1, 2026', size: '210 KB' },
    { id: 'doc_bill_2', title: 'Billing Statement - May 2026', date: 'May 1, 2026', size: '205 KB' }
  ];

  const handleDownload = (docId: string, docTitle: string) => {
    setDownloadingDocId(docId);
    setTimeout(() => {
      setDownloadingDocId(null);
      // Simulate simple browser download
      alert(`Successfully downloaded document: ${docTitle}`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="docs-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        id="docs-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f9d58] text-white">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 fill-white text-[#0f9d58]" />
            <h3 className="font-sans font-semibold text-lg">Digital Documents Vault</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider font-sans">Policy Scope</span>
            <strong className="text-base text-slate-800 font-sans">{policy.title} Documents</strong>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            {mockDocs.map((doc) => {
              const isDownloading = downloadingDocId === doc.id;

              return (
                <div 
                  key={doc.id}
                  className="p-3.5 flex items-center justify-between bg-white text-xs hover:bg-slate-50 transition-colors"
                  id={`doc-row-${doc.id}`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-slate-50 text-[#0f9d58] rounded-lg shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm leading-tight">{doc.title}</h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                        Generated: {doc.date} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => handleDownload(doc.id, doc.title)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Download PDF Document"
                    >
                      {isDownloading ? (
                        <div className="w-4.5 h-4.5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close Vault
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
