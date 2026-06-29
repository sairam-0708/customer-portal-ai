import React, { useState, useEffect } from 'react';
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
  Lock,
  ShieldCheck
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


  // Sub-tab Navigation state
  const [activeSubTab, setActiveSubTab] = useState<'claims' | 'glass' | 'prevention'>('claims');


  // Glass Repair State
  const [glassVehicle, setGlassVehicle] = useState(policies.find(p => p.type === 'auto')?.title || '2021 Honda Accord');
  const [glassDamage, setGlassDamage] = useState('Front Windshield - Chip (Repairable)');
  const [glassService, setGlassService] = useState('mobile');
  const [glassDate, setGlassDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [glassTime, setGlassTime] = useState('Morning (8:00 AM - 12:00 PM)');
  const [glassClaimsList, setGlassClaimsList] = useState<{ id: string; vehicle: string; damage: string; service: string; date: string; time: string; status: string }[]>(() => {
    const saved = localStorage.getItem('shieldguard_glass_appointments');
    return saved ? JSON.parse(saved) : [];
  });


  // Risk Prevention Checklist States
  const [homeChecks, setHomeChecks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('shieldguard_prevention_home');
    return saved ? JSON.parse(saved) : { smoke: false, fireExt: false, waterLeak: false, treeTrim: false, shutoff: false };
  });
  const [autoChecks, setAutoChecks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('shieldguard_prevention_auto');
    return saved ? JSON.parse(saved) : { wipers: false, tireTread: false, dashLight: false, mount: false, emergencyKit: false };
  });
  const [isHomeCertified, setIsHomeCertified] = useState(() => {
    return localStorage.getItem('shieldguard_certified_home') === 'true';
  });
  const [isAutoCertified, setIsAutoCertified] = useState(() => {
    return localStorage.getItem('shieldguard_certified_auto') === 'true';
  });


  // Sync Glass Appointments & Prevention checklists
  useEffect(() => {
    localStorage.setItem('shieldguard_glass_appointments', JSON.stringify(glassClaimsList));
  }, [glassClaimsList]);


  useEffect(() => {
    localStorage.setItem('shieldguard_prevention_home', JSON.stringify(homeChecks));
    localStorage.setItem('shieldguard_certified_home', isHomeCertified.toString());
  }, [homeChecks, isHomeCertified]);


  useEffect(() => {
    localStorage.setItem('shieldguard_prevention_auto', JSON.stringify(autoChecks));
    localStorage.setItem('shieldguard_certified_auto', isAutoCertified.toString());
  }, [autoChecks, isAutoCertified]);


  // Handle Glass scheduling submission
  const handleScheduleGlass = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = {
      id: `glass_${Date.now()}`,
      vehicle: glassVehicle,
      damage: glassDamage,
      service: glassService === 'mobile' ? 'Mobile Dispatch (Safelite partner comes to you)' : 'In-Shop Service Drop-off',
      date: glassDate,
      time: glassTime,
      status: 'Confirmed'
    };
    setGlassClaimsList(prev => [newAppointment, ...prev]);
    showToast(`Glass repair scheduled for ${glassDate}! Safelite Solutions technician assigned.`);
  };


  const handleCancelGlass = (id: string, date: string) => {
    setGlassClaimsList(prev => prev.filter(appt => appt.id !== id));
    showToast(`AutoGlass appointment on ${date} cancelled successfully.`);
  };


  // Submit Safety audits to activate premium discount
  const handleCertifySafety = (type: 'home' | 'auto') => {
    if (type === 'home') {
      const allChecked = Object.values(homeChecks).every(Boolean);
      if (!allChecked) {
        showToast("Please check all safety guidelines in the audit checklist to certify.");
        return;
      }
      setIsHomeCertified(true);
      showToast("Home Safety Audit certified! A $15.00 Safety Credit is active on your profile.");
    } else {
      const allChecked = Object.values(autoChecks).every(Boolean);
      if (!allChecked) {
        showToast("Please check all safe driver criteria to certify.");
        return;
      }
      setIsAutoCertified(true);
      showToast("Auto Safe Driver certified! A $15.00 Safety Credit is active on your profile.");
    }
  };


  const activeTimelineSteps = activeClaim ? getTimelineSteps(activeClaim.status) : [];


  return (
    <div className="space-y-8" id="claims-page-wrapper">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#004f8f] block uppercase font-sans">ShieldGuard Claims Center</span>
          <h1 className="text-2xl sm:text-3xl font-sans font-medium text-slate-900 mt-1">Claims & Safety Hub</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans font-medium">Report accident incidents, schedule mobile windshield repairs, and complete preventive safety checklists.</p>
        </div>
        <button
          onClick={onFileClaimClick}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report a New Claim</span>
        </button>
      </div>


      {/* Page Sub-navigation Tabs */}
      <div className="flex border-b border-slate-200" id="claims-sub-tabs">
        <button
          onClick={() => setActiveSubTab('claims')}
          className={`px-4 py-2.5 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'claims'
              ? 'border-[#004f8f] text-[#004f8f]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Claims Tracking & Estimates
        </button>
        <button
          onClick={() => setActiveSubTab('glass')}
          className={`px-4 py-2.5 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'glass'
              ? 'border-[#004f8f] text-[#004f8f]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Schedule Glass Repair
        </button>
        <button
          onClick={() => setActiveSubTab('prevention')}
          className={`px-4 py-2.5 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'prevention'
              ? 'border-[#004f8f] text-[#004f8f]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Risk Prevention Audits
        </button>
      </div>


      <AnimatePresence mode="wait">
        {/* SUBTAB 1: Claims Tracking & Estimates */}
        {activeSubTab === 'claims' && (
          <motion.div
            key="claims-tracking-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {claims.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500 max-w-xl mx-auto space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-bold text-base text-slate-900">No Active Incidents</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All your policies are in excellent standing and you have no open claims reported on your ShieldGuard Insurance account.
                </p>
                <button
                  onClick={onFileClaimClick}
                  className="px-4 py-2 bg-[#004f8f] text-white text-xs font-bold rounded-xl hover:bg-[#003d70] transition-colors cursor-pointer"
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
                          className={`w-full p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-white border-[#004f8f] ring-2 ring-[#004f8f]/10 shadow-xs'
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
                            <span className="text-[#004f8f] font-bold flex items-center">
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
                          <span className="text-xs uppercase font-bold tracking-widest text-[#004f8f]">Track Pipeline Status</span>
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
                      <div className="p-4 bg-[#f0f6fa] border border-blue-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Clock className="w-4 h-4 text-[#004f8f]" />
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


                          <label className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#004f8f] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
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
                          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg space-y-1.5">
                            <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                              <span>Uploading files securely to ShieldGuard Vault...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#004f8f] h-full transition-all duration-300 upload-progress-bar" style={{ '--upload-progress': `${uploadProgress}%` } as React.CSSProperties}></div>
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
                                className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
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
                <Calculator className="w-5 h-5 text-[#004f8f]" />
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


                <div className="bg-[#f0f6fa] border border-blue-100 rounded-xl p-3 flex flex-col justify-between h-[68px]">
                  <span className="text-[10px] font-bold text-[#004f8f] uppercase">Policy Deductible:</span>
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
                  <span className="text-2xl font-black text-[#004f8f] block">${shieldGuardCoverage.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400">ShieldGuard indemnifies everything above deductible limits.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {/* SUBTAB 2: Glass Repair Claims */}
        {activeSubTab === 'glass' && (
          <motion.div
            key="glass-repair-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left/Middle Column (2/3) - Glass Scheduler Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="p-1.5 bg-blue-50 text-[#004f8f] rounded-lg">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Fast Glass Repair Scheduler</h3>
                    <p className="text-[11px] text-slate-400">Schedule windshield chip repair or full window replacement with Safelite Solutions</p>
                  </div>
                </div>


                <p className="text-xs text-slate-600 leading-relaxed">
                  ShieldGuard Comprehensive Auto policies feature <strong>$0 Out-of-pocket glass repair</strong> for windshield chips and glass cracks! Safelite mobile technicians can drive directly to your workplace, school, or home to service your vehicle.
                </p>


                <form onSubmit={handleScheduleGlass} className="space-y-4 font-sans" id="glass-scheduler-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vehicle */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Covered Vehicle</label>
                      <select
                        value={glassVehicle}
                        onChange={(e) => setGlassVehicle(e.target.value)}
                        className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-xs font-medium text-slate-700 outline-none"
                      >
                        {policies.filter(p => p.type === 'auto').map(p => (
                          <option key={p.id} value={p.title}>{p.title} ({p.policyNumber})</option>
                        ))}
                      </select>
                    </div>


                    {/* Damage */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Glass Damage Category</label>
                      <select
                        value={glassDamage}
                        onChange={(e) => setGlassDamage(e.target.value)}
                        className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-xs font-medium text-slate-700 outline-none"
                      >
                        <option>Front Windshield - Chip (Repairable, smaller than a quarter)</option>
                        <option>Front Windshield - Large Crack (Requires full replacement)</option>
                        <option>Passenger Side Window - Shattered (Replacement)</option>
                        <option>Driver Side Window - Shattered (Replacement)</option>
                        <option>Rear Windshield - Cracked (Replacement)</option>
                      </select>
                    </div>
                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Service Method */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Method</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                          <input
                            type="radio"
                            name="glassService"
                            checked={glassService === 'mobile'}
                            onChange={() => setGlassService('mobile')}
                            className="text-[#004f8f] focus:ring-[#004f8f]/30"
                          />
                          <span>Mobile Dispatch (We come to you)</span>
                        </label>
                        <label className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                          <input
                            type="radio"
                            name="glassService"
                            checked={glassService === 'shop'}
                            onChange={() => setGlassService('shop')}
                            className="text-[#004f8f] focus:ring-[#004f8f]/30"
                          />
                          <span>In-Shop drop-off center</span>
                        </label>
                      </div>
                    </div>


                    {/* Appt Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preferred Date</label>
                      <input
                        type="date"
                        value={glassDate}
                        onChange={(e) => setGlassDate(e.target.value)}
                        className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-xs font-medium text-slate-700 outline-none"
                        required
                      />
                    </div>


                    {/* Appt Time */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Time Window Slot</label>
                      <select
                        value={glassTime}
                        onChange={(e) => setGlassTime(e.target.value)}
                        className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-xs font-medium text-slate-700 outline-none"
                      >
                        <option>Morning (8:00 AM - 12:00 PM)</option>
                        <option>Afternoon (12:00 PM - 5:00 PM)</option>
                        <option>Late Afternoon (3:00 PM - 7:00 PM)</option>
                      </select>
                    </div>
                  </div>


                  {/* Pricing alert */}
                  <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex items-start space-x-3 text-xs text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold">100% Covered - No Deductible Due!</span>
                      <p className="text-[11px] text-emerald-700/90">
                        Auto glass repairs are fully subsidized under your Comprehensive plan. Scheduling this appointment does not affect your auto premium rates or count as a negative incident surcharge.
                      </p>
                    </div>
                  </div>


                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#004f8f] hover:bg-[#003d70] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>Confirm AutoGlass Dispatch</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>


            {/* Right Column (1/3) - Active Appointments list */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Repairs</h3>


              {glassClaimsList.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                    ✓
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs">No Scheduled Repairs</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    You have no active windshield or side-glass repair appointments scheduled for your auto assets.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {glassClaimsList.map((appt) => (
                    <div key={appt.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex items-start justify-between w-full">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Safelite Repair Order</span>
                          <h4 className="font-bold text-xs text-slate-900 mt-0.5">{appt.vehicle}</h4>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[9px] uppercase">
                          {appt.status}
                        </span>
                      </div>


                      <div className="space-y-1.5 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-700">Damage:</span>
                          <span className="text-slate-600 truncate max-w-[150px]">{appt.damage}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-700">Service:</span>
                          <span className="text-slate-600 truncate max-w-[150px]">{appt.service}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-700">Date:</span>
                          <span className="text-slate-800 font-semibold">{appt.date} ({appt.time})</span>
                        </div>
                      </div>


                      <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">Ref: GL-{appt.id.slice(-6)}</span>
                        <button
                          onClick={() => handleCancelGlass(appt.id, appt.date)}
                          className="text-red-500 hover:text-red-700 hover:underline font-bold cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}


        {/* SUBTAB 3: Risk Prevention Audits */}
        {activeSubTab === 'prevention' && (
          <motion.div
            key="prevention-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Card: Home Safety Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#004f8f]/10 text-[#004f8f] rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-[#004f8f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Home Protection Audit</h3>
                    <p className="text-[11px] text-slate-400">Complete checks to earn a $15.00 Safety Bill Credit</p>
                  </div>
                </div>
                {isHomeCertified ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[9px] uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Certified</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-full text-[9px] uppercase tracking-wider border border-amber-200">
                    Audit Pending
                  </span>
                )}
              </div>


              <p className="text-xs text-slate-600 leading-relaxed">
                By maintaining these residential security conditions, you minimize fire and flash-flood exposures. Certify all 5 below to credit your billing immediately:
              </p>


              {/* Checklist items */}
              <div className="space-y-2.5 font-sans">
                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={homeChecks.smoke}
                    disabled={isHomeCertified}
                    onChange={(e) => setHomeChecks(prev => ({ ...prev, smoke: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Smoke & CO Alarms Checked</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Tested all smoke detectors and confirmed batteries are loaded and active.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={homeChecks.fireExt}
                    disabled={isHomeCertified}
                    onChange={(e) => setHomeChecks(prev => ({ ...prev, fireExt: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Fire Extinguishers Stowed</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Kept fully-charged classification ABC extinguishers in the kitchen and furnace rooms.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={homeChecks.waterLeak}
                    disabled={isHomeCertified}
                    onChange={(e) => setHomeChecks(prev => ({ ...prev, waterLeak: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Water Leak Detection Sensors</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Installed water puddle alarms under washbasins and refrigerator pipelines.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={homeChecks.treeTrim}
                    disabled={isHomeCertified}
                    onChange={(e) => setHomeChecks(prev => ({ ...prev, treeTrim: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Roof Clearances Trimmed</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Trimmed all heavy tree limbs back at least 6 feet from shingles to block wind friction.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={homeChecks.shutoff}
                    disabled={isHomeCertified}
                    onChange={(e) => setHomeChecks(prev => ({ ...prev, shutoff: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Water & Gas Valves Tagged</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Mapped the primary water shutoff valve clearly for emergency freeze shutdowns.</span>
                  </div>
                </label>
              </div>


              {!isHomeCertified && (
                <button
                  onClick={() => handleCertifySafety('home')}
                  className="w-full py-3 bg-[#004f8f] hover:bg-[#003c6e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Certify Home Safety Audit & Claim $15.00 Credit
                </button>
              )}
              {isHomeCertified && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-[11px] text-emerald-800 font-bold">
                  ✓ Verified: $15.00 Home Safety Premium Credit successfully applied.
                </div>
              )}
            </div>


            {/* Card: Auto Safety Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#004f8f]/10 text-[#004f8f] rounded-lg">
                    <UserCheck className="w-5 h-5 text-[#004f8f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Auto Safe Driver Check</h3>
                    <p className="text-[11px] text-slate-400">Complete checks to earn a $15.00 Safety Bill Credit</p>
                  </div>
                </div>
                {isAutoCertified ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[9px] uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Certified</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-full text-[9px] uppercase tracking-wider border border-amber-200">
                    Audit Pending
                  </span>
                )}
              </div>


              <p className="text-xs text-slate-600 leading-relaxed">
                By maintaining these preventative vehicular conditions, you reduce highway emergency frequencies. Check off all 5 below to certify and claim your auto safety credit:
              </p>


              {/* Checklist items */}
              <div className="space-y-2.5 font-sans">
                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoChecks.wipers}
                    disabled={isAutoCertified}
                    onChange={(e) => setAutoChecks(prev => ({ ...prev, wipers: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Premium Wiper Blades Installed</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Wipers operate smoothly without squeaking or leaving streaks.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoChecks.tireTread}
                    disabled={isAutoCertified}
                    onChange={(e) => setAutoChecks(prev => ({ ...prev, tireTread: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Tire Tread Depth Tested</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Verified tire treads exceed the 4/32" depth limit using the Lincoln penny test.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoChecks.dashLight}
                    disabled={isAutoCertified}
                    onChange={(e) => setAutoChecks(prev => ({ ...prev, dashLight: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Zero Fault Dashboard Warning Lights</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">No Check-Engine, ABS, or SRS warning lights active on the instrument cluster.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoChecks.mount}
                    disabled={isAutoCertified}
                    onChange={(e) => setAutoChecks(prev => ({ ...prev, mount: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Hands-free Phone Mount Installed</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Mounted handset support to avoid manual distraction during navigation routing.</span>
                  </div>
                </label>


                <label className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoChecks.emergencyKit}
                    disabled={isAutoCertified}
                    onChange={(e) => setAutoChecks(prev => ({ ...prev, emergencyKit: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#004f8f] border-slate-300 mt-0.5 focus:ring-[#004f8f]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Roadside Safety Trunk Kit Loaded</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Stored jumper cables, space blankets, flashlight, and reflective triangles in the spare tire bay.</span>
                  </div>
                </label>
              </div>


              {!isAutoCertified && (
                <button
                  onClick={() => handleCertifySafety('auto')}
                  className="w-full py-3 bg-[#004f8f] hover:bg-[#003c6e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Certify Safe Driver Audit & Claim $15.00 Credit
                </button>
              )}
              {isAutoCertified && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-[11px] text-emerald-800 font-bold">
                  ✓ Verified: $15.00 Auto Safety Premium Credit successfully applied.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
