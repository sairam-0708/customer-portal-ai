import React, { useState } from 'react';
import { Shield, Search, FileText, CreditCard, Layers, Download, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onFileClaim: () => void;
  onMakePayment: () => void;
  onViewPolicies: () => void;
  onDownloadIdCard: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Header({
  onSearch,
  onFileClaim,
  onMakePayment,
  onViewPolicies,
  onDownloadIdCard,
  currentTab,
  setCurrentTab
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const navItems = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'policies', label: 'My Policies' },
    { id: 'billing', label: 'My Billing' },
    { id: 'claims', label: 'Claims' },
    { id: 'documents', label: 'Documents' },
    { id: 'help', label: 'Help Center' }
  ];

  return (
    <header className="w-full bg-[#004f8f] text-white">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-blue-800/40">
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('portfolio')} 
            className="flex items-center space-x-2 cursor-pointer group"
            id="brand-logo"
          >
            <div className="bg-white p-1.5 rounded-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Shield className="w-6 h-6 text-[#004f8f] fill-[#004f8f]" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-lg tracking-wider uppercase block font-sans">S H I E L D G U A R D</span>
              <span className="text-[9px] tracking-widest text-blue-200 uppercase block font-mono">INSURANCE</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4 h-full" id="desktop-nav">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                  }}
                  className={`relative flex items-center px-3 text-sm font-medium transition-colors h-full hover:text-blue-100 ${
                    isActive ? 'text-white' : 'text-blue-100/80'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Info / Small Devices menu indicator */}
          <div className="flex items-center space-x-4" id="user-profile-badge">
            <span className="text-sm text-blue-100 hidden sm:inline">Hello, <strong>Alex</strong></span>
            <div className="w-9 h-9 bg-blue-700 hover:bg-blue-600 cursor-pointer rounded-full flex items-center justify-center font-bold text-sm border-2 border-blue-400/50 transition-all">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Sub Header Section */}
      <div className="bg-[#f0f6fa] text-[#1a202c] py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-sans font-medium tracking-tight text-slate-900"
            id="greeting-heading"
          >
            Good afternoon, Alex.
          </motion.h1>
          <p className="text-sm text-slate-500 mt-1 font-sans">
            How can we help you today?
          </p>

          {/* Interactive Search Bar */}
          <div className="mt-6 max-w-xl mx-auto relative" id="search-container">
            <div className="relative rounded-full shadow-sm bg-white border border-slate-300 overflow-hidden flex items-center transition-all focus-within:ring-2 focus-within:ring-[#004f8f] focus-within:border-transparent">
              <input
                type="text"
                placeholder="Search policies, claims, documents..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-5 py-3.5 pr-12 text-slate-800 placeholder-slate-400 bg-white border-0 outline-none text-sm focus:ring-0"
              />
              <button 
                className="absolute right-1 top-1 bottom-1 px-4 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border-l border-slate-200 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            
            {/* Search filter results feedback */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute z-10 left-0 right-0 mt-2 bg-white text-left text-xs text-slate-600 p-2 rounded-lg border border-slate-200 shadow-lg flex items-center justify-between"
                >
                  <span>Filtering dashboard for: <strong className="text-slate-900">"{searchQuery}"</strong></span>
                  <button 
                    onClick={() => { setSearchQuery(''); onSearch(''); }}
                    className="text-[#004f8f] hover:underline font-semibold"
                  >
                    Clear Filter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3" id="quick-actions-bar">
            <button
              onClick={onFileClaim}
              className="px-4 py-2 bg-white hover:bg-[#e6f0fa] border border-[#bcd3e6] rounded-full text-xs font-semibold text-[#004f8f] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-file-claim"
            >
              <FileText className="w-3.5 h-3.5 text-[#004f8f]" />
              <span>File a claim</span>
            </button>
            <button
              onClick={onMakePayment}
              className="px-4 py-2 bg-white hover:bg-[#e6f0fa] border border-[#bcd3e6] rounded-full text-xs font-semibold text-[#004f8f] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-make-payment"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#004f8f]" />
              <span>Make a payment</span>
            </button>
            <button
              onClick={onViewPolicies}
              className="px-4 py-2 bg-white hover:bg-[#e6f0fa] border border-[#bcd3e6] rounded-full text-xs font-semibold text-[#004f8f] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-view-policies"
            >
              <Layers className="w-3.5 h-3.5 text-[#004f8f]" />
              <span>View my policies</span>
            </button>
            <button
              onClick={onDownloadIdCard}
              className="px-4 py-2 bg-white hover:bg-[#e6f0fa] border border-[#bcd3e6] rounded-full text-xs font-semibold text-[#004f8f] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-download-id"
            >
              <Download className="w-3.5 h-3.5 text-[#004f8f]" />
              <span>Download ID card</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
