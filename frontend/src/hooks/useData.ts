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

  const LIMIT = 5; // Number of proposals to fetch from the array.
  const { data: proposals } = useReadContracts({
    contracts: [...new Array(LIMIT)].map((_, i) => ({
      ...ballotContract,
      functionName: 'proposals',
      args: [BigInt(Number(i))],
    })),
  });

  return {
    data: {
      chairPerson,
      proposals: proposals?.filter((proposal) => proposal.status === 'success'),
      winnerName,
      winningProposal,
    },
    isConnected: isConnected,
    refetchWinnerName,
    refetchWinningProposal,
  };
}
