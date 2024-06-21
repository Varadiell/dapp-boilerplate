'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { ballotContract } from '@/contracts/ballot.contract';
import { bytesToString } from '@/utils/bytesToString';
import { DataType } from '@/contexts/data-provider';

export function useData(): DataType {
  const { isConnected, address } = useAccount();

  const { data: account, refetch: refetchAccount } = useReadContract({
    ...ballotContract,
    functionName: 'voters',
    args: [address ?? '0x'],
  });

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

  // TODO: update to use a do/while loop instead of a fixed limit
  const LIMIT = 5; // Number of proposals to fetch from the array.
  const { data: proposals, refetch: refetchProposals } = useReadContracts({
    contracts: [...new Array(LIMIT)].map((_, i) => ({
      ...ballotContract,
      functionName: 'proposals',
      args: [BigInt(Number(i))],
    })),
  });

  const proposalsRefined = proposals
    ?.filter((proposal) => proposal.status === 'success')
    .map((proposal) => {
      // Note: hard to believe, but the returned "proposals.result" typing is incorrect...
      const proposalResult = proposal.result as unknown as (
        | bigint
        | `0x${string}`
      )[];
      return {
        name: bytesToString(proposalResult[0] as string),
        voteCount: Number(proposalResult[1] as bigint),
      };
    });

  const proposalsCount = proposalsRefined?.length;
  const votesCount = proposalsRefined?.reduce(
    (total, proposal) => total + proposal.voteCount,
    0,
  );

  return {
    data: {
      account: account
        ? {
            weight: Number(account[0]),
            voted: account[1],
            delegate: String(account?.[2]),
            vote: Number(account[3]),
          }
        : undefined,
      chairPerson,
      proposals: proposalsRefined,
      proposalsCount,
      votesCount,
      winnerName: winnerName ? bytesToString(winnerName) : undefined,
      winningProposal:
        winningProposal !== undefined ? Number(winningProposal) : undefined,
    },
    isConnected: isConnected,
    refetchAccount,
    refetchProposals,
    refetchWinnerName,
    refetchWinningProposal,
  };
}
