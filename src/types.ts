export interface Policy {
  id: string;
  type: 'auto' | 'home';
  title: string;
  policyNumber: string;
  status: 'Active' | 'Inactive';
  renewalDate: string;
  premium: number; // monthly premium
  coverage: string;
  deductible?: number; // for auto
  dwellingLimit?: number; // for home
}

export interface Claim {
  id: string;
  policyId: string;
  policyTitle: string;
  date: string;
  description: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Closed';
  amountClaimed?: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface AgentInfo {
  name: string;
  title: string;
  agency: string;
  officePhone: string;
  mobilePhone: string;
  email: string;
  address: string;
  hours: string;
  insight: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  savingsYearly: number;
  savingsMonthly: number;
  active: boolean;
}

export interface ResourceItem {
  id: string;
  category: 'CLAIMS' | 'HOME' | 'AUTO';
  title: string;
  description: string;
  linkText: string;
  type: 'guide' | 'article';
}
