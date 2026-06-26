import { Policy, AgentInfo, Offer, ResourceItem, PaymentRecord, Claim } from '../types';

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'policy_auto',
    type: 'auto',
    title: '2021 Honda Accord',
    policyNumber: 'Q55-8821-004',
    status: 'Active',
    renewalDate: 'Sep 14, 2026',
    premium: 142,
    coverage: 'Comprehensive • Collision',
    deductible: 500,
  },
  {
    id: 'policy_home',
    type: 'home',
    title: '412 Maple Street',
    policyNumber: 'H32-4490-117',
    status: 'Active',
    renewalDate: 'Mar 1, 2027',
    premium: 218,
    coverage: 'Dwelling • Liability',
    dwellingLimit: 350000,
  },
];

export const INITIAL_AGENT: AgentInfo = {
  name: 'Michael Reardon',
  title: 'Licensed Insurance Agent',
  agency: 'Reardon Insurance Group • ShieldGuard Agent',
  officePhone: '(410) 555-0193',
  mobilePhone: '(410) 555-0247',
  email: 'm.reardon@reardonigrp.com',
  address: '88 Commerce Dr, Elkridge, MD 21075',
  hours: 'Mon – Fri 9:00 am – 5:30 pm • Closed weekends',
  insight: 'Your auto policy renews in 82 days. With home values up in Elkridge this year, now is a great time to review your dwelling coverage limit before renewal.',
};

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'paperless',
    title: 'Go paperless, save instantly',
    subtitle: 'Paperless billing & documents',
    description: 'Switch to paperless and save $3/mo across your active policies. Bills, documents, and renewal notices delivered to your inbox — opt out anytime.',
    savingsYearly: 36,
    savingsMonthly: 3,
    active: false,
  },
];

export const INITIAL_AUTO_PAYMENTS: PaymentRecord[] = [
  {
    id: 'p_auto_1',
    date: 'Jun 1, 2026',
    description: 'Monthly premium',
    amount: 142.00,
    status: 'Paid',
  },
  {
    id: 'p_auto_2',
    date: 'May 1, 2026',
    description: 'Monthly premium',
    amount: 142.00,
    status: 'Paid',
  },
  {
    id: 'p_auto_3',
    date: 'Apr 1, 2026',
    description: 'Monthly premium',
    amount: 142.00,
    status: 'Paid',
  },
];

export const INITIAL_HOME_PAYMENTS: PaymentRecord[] = [
  {
    id: 'p_home_1',
    date: 'Jun 1, 2026',
    description: 'Monthly premium',
    amount: 218.00,
    status: 'Paid',
  },
  {
    id: 'p_home_2',
    date: 'May 1, 2026',
    description: 'Monthly premium',
    amount: 218.00,
    status: 'Paid',
  },
  {
    id: 'p_home_3',
    date: 'Apr 1, 2026',
    description: 'Monthly premium',
    amount: 218.00,
    status: 'Paid',
  },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res_claims',
    category: 'CLAIMS',
    title: 'How to file a claim step by step',
    description: 'A walkthrough of what to expect from the moment you report an incident to final resolution.',
    linkText: 'Read guide',
    type: 'guide',
  },
  {
    id: 'res_home',
    category: 'HOME',
    title: 'Is your home underinsured?',
    description: "Rising rebuild costs mean many homeowners have less coverage than they think. Here's how to check.",
    linkText: 'Read article',
    type: 'article',
  },
  {
    id: 'res_auto',
    category: 'AUTO',
    title: 'What to do after an accident',
    description: 'Stay calm and follow these steps — from documenting the scene to contacting your agent.',
    linkText: 'Read guide',
    type: 'guide',
  },
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'claim_1',
    policyId: 'policy_auto',
    policyTitle: '2021 Honda Accord',
    date: 'Feb 12, 2026',
    description: 'Minor bumper scrape in grocery parking lot.',
    status: 'Closed',
    amountClaimed: 450,
  }
];

// Helper functions for Local Storage interaction
const IS_SERVER = typeof window === 'undefined';

export function getStoredData<T>(key: string, initial: T): T {
  if (IS_SERVER) return initial;
  try {
    const item = window.localStorage.getItem(`shieldguard_portal_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch (e) {
    console.error(`Error loading state ${key}`, e);
    return initial;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (IS_SERVER) return;
  try {
    window.localStorage.setItem(`shieldguard_portal_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving state ${key}`, e);
  }
}
