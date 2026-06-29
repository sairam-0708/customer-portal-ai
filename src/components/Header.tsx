import React, { useState } from 'react';
import {
  Shield,
  Search,
  FileText,
  CreditCard,
  Layers,
  Download,
  Calendar,
  ArrowRight,
  Bell,
  User,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


interface NotificationItem {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
}


interface HeaderProps {
  onSearch: (query: string) => void;
  onFileClaim: () => void;
  onMakePayment: () => void;
  onViewPolicies: () => void;
  onDownloadIdCard: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}


export default function Header({
  onSearch,
  onFileClaim,
  onMakePayment,
  onViewPolicies,
  onDownloadIdCard,
  currentTab,
  setCurrentTab,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBellOpen, setIsBellOpen] = useState(false);


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
    { id: 'help', label: 'Help Center' },
    { id: 'profile', label: 'My Profile' }
  ];


  const unreadCount = notifications.filter(n => !n.read).length;


  return (
    <header className="w-full app-header">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between app-header-top">
          {/* Logo & Brand */}
          <div
             onClick={() => setCurrentTab('portfolio')}
            className="cursor-pointer"
            id="brand-logo"
          >
            <div className="p-1.5 flex items-center justify-center overflow-hidden rounded-md bg-transparent">
              <img
                src="https://publish-p169157-e2027173.adobeaemcloud.com/content/dam/ShieldGuard/ShieldGuard%20Modified%20Logo.png"
                alt="ShieldGuard logo"
                width={168}
                height={48}
                className="object-contain"
              />
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
                  className={`app-nav-button relative flex items-center px-3 transition-colors h-full ${
                    isActive ? 'is-active' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#0f9d58]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>


          {/* User Profile Info & Notifications Bell */}
          <div className="flex items-center space-x-4 relative" id="user-profile-badge">
           
            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setIsBellOpen(!isBellOpen)}
                className="p-2 hover:bg-[#e6f4ea] rounded-full transition-colors relative cursor-pointer"
                id="header-bell-btn"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 text-slate-500 hover:text-[#0f9d58]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white font-sans text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>


              {/* Notification Dropdown Popover */}
              <AnimatePresence>
                {isBellOpen && (
                  <>
                    {/* Invisible click backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsBellOpen(false)} />
                   
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl text-slate-800 z-50 overflow-hidden"
                      id="notifications-popover"
                    >
                      {/* Popover Header */}
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center space-x-1.5">
                          <Bell className="w-4 h-4 text-[#0f9d58]" />
                          <span className="font-bold text-xs tracking-wider text-slate-800 uppercase">Alerts & Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => { onMarkAllAsRead(); setIsBellOpen(false); }}
                            className="text-[11px] text-[#0f9d58] hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>


                      {/* Popover List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 space-y-1.5">
                            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                            <p className="text-xs font-medium">All caught up!</p>
                            <p className="text-[10px] text-slate-400">No new alerts or notification highlights.</p>
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            return (
                              <div
                                key={notif.id}
                                className={`p-4 text-left transition-colors flex items-start gap-3 relative ${
                                  notif.read ? 'bg-white opacity-60' : 'bg-blue-50/40 hover:bg-blue-50/60'
                                }`}
                              >
                                {/* Unread indicator dot */}
                                {!notif.read && (
                                  <span className="absolute left-2.5 top-4.5 w-1.5 h-1.5 bg-[#0f9d58] rounded-full" />
                                )}
                               
                                {/* Severity Icon */}
                                <div className="shrink-0 mt-0.5">
                                  {notif.type === 'warning' && (
                                    <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                                      <AlertTriangle className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                  {notif.type === 'info' && (
                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                      <Info className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                  {notif.type === 'success' && (
                                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                </div>


                                {/* Content */}
                                <div className="space-y-0.5 flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h5 className={`text-xs font-bold truncate ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                      {notif.title}
                                    </h5>
                                    <span className="text-[9px] text-slate-400 shrink-0 font-mono">{notif.date}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans pr-4">
                                    {notif.message}
                                  </p>
                                 
                                  {/* Individual Mark as Read */}
                                  {!notif.read && (
                                    <button
                                      onClick={() => onMarkAsRead(notif.id)}
                                      className="text-[10px] text-[#0f9d58] hover:underline font-semibold pt-1 block"
                                    >
                                      Mark as read
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>


                      {/* Popover Footer */}
                      <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                        <button
                          onClick={() => { setCurrentTab('profile'); setIsBellOpen(false); }}
                          className="text-xs text-[#0f9d58] hover:underline font-bold flex items-center justify-center mx-auto"
                        >
                          Configure Alert Preferences <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                      </div>


                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>


            {/* User Avatar Clickable (routes to profile) */}
            <span className="text-sm text-slate-500 hidden sm:inline select-none">
              Hello, <strong className="text-slate-900 hover:underline cursor-pointer" onClick={() => setCurrentTab('profile')}>Alex</strong>
            </span>
            <div
              onClick={() => setCurrentTab('profile')}
              className={`w-9 h-9 bg-[#e6f4ea] hover:bg-[#d8eadf] text-[#0f9d58] cursor-pointer rounded-full flex items-center justify-center font-bold text-sm border border-[#b7dfc2] transition-all ${
                currentTab === 'profile' ? 'border-white scale-105' : 'border-blue-400/50'
              }`}
              title="Go to My Profile"
              id="avatar-profile-btn"
            >
              A
            </div>
          </div>
        </div>
      </div>


      {/* Sub Header Section */}
      <div className="app-subheader py-10 px-4">
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
            <div className="relative rounded-full shadow-sm bg-white border border-slate-300 overflow-hidden flex items-center transition-all focus-within:ring-2 focus-within:ring-[#0f9d58] focus-within:border-transparent">
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
                    className="text-[#0f9d58] hover:underline font-semibold"
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
              className="px-4 py-2 bg-white hover:bg-[#e6f4ea] border border-[#b7dfc2] rounded-full text-xs font-semibold text-[#0f9d58] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-file-claim"
            >
              <FileText className="w-3.5 h-3.5 text-[#0f9d58]" />
              <span>File a claim</span>
            </button>
            <button
              onClick={onMakePayment}
              className="px-4 py-2 bg-white hover:bg-[#e6f0fa] border border-[#bcd3e6] rounded-full text-xs font-semibold text-[#0f9d58] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-make-payment"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#0f9d58]" />
              <span>Make a payment</span>
            </button>
            <button
              onClick={onViewPolicies}
              className="px-4 py-2 bg-white hover:bg-[#e6f0fa] border border-[#bcd3e6] rounded-full text-xs font-semibold text-[#0f9d58] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-view-policies"
            >
              <Layers className="w-3.5 h-3.5 text-[#0f9d58]" />
              <span>View my policies</span>
            </button>
            <button
              onClick={onDownloadIdCard}
              className="px-4 py-2 bg-white hover:bg-[#e6f0fa] border border-[#bcd3e6] rounded-full text-xs font-semibold text-[#0f9d58] transition-all flex items-center space-x-1.5 shadow-xs hover:shadow-md"
              id="qa-download-id"
            >
              <Download className="w-3.5 h-3.5 text-[#0f9d58]" />
              <span>Download ID card</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
