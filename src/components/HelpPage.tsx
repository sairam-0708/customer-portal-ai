import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Sparkles, 
  CheckCircle, 
  ChevronDown, 
  User, 
  Clock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Policy, AgentInfo } from '../types';

interface HelpPageProps {
  policies: Policy[];
  agent: AgentInfo;
  showToast: (message: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage({ policies, agent, showToast }: HelpPageProps) {
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Agent message form state
  const [agentMsgSubject, setAgentMsgSubject] = useState('coverage_review');
  const [agentMsgBody, setAgentMsgBody] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Chatbot Assistant State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi there! I am your MyShieldGuard digital concierge. I can answer questions about your auto/home policies, premium invoices, or local agent Michael Reardon. How can I assist you today?",
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotTyping]);

  // FAQs Database
  const faqs: FAQItem[] = [
    {
      id: 'faq_1',
      category: 'policies',
      question: 'How do I add a new driver or car to my Auto policy?',
      answer: "To add a new vehicle or driver, select 'My Policies' and click 'Get a New Quote' or contact Michael Reardon directly at (410) 555-0193. Adding cars usually adjusts your premium based on the car's age, safety ratings, and the driver's history."
    },
    {
      id: 'faq_2',
      category: 'billing',
      question: 'What is a deductible and how does it work during a claim?',
      answer: "A deductible is the out-of-pocket amount you agree to pay before ShieldGuard coverages kick in. For example, if you have a $500 deductible and a garage quote is $2,400, you pay $500 directly to the garage, and ShieldGuard pays the remaining $1,900."
    },
    {
      id: 'faq_3',
      category: 'billing',
      question: 'How do I sign up for Auto-Pay and is there a fee?',
      answer: "Auto-Pay can be turned on inside 'My Billing' with a single click. There are absolutely no setup fees, and enrolling makes you eligible for an automatic $3.00 monthly discount when combined with Paperless Statements!"
    },
    {
      id: 'faq_4',
      category: 'claims',
      question: 'What documents do I need to supply to report an accident?',
      answer: "We recommend documenting the collision scene with photographs, gathering insurance cards and driver licenses of other parties involved, and saving any official police reports. You can upload these directly inside our 'Claims' tab."
    },
    {
      id: 'faq_5',
      category: 'policies',
      question: 'How can I get physical insurance binder cards?',
      answer: "You can download electronic PDF Auto ID cards instantly in the 'Portfolio' or 'Documents' page. To request physical cards printed on hardstock paper, contact Michael Reardon's office to have them shipped via USPS mail."
    }
  ];

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const query = faqSearch.toLowerCase();
    return !faqSearch || 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query);
  });

  // Message Agent handler
  const handleSendMessageToAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentMsgBody.trim()) return;

    setIsSendingMsg(true);
    setTimeout(() => {
      setIsSendingMsg(false);
      setAgentMsgBody('');
      showToast(`Your message has been secure-dispatched to Michael Reardon's inbox. A reply will be routed to your email.`);
    }, 1200);
  };

  // Automated chatbot bot replies
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    // Simulate smart keyword-based responder
    setTimeout(() => {
      setIsBotTyping(false);
      let replyText = "I'm not completely sure about that. Let me look up generic details, or you can contact Michael Reardon at (410) 555-0193.";

      const lower = userText.toLowerCase();
      if (lower.includes('deductible') || lower.includes('out of pocket')) {
        const autoPolicy = policies.find(p => p.type === 'auto');
        const ded = autoPolicy?.deductible || 500;
        replyText = `Your active comprehensive deductible on the ${autoPolicy?.title || 'Accord'} policy is currently $${ded}. During a claim, you pay this amount directly to the repair shop, and ShieldGuard covers the remainder.`;
      } else if (lower.includes('premium') || lower.includes('cost') || lower.includes('how much') || lower.includes('pay')) {
        const total = policies.reduce((s, p) => s + p.premium, 0);
        replyText = `Your combined premium for your home and auto policies is currently $${total.toFixed(2)} per month. Your next automatic premium draft is scheduled for July 1, 2026.`;
      } else if (lower.includes('agent') || lower.includes('michael') || lower.includes('reardon') || lower.includes('phone')) {
        replyText = `Your dedicated licensed ShieldGuard agent is ${agent.name} of ${agent.agency}. His office phone number is ${agent.officePhone}, and his office is located at ${agent.address}.`;
      } else if (lower.includes('paperless') || lower.includes('discount') || lower.includes('save')) {
        replyText = "Switching to Paperless Statements saves you $3.00 every month on combined policies, which is $36.00 yearly. You can toggle this discount instantly in the Offers module.";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = "Hello Alex! I am ready to help. You can ask me things like 'What is my deductible?' or 'How much is my premium?' or 'Give me my agent phone number'.";
      } else if (lower.includes('claim') || lower.includes('accident') || lower.includes('crash')) {
        replyText = "If you've been in an accident, ensure safety first, record scene photos, and file a claim report directly in the 'Claims' tab. Our claims specialists will contact you shortly.";
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-8" id="help-center-wrapper">
      {/* 1. Page Header */}
      <div>
        <span className="text-xs font-bold tracking-wider text-[#004f8f] block uppercase font-sans">ShieldGuard Care Portal</span>
        <h1 className="text-2xl sm:text-3xl font-sans font-medium text-slate-900 mt-1">Customer Help Center</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans">Browse helpful guides, search common FAQs, or chat with our digital assistant</p>
      </div>

      {/* 2. Top Split Row - FAQ Directory vs Chat Concierge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (FAQ Accordion - 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <h3 className="font-bold text-base text-slate-950 font-sans">ShieldGuard FAQ Directory</h3>
              <HelpCircle className="w-4 h-4 text-[#004f8f]" />
            </div>

            {/* FAQ Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search FAQs (e.g. deductible, auto-pay)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#004f8f]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Accordions */}
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No FAQ answers match your search term.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;

                  return (
                    <div 
                      key={faq.id} 
                      className="border border-slate-100 bg-slate-50/50 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white font-sans">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Contacts Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Phone className="w-5 h-5 text-[#004f8f]" />
              <h4 className="text-xs font-bold text-slate-900 pt-1">Call ShieldGuard Support</h4>
              <p className="text-[11px] text-slate-400 leading-snug">Available 24/7 for urgent road towing claims.</p>
              <span className="text-xs font-bold text-[#004f8f] block pt-1">1-800-458-0811</span>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4">
              <Mail className="w-5 h-5 text-[#004f8f]" />
              <h4 className="text-xs font-bold text-slate-900 pt-1">Email headquarters</h4>
              <p className="text-[11px] text-slate-400 leading-snug">Average reply time is 2 business days.</p>
              <span className="text-xs font-bold text-[#004f8f] block pt-1">support@shieldguard.com</span>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4">
              <MapPin className="w-5 h-5 text-[#004f8f]" />
              <h4 className="text-xs font-bold text-slate-900 pt-1">Visit ShieldGuard Indemnity</h4>
              <p className="text-[11px] text-slate-400 leading-snug">Official corporate head office grounds.</p>
              <span className="text-xs font-bold text-slate-700 block pt-1">Baltimore, Maryland, USA</span>
            </div>
          </div>
        </div>

        {/* Right Side (AI Concierge Chat Widget - 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden h-[480px] flex flex-col justify-between" id="ai-chat-widget">
          {/* Concierge Header */}
          <div className="bg-[#004f8f] p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs">MyShieldGuard Concierge Agent</h4>
                <span className="text-[9px] text-blue-200 font-mono">AUTOMATED SUPPORT CONCIERGE</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold rounded-full uppercase tracking-wider">
              ● Online
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatMessages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}>
                  {isBot ? (
                    <div className="w-7 h-7 bg-blue-100 text-[#004f8f] rounded-full flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                      A
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isBot ? 'bg-white border border-slate-200/60 text-slate-800' : 'bg-[#004f8f] text-white'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 block px-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isBotTyping && (
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 bg-blue-100 text-[#004f8f] rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="p-3 bg-white border border-slate-200/60 rounded-2xl flex items-center space-x-1.5 h-8">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat input form */}
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Ask about deductible, premiums, agent..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:ring-2 focus:ring-[#004f8f] h-9"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="w-9 h-9 bg-[#004f8f] disabled:bg-slate-200 hover:bg-[#003d70] text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* 3. Message Local Agent Form section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs max-w-3xl">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-5">
          <Mail className="w-5 h-5 text-[#004f8f]" />
          <h3 className="font-sans font-bold text-base text-slate-900">Secure Dispatch to Agent {agent.name}</h3>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Need a policy renewal review or limits appraisal? Drop Michael Reardon a secure direct line below. He generally returns replies during standard business hours.
        </p>

        <form onSubmit={handleSendMessageToAgent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject Matter</label>
              <select
                value={agentMsgSubject}
                onChange={(e) => setAgentMsgSubject(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="coverage_review">Policy Limits Review request</option>
                <option value="add_asset">Add Driver / Car Coverage quote</option>
                <option value="billing_discrepancy">Billing invoice inquiry</option>
                <option value="other_support">Other customer policy support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Agent Recipient</label>
              <input
                type="text"
                disabled
                value={`${agent.name} (${agent.agency})`}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="block text-xs font-semibold text-slate-500">Your message details</label>
              <span className="text-[10px] text-slate-400 font-mono">
                {agentMsgBody.length} / 500 chars
              </span>
            </div>
            <textarea
              required
              maxLength={500}
              placeholder="Hi Michael, I would love to check if I am eligible for any multi-car discounts on my auto policy..."
              value={agentMsgBody}
              onChange={(e) => setAgentMsgBody(e.target.value)}
              rows={4}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#004f8f] font-sans"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Directly delivered to: {agent.email}</span>
            </span>

            <button
              type="submit"
              disabled={isSendingMsg || !agentMsgBody.trim()}
              className="px-5 py-2.5 bg-[#004f8f] disabled:bg-slate-200 hover:bg-[#003d70] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSendingMsg ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Secure Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
