'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { ballotContract } from '@/contracts/ballot.contract';

export function useData() {
  const { isConnected } = useAccount();
  const { data: chairPerson } = useReadContract({
    ...ballotContract,
    functionName: 'chairperson',
  });
  const { data: winnerName, refetch: refetchWinnerName } = useReadContract({
    ...ballotContract,
    functionName: 'winnerName',
  });
  const { data: winningProposal, refetch: refetchWinningProposal } =
    useReadContract({
      ...ballotContract,
      functionName: 'winningProposal',
    });

  return {
    data: {
      chairPerson,
      winnerName,
      winningProposal,
    },
    isConnected: isConnected,
    refetchWinnerName,
    refetchWinningProposal,
  };
}
