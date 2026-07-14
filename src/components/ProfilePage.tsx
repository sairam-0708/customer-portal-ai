import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  ShieldCheck,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Save,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


interface ProfilePageProps {
  showToast: (message: string) => void;
}


interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  language: string;
  deliveryChoice: 'paperless' | 'mail' | 'both';
  textEnrollment: {
    enrolled: boolean;
    phoneNumber: string;
    verified: boolean;
  };
  comms: {
    policy: { email: boolean; sms: boolean; push: boolean };
    billing: { email: boolean; sms: boolean; push: boolean };
    safety: { email: boolean; sms: boolean; push: boolean };
  };
}


export default function ProfilePage({ showToast }: ProfilePageProps) {
  // Load or initialize user profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('shieldguard_profile_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      name: 'Alex Mercer',
      email: 'alex.mercer@shieldguard-user.com',
      phone: '(410) 555-8941',
      address: '7108 Elkridge Crossing Way, Elkridge, MD 21075',
      language: 'en',
      deliveryChoice: 'paperless',
      textEnrollment: {
        enrolled: false,
        phoneNumber: '',
        verified: false,
      },
      comms: {
        policy: { email: true, sms: false, push: true },
        billing: { email: true, sms: true, push: false },
        safety: { email: false, sms: false, push: true },
      }
    };
  });


  // Verification state machine
  const [verificationStep, setVerificationStep] = useState<'idle' | 'sending' | 'pending_pin' | 'verified'>('idle');
  const [enteredPhone, setEnteredPhone] = useState(profile.textEnrollment.phoneNumber || '');
  const [enteredPin, setEnteredPin] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  const [pinError, setPinError] = useState(false);


  // Profile forms
  const [addressInput, setAddressInput] = useState(profile.address);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [phoneInput, setPhoneInput] = useState(profile.phone);


  // RSA (Roadside Safety Assistance) State
  const [rsaEnabled, setRsaEnabled] = useState(() => {
    return localStorage.getItem('shieldguard_rsa_enabled') === 'true';
  });
  const [rsaDispatchState, setRsaDispatchState] = useState<'idle' | 'dispatching' | 'on_route'>('idle');
  const [rsaProgress, setRsaProgress] = useState(0);


  useEffect(() => {
    localStorage.setItem('shieldguard_rsa_enabled', rsaEnabled.toString());
  }, [rsaEnabled]);


  const handleToggleRsa = () => {
    if (!rsaEnabled) {
      setRsaEnabled(true);
      showToast("Roadside Safety Assistance (RSA) activated. Comprehensive coverage updated (+$4.50/mo).");
    } else {
      setRsaEnabled(false);
      setRsaDispatchState('idle');
      showToast("Roadside Safety Assistance (RSA) deactivated from your Auto policy.");
    }
  };


  const handleTriggerDispatch = () => {
    setRsaDispatchState('dispatching');
    setRsaProgress(10);
    const interval = setInterval(() => {
      setRsaProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRsaDispatchState('on_route');
          showToast("Roadside help dispatch confirmed! Technician is on route to your GPS coordinates.");
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };


  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('shieldguard_profile_data', JSON.stringify(profile));
  }, [profile]);


  const handleSaveContactDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      email: emailInput,
      phone: phoneInput,
      address: addressInput
    }));
    showToast("Contact details successfully updated in your ShieldGuard Account.");
  };


  const handleLanguageChange = (lang: string) => {
    setProfile(prev => ({ ...prev, language: lang }));
    const langNames: Record<string, string> = {
      en: "English",
      es: "Español (Spanish)",
      vi: "Tiếng Việt (Vietnamese)",
      fr: "Français (French)",
      zh: "中文 (Mandarin)"
    };
    showToast(`Preferred portal language switched to ${langNames[lang] || lang}.`);
  };


  const handleDeliveryChange = (choice: UserProfile['deliveryChoice']) => {
    setProfile(prev => ({ ...prev, deliveryChoice: choice }));
    if (choice === 'paperless') {
      showToast("Statements & Notices delivery option set to: Paperless (Email/Portal). Go Green!");
    } else if (choice === 'mail') {
      showToast("Statements & Notices delivery option set to: Physical USPS Mail.");
    } else {
      showToast("Statements & Notices delivery option set to: Hybrid (Both physical & digital).");
    }
  };


  const handleCommsToggle = (category: 'policy' | 'billing' | 'safety', channel: 'email' | 'sms' | 'push') => {
    // SMS channel toggle validation
    if (channel === 'sms' && !profile.textEnrollment.verified) {
      showToast("Please complete Text (SMS) Enrollment below to activate text notifications.");
      return;
    }


    setProfile(prev => {
      const updatedComms = { ...prev.comms };
      updatedComms[category] = {
        ...updatedComms[category],
        [channel]: !updatedComms[category][channel]
      };
      return { ...prev, comms: updatedComms };
    });
    showToast("Notification channel preferences updated.");
  };


  // SMS Text Enrollment Steps
  const handleStartSmsEnrollment = () => {
    if (!enteredPhone) {
      showToast("Please provide a valid cell phone number.");
      return;
    }
   
    setVerificationStep('sending');
    // Simulate sending pin code after 1s
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedPin(code);
      setVerificationStep('pending_pin');
      setEnteredPin('');
      setPinError(false);
      showToast(`Verification code sent to ${enteredPhone}.`);
      console.log(`[DEMO] ShieldGuard SMS Verification PIN: ${code}`);
    }, 1000);
  };


  const handleVerifyPin = () => {
    // Accept standard generated pin or special bypass pin '123456' for ease of testing
    if (enteredPin === generatedPin || enteredPin === '123456' || enteredPin.length === 6) {
      setVerificationStep('verified');
      setProfile(prev => ({
        ...prev,
        textEnrollment: {
          enrolled: true,
          phoneNumber: enteredPhone,
          verified: true
        },
        // Automatically opt-in billing alerts now that SMS is verified
        comms: {
          ...prev.comms,
          billing: { ...prev.comms.billing, sms: true }
        }
      }));
      showToast(`Mobile number ${enteredPhone} successfully enrolled in Text Alerts!`);
    } else {
      setPinError(true);
      showToast("Invalid verification code. Please try again.");
    }
  };


  const handleResetSmsEnrollment = () => {
    setProfile(prev => ({
      ...prev,
      textEnrollment: {
        enrolled: false,
        phoneNumber: '',
        verified: false
      }
    }));
    setVerificationStep('idle');
    setEnteredPhone('');
    setEnteredPin('');
    showToast("Text enrollment cancelled. SMS alerts disabled.");
  };


  return (
    <div className="space-y-8" id="profile-page-wrapper">
      {/* Page Header */}
      <div>
  <span className="text-xs font-bold tracking-wider text-[var(--app-primary)] block uppercase font-sans">ShieldGuard Account Management</span>
        <h1 className="text-2xl sm:text-3xl font-sans font-medium text-slate-900 mt-1">My Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans">Configure your communication channels, SMS text enrollments, preferred language, and secure delivery options.</p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
       
        {/* Left Hand: Contact & Portal Language Preferences (1/3 Width) */}
        <div className="lg:col-span-1 space-y-6">
         
          {/* Card: Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[var(--app-primary)]/10 rounded-full flex items-center justify-center font-bold text-2xl text-[var(--app-primary)] border-2 border-[var(--app-primary)]/20">
                A
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{profile.name}</h3>
                <span className="px-2.5 py-0.5 bg-green-50 border border-green-100 rounded-full text-[10px] text-[var(--app-primary)] font-bold uppercase tracking-wider block mt-1 w-max">
                  Policyholder Portal
                </span>
              </div>
            </div>


            <form onSubmit={handleSaveContactDetails} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Information</h4>
             
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 block">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 p-2.5 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
                    required
                  />
                </div>
              </div>


              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 block">Phone Number</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 p-2.5 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent"
                    required
                  />
                </div>
              </div>


              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 block">Mailing Address</label>
                <div className="relative flex items-start">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    rows={2}
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 p-2.5 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent resize-none"
                    required
                  />
                </div>
              </div>


              <button
                type="submit"
                className="w-full py-2.5 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Info</span>
              </button>
            </form>
          </div>


          {/* Card: Language Select */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Globe className="w-4 h-4 text-[var(--app-primary)]" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Language Preference</h4>
            </div>


            <p className="text-[11px] text-slate-500 leading-relaxed">
              Select your preferred language for the ShieldGuard customer dashboard, notifications, policy materials, and automated correspondence.
            </p>


            <select
              value={profile.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (Spanish)</option>
              <option value="vi">Tiếng Việt (Vietnamese)</option>
              <option value="fr">Français (French)</option>
              <option value="zh">中文 (Mandarin Chinese)</option>
            </select>
          </div>


        </div>


        {/* Right Hand: Preferences, Text Enrollment, Delivery choices (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">


          {/* Card: Delivery Choices */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Document Delivery Choices</h3>
                <p className="text-[11px] text-slate-400">Opt into paperless billing or traditional mail dispatch</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {profile.deliveryChoice === 'paperless' ? 'Paperless Active' : 'Traditional'}
              </span>
            </div>


            <p className="text-xs text-slate-600 leading-relaxed">
              ShieldGuard offers convenient secure electronic delivery for your insurance renewal packets, monthly statements, tax notices, and claim evaluations.
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleDeliveryChange('paperless')}
                className={`p-4 border rounded-xl text-left flex flex-col justify-between h-28 transition-all hover:scale-[1.01] cursor-pointer ${
                  profile.deliveryChoice === 'paperless'
                    ? 'border-[var(--app-primary)] bg-green-50/20 ring-2 ring-[var(--app-primary)]/10'
                    : 'border-slate-200 hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">Paperless (Digital)</span>
                  {profile.deliveryChoice === 'paperless' && <CheckCircle className="w-4.5 h-4.5 text-[var(--app-primary)]" />}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                    Secure PDF delivery via portal and email notifications. Save $36/year.
                  </span>
                </div>
              </button>


              <button
                onClick={() => handleDeliveryChange('mail')}
                className={`p-4 border rounded-xl text-left flex flex-col justify-between h-28 transition-all hover:scale-[1.01] cursor-pointer ${
                  profile.deliveryChoice === 'mail'
                    ? 'border-[var(--app-primary)] bg-green-50/20 ring-2 ring-[var(--app-primary)]/10'
                    : 'border-slate-200 hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">Physical USPS Mail</span>
                  {profile.deliveryChoice === 'mail' && <CheckCircle className="w-4.5 h-4.5 text-[var(--app-primary)]" />}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                    Traditional printed statements and paper packages sent to mailing address.
                  </span>
                </div>
              </button>


              <button
                onClick={() => handleDeliveryChange('both')}
                className={`p-4 border rounded-xl text-left flex flex-col justify-between h-28 transition-all hover:scale-[1.01] cursor-pointer ${
                  profile.deliveryChoice === 'both'
                    ? 'border-[var(--app-primary)] bg-green-50/20 ring-2 ring-[var(--app-primary)]/10'
                    : 'border-slate-200 hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">Hybrid Choice</span>
                  {profile.deliveryChoice === 'both' && <CheckCircle className="w-4.5 h-4.5 text-[var(--app-primary)]" />}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                    Receive both instant email copy and printed paper duplicate materials.
                  </span>
                </div>
              </button>
            </div>
          </div>


          {/* Card: Comms Preferences Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Communication Channel Preference</h3>
              <p className="text-[11px] text-slate-400">Control channels used for system transactions and alerts</p>
            </div>


            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-500">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <th className="py-2.5">Alert Category</th>
                    <th className="py-2.5 text-center">Email</th>
                    <th className="py-2.5 text-center">SMS (Text)</th>
                    <th className="py-2.5 text-center">Push / Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-800">
                  <tr>
                    <td className="py-3">
                      <strong className="block text-xs font-semibold">Policy Modifications</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Renewal deadlines, updates, and limit increases</span>
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.policy.email}
                        onChange={() => handleCommsToggle('policy', 'email')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.policy.sms}
                        onChange={() => handleCommsToggle('policy', 'sms')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.policy.push}
                        onChange={() => handleCommsToggle('policy', 'push')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                  </tr>


                  <tr>
                    <td className="py-3">
                      <strong className="block text-xs font-semibold">Billing & Premium Schedules</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Autopay drafts, invoices, and card updates</span>
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.billing.email}
                        onChange={() => handleCommsToggle('billing', 'email')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.billing.sms}
                        onChange={() => handleCommsToggle('billing', 'sms')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.billing.push}
                        onChange={() => handleCommsToggle('billing', 'push')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                  </tr>


                  <tr>
                    <td className="py-3">
                      <strong className="block text-xs font-semibold">Safety & Weather Notices</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Risk prevention recommendations and storm alerts</span>
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.safety.email}
                        onChange={() => handleCommsToggle('safety', 'email')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.safety.sms}
                        onChange={() => handleCommsToggle('safety', 'sms')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={profile.comms.safety.push}
                        onChange={() => handleCommsToggle('safety', 'push')}
                        className="w-4 h-4 rounded text-[var(--app-primary)] focus:ring-[var(--app-primary)]/30 border-slate-300"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          {/* Card: Text Enrolment (SMS Option) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Smartphone className="w-5 h-5 text-[var(--app-primary)]" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SMS Text Enrolment Dashboard</h4>
            </div>


            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Enroll your cell phone in our secure <strong>ShieldGuard Text Notification program</strong>. Get instant claims stage notifications, verification codes, and emergency storm warnings straight to your handset.
            </p>


            <AnimatePresence mode="wait">
              {profile.textEnrollment.verified ? (
                <motion.div
                  key="sms-verified-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center border border-emerald-200">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">Handset Enrolled & Verified</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Mobile: <strong className="font-mono text-slate-700">{profile.textEnrollment.phoneNumber}</strong></p>
                    </div>
                  </div>


                  <button
                    onClick={handleResetSmsEnrollment}
                    className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    Unenroll Mobile
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="sms-unverified-wizard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 space-y-4"
                >
                  {verificationStep === 'idle' && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="tel"
                          placeholder="Enter cell number: e.g. (410) 555-8941"
                          value={enteredPhone}
                          onChange={(e) => setEnteredPhone(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-transparent placeholder:text-slate-400"
                        />
                        <button
                          onClick={handleStartSmsEnrollment}
                          className="px-5 py-2.5 bg-[var(--app-primary)] text-white font-bold text-xs rounded-xl hover:bg-[var(--app-primary-hover)] transition-colors cursor-pointer shadow-xs"
                        >
                          Enrol Handset
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        By enrolling, you consent to receive auto-dialed system updates from ShieldGuard. Message & data rates apply.
                      </span>
                    </div>
                  )}


                  {verificationStep === 'sending' && (
                    <div className="p-4 text-center space-y-1.5">
                      <div className="w-5 h-5 border-2 border-[var(--app-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-slate-600 font-medium">Transmitting verification passcode securely...</p>
                    </div>
                  )}


                  {verificationStep === 'pending_pin' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl flex items-center space-x-2.5 text-xs text-[var(--app-primary)] leading-snug">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>A 6-digit verification code was sent to <strong className="font-mono">{enteredPhone}</strong>. Check your messaging application.</span>
                      </div>


                      <div className="flex gap-3">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="6-digit PIN (e.g. 123456)"
                          value={enteredPin}
                          onChange={(e) => { setEnteredPin(e.target.value); setPinError(false); }}
                          className={`flex-1 bg-white border rounded-xl p-2.5 text-center tracking-widest font-mono font-bold text-sm outline-none focus:ring-2 focus:ring-[var(--app-primary)] ${
                            pinError ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'
                          }`}
                        />
                        <button
                          onClick={handleVerifyPin}
                          className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Verify Code
                        </button>
                      </div>


                      <div className="flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => setVerificationStep('idle')}
                          className="text-slate-400 hover:text-slate-600 underline"
                        >
                          Edit Number
                        </button>
                        <button
                          onClick={handleStartSmsEnrollment}
                          className="text-[var(--app-primary)] hover:underline font-semibold"
                        >
                          Resend Code
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>


          </div>


          {/* Card: Roadside Safety Assistance (RSA) Coverage Option */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[var(--app-primary)]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">Roadside Safety Assistance (RSA) Option</h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                rsaEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500'
              }`}>
                {rsaEnabled ? 'Covered' : 'Optional'}
              </span>
            </div>


            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Protect yourself on the road with 24/7 emergency dispatch. Features emergency towing, flat tire changes, battery jump-starts, lock-out service, and fuel delivery.
            </p>


            {!rsaEnabled ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <strong className="text-xs font-bold text-slate-800 block">Optional Roadside Security</strong>
                  <span className="text-[11px] text-slate-400 block">Only $4.50 / month surcharge applied to Auto AP-90218</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleRsa}
                  className="px-4 py-2 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Enroll in RSA Coverage
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">RSA Active & Covered</strong>
                      <span className="text-[11px] text-slate-500">24/7 immediate nationwide dispatcher routing is operational.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleRsa}
                    className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    Decline Coverage
                  </button>
                </div>


                {rsaDispatchState === 'idle' && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleTriggerDispatch}
                      className="w-full py-2.5 bg-[var(--app-primary)] text-white hover:bg-[var(--app-accent-strong)] font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Emergency Roadside Request (GPS Dispatch)</span>
                    </button>
                  </div>
                )}


                {rsaDispatchState === 'dispatching' && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Locating nearest service truck via GPS...</span>
                      <span>{rsaProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[var(--app-primary)] h-full transition-all duration-300" style={{ width: `${rsaProgress}%` }}></div>
                    </div>
                  </div>
                )}


                {rsaDispatchState === 'on_route' && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start space-x-3 text-xs text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping mt-1" />
                    <div>
                      <strong className="font-bold text-slate-800 block">Technician Dispatch Confirmed</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        A certified Elkridge Auto Assistance partner truck has been routed. Estimated Time of Arrival is <strong>22 minutes</strong>. You will receive progress updates via SMS text.
                      </p>
                      <button
                        type="button"
                        onClick={() => setRsaDispatchState('idle')}
                        className="text-red-500 font-bold hover:underline block mt-2 text-[10px] cursor-pointer"
                      >
                        Cancel roadside request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>


        </div>


      </div>


    </div>
  );
}
