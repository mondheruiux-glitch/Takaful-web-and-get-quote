import { CONTRIBUTIONS, TRANSACTIONS } from './mock-data';
import { Contribution, Transaction } from './types';

export const RECONCILED_TX_STORAGE_KEY = 'takaful_reconciled_tx_ids';
export const SYNC_EVENT_NAME = 'takaful_reconciliation_sync';

/**
 * Returns true if the transaction and contribution represent the same participant/certificate/amount/record.
 */
export function isMatchingTxAndContribution(tx: Transaction, contrib: Contribution): boolean {
  // Direct ID digit match (e.g. TXN-8808 <-> CONT-2024-8808)
  const txDigits = tx.id.replace(/\D/g, '');
  const contribDigits = contrib.id.replace(/\D/g, '');
  if (txDigits && contribDigits && txDigits === contribDigits) {
    return true;
  }

  // Certificate ID match
  if (tx.certificateId && contrib.certificateId && tx.certificateId === contrib.certificateId) {
    return true;
  }

  // Participant ID match + amount match
  if (tx.participantId && contrib.participantId && tx.participantId === contrib.participantId && Math.abs(tx.amount - contrib.amount) < 0.01) {
    return true;
  }

  // Reference contains certificate suffix
  if (tx.reference && contrib.certificateId) {
    const certSuffix = contrib.certificateId.slice(-4);
    if (tx.reference.includes(certSuffix)) {
      return true;
    }
  }

  return false;
}

/**
 * Get the list of reconciled transaction IDs from localStorage.
 */
export function getStoredReconciledTxIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECONCILED_TX_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read reconciled transaction IDs from localStorage', err);
    return [];
  }
}

/**
 * Save reconciled transaction IDs to localStorage and broadcast an event.
 */
export function saveReconciledTxIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const uniqueIds = Array.from(new Set(ids));
    localStorage.setItem(RECONCILED_TX_STORAGE_KEY, JSON.stringify(uniqueIds));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { reconciledIds: uniqueIds } }));
  } catch (err) {
    console.error('Failed to write reconciled transaction IDs to localStorage', err);
  }
}

/**
 * Get synchronized transactions by merging base mock transactions with stored reconciliation status.
 */
export function getSynchronizedTransactions(): Transaction[] {
  const reconciledIds = getStoredReconciledTxIds();
  return TRANSACTIONS.map(tx => {
    if (reconciledIds.includes(tx.id)) {
      return {
        ...tx,
        status: 'Reconciled',
        reconciled: true,
      };
    }
    return tx;
  });
}

/**
 * Get synchronized contributions by checking if any matching transaction has been reconciled.
 */
export function getSynchronizedContributions(): Contribution[] {
  const reconciledIds = getStoredReconciledTxIds();

  return CONTRIBUTIONS.map(contrib => {
    // Find if any transaction matching this contribution has been reconciled
    const isReconciled = TRANSACTIONS.some(tx => {
      if (!reconciledIds.includes(tx.id)) return false;
      return isMatchingTxAndContribution(tx, contrib);
    });

    if (isReconciled) {
      return {
        ...contrib,
        status: 'Collected',
        collectedDate: contrib.collectedDate ?? contrib.dueDate ?? '1 Jul 2026',
      };
    }

    return contrib;
  });
}

/**
 * Mark a single transaction as reconciled and update related contributions.
 */
export function reconcileTransaction(txId: string): { matchingContrib?: Contribution; updatedTxIds: string[] } {
  const current = getStoredReconciledTxIds();
  const next = Array.from(new Set([...current, txId]));
  saveReconciledTxIds(next);

  const tx = TRANSACTIONS.find(t => t.id === txId);
  let matchingContrib: Contribution | undefined;
  if (tx) {
    matchingContrib = CONTRIBUTIONS.find(c => isMatchingTxAndContribution(tx, c));
  }

  return { matchingContrib, updatedTxIds: next };
}

/**
 * Mark multiple transactions as reconciled.
 */
export function reconcileBatchTransactions(txIds: string[]): string[] {
  const current = getStoredReconciledTxIds();
  const next = Array.from(new Set([...current, ...txIds]));
  saveReconciledTxIds(next);
  return next;
}

/**
 * Reconcile a contribution directly from the contributions page or drawer.
 * This also reconciles the corresponding transaction in the Treasury Cash Book.
 */
export function reconcileContribution(contribId: string): { matchingTx?: Transaction; updatedTxIds: string[] } {
  const contrib = CONTRIBUTIONS.find(c => c.id === contribId);
  const current = getStoredReconciledTxIds();
  let updatedTxIds = current;
  let matchingTx: Transaction | undefined;

  if (contrib) {
    matchingTx = TRANSACTIONS.find(t => isMatchingTxAndContribution(t, contrib));
    if (matchingTx) {
      updatedTxIds = Array.from(new Set([...current, matchingTx.id]));
      saveReconciledTxIds(updatedTxIds);
    } else {
      // If no direct transaction found, create an identifier representation
      const syntheticTxId = `TXN-${contrib.id.replace(/\D/g, '')}`;
      updatedTxIds = Array.from(new Set([...current, syntheticTxId]));
      saveReconciledTxIds(updatedTxIds);
    }
  }

  return { matchingTx, updatedTxIds };
}

/**
 * Reset all reconciliations back to mock data defaults.
 */
export function resetAllReconciliations(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECONCILED_TX_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { reconciledIds: [] } }));
  } catch (err) {
    console.error('Failed to reset reconciliations', err);
  }
}
