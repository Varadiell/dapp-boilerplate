'use client';

import { useAccount, useReadContract } from 'wagmi';
import { ballotContract } from '@/contracts/ballot.contract';

export function useData() {
  const { isConnected } = useAccount();
  const { data: chairPerson, refetch: refetchChairPerson } = useReadContract({
    ...ballotContract,
    functionName: 'chairperson',
  });

  return {
    data: {
      chairPerson,
    },
    isConnected: isConnected,
    refetchChairPerson,
  };
}
