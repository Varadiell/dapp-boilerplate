'use client';

import { ballotContract } from '@/contracts/ballot.contract';
import { bytesToString } from '@/utils/bytesToString';
import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';

export type BallotProposalRow = { name: string; voteCount: number };

/** Proposal rows are public `view` reads; no connected wallet required. */
export function useBallotProposals(proposalsCount: number | undefined) {
  const contracts = useMemo(() => {
    if (proposalsCount === undefined || proposalsCount === 0) {
      return [];
    }
    return Array.from({ length: proposalsCount }, (_, i) => ({
      ...ballotContract,
      functionName: 'proposals' as const,
      args: [BigInt(i)] as const,
    }));
  }, [proposalsCount]);

  const { data, isPending, refetch } = useReadContracts({
    contracts,
    query: {
      gcTime: 0,
      enabled: contracts.length > 0,
    },
  });

  const proposals: BallotProposalRow[] = useMemo(() => {
    if (!data) return [];
    return data
      .map((item) => {
        if (item.status !== 'success') return undefined;
        const row = item.result as readonly [`0x${string}`, bigint];
        return {
          name: bytesToString(row[0]),
          voteCount: Number(row[1]),
        };
      })
      .filter((row): row is BallotProposalRow => row !== undefined);
  }, [data]);

  return {
    proposals,
    isProposalsLoading: isPending,
    refetchProposals: refetch,
  };
}
