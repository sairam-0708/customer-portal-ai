import React, { useState, useRef } from 'react';
import { X, Calendar, Upload, ClipboardCheck, AlertCircle, FilePlus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Policy, Claim } from '../types';

interface ClaimModalProps {
  policies: Policy[];
  onClose: () => void;
  onSubmitClaim: (claim: Omit<Claim, 'id'>) => void;
}

export default function ClaimModal({ policies, onClose, onSubmitClaim }: ClaimModalProps) {
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || '');
  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Accident');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPolicy = policies.find(p => p.id === selectedPolicyId);
    if (!selectedPolicy || !incidentDate || !description) return;

    // Simulate claims addition
    onSubmitClaim({
      policyId: selectedPolicyId,
      policyTitle: selectedPolicy.title,
      date: incidentDate,
      description,
      status: 'Submitted',
      amountClaimed: estimatedCost ? parseFloat(estimatedCost) : undefined
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="claim-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        id="claim-modal"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="claim-form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-slate-900">File a Claims Incident</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors animate-pulse"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleSubmit} className="space-y-4" id="claim-incident-form">
                {/* Select Policy */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Select Active Policy
                  </label>
                  <select
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg py-2.5 px-3 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent outline-none"
                    required
                  >
                    {policies.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.policyNumber})</option>
                    ))}
                  </select>
                </div>

                {/* Sub-fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                      Date of Incident
                    </label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg py-2 px-3 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg py-2.5 px-3 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent outline-none"
                    >
                      <option>Accident</option>
                      <option>Weather damage</option>
                      <option>Theft</option>
                      <option>Water damage</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Incident Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what happened, any third parties involved, or any immediate actions taken..."
                    className="w-full border border-slate-300 rounded-lg py-2 px-3 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                {/* Estimated Loss Amount (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Estimated Damage Amount (Optional)
                  </label>
                  <div className="relative rounded-lg border border-slate-300 flex items-center overflow-hidden focus-within:ring-2 focus-within:ring-[var(--app-primary)] focus-within:border-transparent">
                    <span className="pl-3.5 pr-1.5 text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      className="w-full border-0 py-2.5 px-1 bg-white text-slate-800 text-sm outline-none focus:ring-0"
                    />
                  </div>
                </div>

                {/* Drag and Drop File Uploader */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
                    Attach Photo / Damage Documentation
                  </label>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                      dragActive
                        ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                        : 'border-slate-300 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs font-medium text-slate-700 font-sans">
                      Drag & drop images here, or <span className="text-slate-700 underline">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Supports JPG, PNG up to 10MB
                    </p>
                  </div>

                  {/* Attachment List */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-3.5 space-y-1.5" id="attachments-preview">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attached files:</span>
                      {attachedFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700">
                          <div className="flex items-center space-x-2 truncate">
                            <FilePlus className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate font-medium">{file.name}</span>
                            <span className="text-[10px] text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Submit Claim Incident</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="claim-success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 font-sans">Claim Incident Submitted</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto font-sans">
                  We have successfully registered your report. Agent <strong>Michael Reardon</strong> and a dedicated claim adjuster will review it and contact you within 24 hours.
                </p>
              </div>

              {/* Display a mock claim ID */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-xs mx-auto text-xs text-slate-600 font-mono">
                Claims Ref ID: <strong className="text-slate-900">ER-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </div>

              <button
                onClick={onClose}
                className="py-3 px-6 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer inline-block"
              >
                Go Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
