'use client';

import { ballotContract } from '@/contracts/ballot.contract';
import { useReadContract } from 'wagmi';

export function useBallotContractReads(address: `0x${string}` | undefined) {
  const { data: chairPerson } = useReadContract({
    ...ballotContract,
    functionName: 'chairperson',
  });

  const { data: proposalsCount } = useReadContract({
    ...ballotContract,
    functionName: 'proposalsCount',
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

  const { data: votersCount, refetch: refetchVotersCount } = useReadContract({
    ...ballotContract,
    functionName: 'votersCount',
  });

  return {
    chairPerson,
    proposalsCount,
    winnerName,
    winningProposal,
    votersCount,
    refetchWinnerName,
    refetchWinningProposal,
    refetchVotersCount,
  };
}
