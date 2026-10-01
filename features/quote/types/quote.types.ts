export interface HighValueItem {
  id: string;
  category: string;
  description: string;
  value: string;
  awayFromHome: boolean;
}

export interface ClaimRecord {
  id: string;
  type: string;
  date: string;
  amountClaimed: string;
  description: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  warnings: string[];
}

export interface QuoteReadyCardProps {
  postcode: string;
  email: string;
  monthlyEstimate: string;
  coverType: string;
  bedrooms: number;
  accidentalDamage: boolean;
  legalExpenses: boolean;
  homeEmergency: boolean;
  onBack: () => void;
  compareUrl: string;
}
