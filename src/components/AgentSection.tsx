import React from 'react';
import { AgentInfo } from '../types';
import { Phone, Smartphone, Mail, MapPin, Clock, Lightbulb, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface AgentSectionProps {
  agent: AgentInfo;
  onContactClick: () => void;
}

export default function AgentSection({ agent, onContactClick }: AgentSectionProps) {
  return (
    <div className="flex flex-col space-y-6" id="agency-section">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <span className="text-xs font-bold tracking-wider text-slate-700 block uppercase font-sans">
            YOUR LOCAL AGENT
          </span>
          <h2 className="text-2xl font-sans font-medium text-slate-900 mt-0.5">
            My Agency
          </h2>
        </div>
        <button 
          onClick={onContactClick}
          className="text-slate-700 hover:text-slate-950 text-xs font-semibold flex items-center space-x-1 hover:underline"
          id="btn-agency-contact"
        >
          <span>Contact</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-5"
        id="agent-detail-card"
      >
        {/* Agent Profile Block */}
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 text-slate-800 font-bold font-sans text-lg flex items-center justify-center shadow-2xs">
            MR
          </div>
          <div>
            <h3 className="font-sans font-semibold text-lg text-slate-900">
              {agent.name}
            </h3>
            <p className="text-xs text-slate-500 font-sans font-medium">
              {agent.title}
            </p>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              {agent.agency}
            </p>
          </div>
        </div>

        {/* Contact Info Items */}
        <div className="space-y-3.5 pt-2 border-t border-slate-100 text-sm">
          <div className="flex items-center space-x-3 text-slate-700">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-sans">
              Office <a href={`tel:${agent.officePhone.replace(/\D/g, '')}`} className="hover:text-slate-700 font-medium">{agent.officePhone}</a>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-700">
            <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-sans">
              Mobile <a href={`tel:${agent.mobilePhone.replace(/\D/g, '')}`} className="hover:text-slate-700 font-medium">{agent.mobilePhone}</a>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-700">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-sans break-all">
              Email <a href={`mailto:${agent.email}`} className="hover:text-slate-700 font-medium">{agent.email}</a>
            </span>
          </div>

          <div className="flex items-start space-x-3 text-slate-700">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="font-sans leading-relaxed">
              Address <span className="font-medium">{agent.address}</span>
            </span>
          </div>

          <div className="flex items-start space-x-3 text-slate-500 text-xs border-t border-slate-50 pt-3">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="font-sans leading-relaxed">
              {agent.hours}
            </span>
          </div>
        </div>

        {/* Agent Insight Block */}
        <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-4" id="agent-insight-box">
          <div className="flex items-start space-x-2.5">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block font-sans">
                AGENT INSIGHT
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {agent.insight}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
