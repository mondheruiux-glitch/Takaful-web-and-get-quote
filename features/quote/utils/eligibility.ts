import { EligibilityResult } from "../types/quote.types";

export function evaluateEligibility(data: {
  ownership: string;
  coverType: string;
  propertyUse: string;
  unoccupiedPeriod: string;
}): EligibilityResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (data.ownership === 'tenant' && (data.coverType === 'buildings' || data.coverType === 'both')) {
    reasons.push(
      'As a tenant you are not eligible for Buildings cover. Please select Contents Only to continue.'
    );
  }
  if (data.propertyUse === 'let') {
    warnings.push(
      'Let properties typically require specialist landlord cover. Please contact us to discuss your options before proceeding.'
    );
  }
  if (data.propertyUse === 'holiday') {
    warnings.push(
      'Holiday homes may have restricted cover periods. Please review the policy terms carefully.'
    );
  }
  if (data.unoccupiedPeriod === 'gt90') {
    warnings.push(
      'Properties unoccupied for more than 90 days may have restricted cover. Please contact us to discuss.'
    );
  }

  return { eligible: reasons.length === 0, reasons, warnings };
}

export function calculateMonthlyEstimate(params: {
  coverType: string;
  bedrooms: number;
  buildingsAccidentalDamage: boolean;
  contentsAccidentalDamage: boolean;
  legalExpenses: boolean;
  homeEmergency: boolean;
  claimsCount: number;
  floodRisk: boolean;
  hadSubsidence: boolean;
}): string {
  let base = params.coverType === 'both' ? 32 : params.coverType === 'buildings' ? 22 : 16;
  base += (params.bedrooms - 1) * 3.5;
  if (params.buildingsAccidentalDamage) base += 3.5;
  if (params.contentsAccidentalDamage) base += 2.5;
  if (params.legalExpenses) base += 2.0;
  if (params.homeEmergency) base += 3.0;

  if (params.claimsCount === 1) base += 5;
  else if (params.claimsCount === 2) base += 10;
  else if (params.claimsCount >= 3) base += 18;

  if (params.floodRisk) base += 5;
  if (params.hadSubsidence) base += 8;

  return Math.max(15, base).toFixed(2);
}
