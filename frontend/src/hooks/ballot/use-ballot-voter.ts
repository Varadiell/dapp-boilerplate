'use client';

import { ballotContract } from '@/contracts/ballot.contract';
import { useReadContract } from 'wagmi';

/** `voters(address)` must not stay stale after wallet switch or after someone delegates to this address. */
export function useBallotVoter(address: `0x${string}` | undefined) {
  const {
    data: account,
    refetch: refetchAccount,
    ...rest
  } = useReadContract({
    ...ballotContract,
    functionName: 'voters',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      structuralSharing: false,
    },
  });

  return { account, refetchAccount, ...rest };
}
