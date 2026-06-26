import React, { useState } from 'react';
import { Claim, Policy } from '../types';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  HelpCircle, 
  Camera, 
  UserCheck, 
  FileCheck2, 
  ChevronRight, 
  Calculator,
  Upload,
  Sparkles,
  Info,
  Trash2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClaimsPageProps {
  claims: Claim[];
  policies: Policy[];
  onFileClaimClick: () => void;
  showToast: (message: string) => void;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export default function ClaimsPage({
  claims,
  policies,
  onFileClaimClick,
  showToast
}: ClaimsPageProps) {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(
    claims.length > 0 ? claims[0].id : null
  );

  // Out-of-pocket calculator state
  const [damageAmount, setDamageAmount] = useState<number>(2400);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(
    policies.length > 0 ? policies[0].id : ''
  );

  // Document uploader local state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    { id: 'f1', name: 'police_report_021226.pdf', size: '1.4 MB', type: 'PDF' },
    { id: 'f2', name: 'bumper_damage_left_side.jpg', size: '2.8 MB', type: 'JPG' }
  ]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Active claim
  const activeClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

  // Calculator computations
  const chosenPolicy = policies.find(p => p.id === selectedPolicyId);
  const deductible = chosenPolicy?.type === 'auto' ? (chosenPolicy.deductible || 500) : 1000;
  
  const shieldGuardCoverage = damageAmount > deductible ? damageAmount - deductible : 0;
  const outOfPocket = damageAmount > deductible ? deductible : damageAmount;

  // File picker simulation
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setAttachedFiles(old => [
            ...old,
            {
              id: `f_${Date.now()}`,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
            }
          ]);
          showToast(`File "${file.name}" uploaded successfully and linked to Claim.`);
          return null;
        }
        return prev + 30;
      });
    }, 300);
  };

  const handleDeleteFile = (id: string, name: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
    showToast(`File "${name}" removed from claim folder.`);
  };

  // Status mapping for visual timeline pipeline
  const getTimelineSteps = (status: Claim['status']) => {
    const steps = [
      { id: '1', title: 'Claim Filed', description: 'Incident successfully reported online.', done: true },
      { id: '2', title: 'Adjuster Assigned', description: 'A licensed ShieldGuard investigator was allocated.', done: true },
      { id: '3', title: 'Inspection & Valuation', description: 'Damage estimate evaluation is being completed.', done: false },
      { id: '4', title: 'Settlement Drafted', description: 'Payout approved and repairs authorized.', done: false },
    ];

    if (status === 'In Review') {
      steps[1].done = true;
    } else if (status === 'Approved') {
      steps[1].done = true;
      steps[2].done = true;
    } else if (status === 'Closed') {
      steps[1].done = true;
      steps[2].done = true;
      steps[3].done = true;
    }

    return steps;
  };

  const activeTimelineSteps = activeClaim ? getTimelineSteps(activeClaim.status) : [];

  return (
    <div className="space-y-8" id="claims-page-wrapper">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#0f9d58] block uppercase font-sans">ShieldGuard Claims Center</span>
          <h1 className="text-2xl sm:text-3xl font-sans font-medium text-slate-900 mt-1">Claims Incident Hub</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans">Report accident incidents, track active adjuster reviews, and upload damage photos</p>
        </div>
        <button
          onClick={onFileClaimClick}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report a New Claim</span>
        </button>
      </div>

      {/* 2. Top Grid Claims & Status Dashboard */}
      {claims.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500 max-w-xl mx-auto space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">No Active Incidents</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All your policies are in excellent standing and you have no open claims reported on your ShieldGuard Insurance account.
          </p>
          <button
            onClick={onFileClaimClick}
            className="px-4 py-2 bg-[#0f9d58] text-white text-xs font-bold rounded-xl hover:bg-[#0b8043] transition-colors"
          >
            File a Claim Incident
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel: Claims list switcher (1/3 width) */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Claim incidents</h3>
            
            <div className="space-y-3">
              {claims.map((claim) => {
                const isActive = claim.id === selectedClaimId;
                const isClosed = claim.status === 'Closed';

                return (
                  <button
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isActive 
                        ? 'bg-white border-[#0f9d58] ring-2 ring-[#0f9d58]/10 shadow-xs' 
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans uppercase">Claim date: {claim.date}</span>
                        <h4 className="font-bold text-sm text-slate-900 mt-0.5">{claim.policyTitle}</h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                        isClosed ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {claim.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-2.5 font-sans">
                      {claim.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2.5 w-full text-[10px]">
                      <span className="text-slate-400 font-mono">ID: {claim.id}</span>
                      <span className="text-[#0f9d58] font-bold flex items-center">
                        View timeline <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Claim Detail Progress Pipeline & Files (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeClaim ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#0f9d58]">Track Pipeline Status</span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">{activeClaim.policyTitle} claim</h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block font-sans">Incident Reported</span>
                    <strong className="text-xs text-slate-800 block font-mono">{activeClaim.date}</strong>
                  </div>
                </div>

                {/* Progressive Milestone wizard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  {activeTimelineSteps.map((step, idx) => {
                    return (
                      <div key={step.id} className="relative flex md:flex-col items-start gap-3 md:gap-0">
                        {/* Circle badge */}
                        <div className="flex items-center justify-center shrink-0">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                            step.done 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {step.done ? '✓' : step.id}
                          </div>
                          
                          {/* Horizontal connector line on desktop */}
                          {idx < 3 && (
                            <div className={`hidden md:block absolute left-[32px] right-0 top-4 h-0.5 ${
                              activeTimelineSteps[idx+1].done ? 'bg-emerald-300' : 'bg-slate-100'
                            }`} />
                          )}
                        </div>

                        {/* Title descriptions */}
                        <div className="md:mt-3">
                          <span className={`text-xs font-bold block leading-tight ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">{step.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Claim Notes Block */}
                <div className="p-4 bg-[#e6f4ea] border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-[#0f9d58]" />
                    <span>Latest Adjuster Correspondence</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    "We've verified your bumper incident photographs. An authorized estimator is reviewing the parts catalog list to approve payouts for Elkridge Auto Body. Please ensure your collision deductible of $500 is prepared for the garage upon completion."
                  </p>
                  <p className="text-[10px] text-slate-400 italic font-medium">Drafted by: Michael Reardon (ShieldGuard Agent Portfolio)</p>
                </div>

                {/* Mock File Uploader Folder */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Supporting Claim Files</h4>
                      <p className="text-[11px] text-slate-400">Attach damage invoices, crash photos, or police notes</p>
                    </div>

                    <label className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#0f9d58] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload files</span>
                      <input 
                        type="file" 
                        onChange={handleSimulateUpload} 
                        className="hidden" 
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                  </div>

                  {uploadProgress !== null && (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-1.5">
                      <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                        <span>Uploading files securely to ShieldGuard Vault...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0f9d58] h-full transition-all duration-300 upload-progress-bar" style={{ '--upload-progress': `${uploadProgress}%` } as React.CSSProperties}></div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500">
                            {file.type}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-400 block">{file.size}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}

          </div>

        </div>
      )}

      {/* 3. Accident Out-of-pocket Estimator tool */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs max-w-3xl">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-5">
          <Calculator className="w-5 h-5 text-[#0f9d58]" />
          <h3 className="font-sans font-bold text-base text-slate-900">Incident Cost & Out-of-Pocket Estimator</h3>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Estimate how your deductible affects claim payouts depending on expected damage values. Select an active policy and input estimated body-shop repairs below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Select Policy</label>
            <select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 outline-none"
            >
              {policies.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.type === 'auto' ? 'Auto' : 'Home'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Estimated Repair Costs ($)</label>
            <input
              type="number"
              min={100}
              max={50000}
              step={100}
              value={damageAmount}
              onChange={(e) => setDamageAmount(Math.max(100, parseInt(e.target.value) || 0))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-medium text-slate-800 outline-none"
            />
          </div>

          <div className="bg-[#e6f4ea] border border-slate-200 rounded-xl p-3 flex flex-col justify-between h-[68px]">
            <span className="text-[10px] font-bold text-[#0f9d58] uppercase">Policy Deductible:</span>
            <span className="text-sm font-black text-slate-800">${deductible}</span>
          </div>
        </div>

        {/* Output distribution */}
        <div className="mt-6 p-4 border border-slate-100 bg-slate-50 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">Personal Out-Of-Pocket Expenses:</span>
            <span className="text-2xl font-black text-slate-900 block">${outOfPocket.toLocaleString()}</span>
            <p className="text-[10px] text-slate-400">Equivalent to your plan's deductible ceiling.</p>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-xs text-slate-400 block">Covered & Disbursed by ShieldGuard:</span>
            <span className="text-2xl font-black text-[#0f9d58] block">${shieldGuardCoverage.toLocaleString()}</span>
            <p className="text-[10px] text-slate-400">ShieldGuard indemnifies everything above deductible limits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
