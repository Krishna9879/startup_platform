// Shared data store for investor interests and messages
// In production, this would be replaced with API calls to a database

export interface InvestorInterest {
  id: string;
  investorId: number;
  investorName: string;
  investorEmail: string;
  startupId: number;
  startupName: string;
  interestType: 'Viewed' | 'Interested' | 'Contacted';
  status: 'Interested' | 'DetailsShared';
  sharedEmail?: string;
  sharedPhone?: string;
  message?: string;
  timestamp: string;
  read: boolean;
}

export interface FundingStatus {
  startupId: number;
  fundingNeeded: number;
  fundingReceived: number;
  investments: Array<{
    investorId: number;
    investorName: string;
    amount: number;
    equity: number;
    status: 'Pending' | 'Approved' | 'Funded';
    date: string;
  }>;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  INTERESTS: 'investor_interests',
  FUNDING: 'funding_status',
};

export const investorDataService = {
  // Get all interests for a startup
  getInterestsForStartup(startupId: number): InvestorInterest[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTERESTS);
      if (!stored) return [];

      const allInterests: InvestorInterest[] = JSON.parse(stored);
      return allInterests.filter(interest => interest.startupId === startupId);
    } catch (e) {
      console.error('Error reading interests from localStorage:', e);
      return [];
    }
  },

  // Get all interests for an investor
  getInterestsForInvestor(investorId: number): InvestorInterest[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTERESTS);
      if (!stored) return [];

      const allInterests: InvestorInterest[] = JSON.parse(stored);
      return allInterests.filter(interest => interest.investorId === investorId);
    } catch (e) {
      console.error('Error reading interests from localStorage:', e);
      return [];
    }
  },

  // Add interest from investor
  addInterest(interest: Omit<InvestorInterest, 'id' | 'timestamp' | 'read' | 'status'>): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEYS.INTERESTS);
    const allInterests: InvestorInterest[] = stored ? JSON.parse(stored) : [];

    const newInterest: InvestorInterest = {
      ...interest,
      id: `interest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Interested',
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Check if interest already exists
    const existingIndex = allInterests.findIndex(
      i => i.investorId === interest.investorId && i.startupId === interest.startupId
    );

    if (existingIndex >= 0) {
      // Keep existing status if it was already DetailsShared? 
      // Actually usually an investor can't re-show interest if details shared, but let's be safe.
      const existing = allInterests[existingIndex];
      allInterests[existingIndex] = {
        ...newInterest,
        status: existing.status,
        sharedEmail: existing.sharedEmail,
        sharedPhone: existing.sharedPhone
      };
    } else {
      allInterests.push(newInterest);
    }

    localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(allInterests));
  },

  // Share details from founder to investor
  shareDetails(interestId: string, email: string, phone: string): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEYS.INTERESTS);
    if (!stored) return;

    const allInterests: InvestorInterest[] = JSON.parse(stored);
    const interest = allInterests.find(i => i.id === interestId);
    if (interest) {
      interest.status = 'DetailsShared';
      interest.sharedEmail = email;
      interest.sharedPhone = phone;
      localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(allInterests));
    }
  },

  // Mark interest as read
  markAsRead(interestId: string): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEYS.INTERESTS);
    if (!stored) return;

    const allInterests: InvestorInterest[] = JSON.parse(stored);
    const interest = allInterests.find(i => i.id === interestId);
    if (interest) {
      interest.read = true;
      localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(allInterests));
    }
  },

  // Get funding status for a startup
  getFundingStatus(startupId: number): FundingStatus | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(STORAGE_KEYS.FUNDING);
    if (!stored) {
      // Return default if no data exists
      return {
        startupId,
        fundingNeeded: 1000000,
        fundingReceived: 0,
        investments: [],
      };
    }

    const allFunding: FundingStatus[] = JSON.parse(stored);
    const funding = allFunding.find(f => f.startupId === startupId);

    return funding || {
      startupId,
      fundingNeeded: 1000000,
      fundingReceived: 0,
      investments: [],
    };
  },

  // Add investment
  addInvestment(startupId: number, investment: FundingStatus['investments'][0]): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEYS.FUNDING);
    const allFunding: FundingStatus[] = stored ? JSON.parse(stored) : [];

    let funding = allFunding.find(f => f.startupId === startupId);
    if (!funding) {
      funding = {
        startupId,
        fundingNeeded: 1000000,
        fundingReceived: 0,
        investments: [],
      };
      allFunding.push(funding);
    }

    funding.investments.push(investment);
    if (investment.status === 'Funded') {
      funding.fundingReceived += investment.amount;
    }

    localStorage.setItem(STORAGE_KEYS.FUNDING, JSON.stringify(allFunding));
  },
};
