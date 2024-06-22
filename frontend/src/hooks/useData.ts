'use client';

import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
} from 'wagmi';
import { ballotContract } from '@/contracts/ballot.contract';
import { bytesToString } from '@/utils/bytesToString';
import { DataType, EventLog } from '@/contexts/data-provider';
import { useState } from 'react';

export function useData(): DataType {
  const { isConnected, address } = useAccount();
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);

  useWatchContractEvent({
    ...ballotContract,
    onLogs: (logs) =>
      setEventLogs(
        logs.map((log) => ({
          ...log,
          eventName: log.eventName,
          args: log.args as Record<string, unknown>,
        })),
      ),
    pollingInterval: 12000, // Block time.
  });

  const { data: account, refetch: refetchAccount } = useReadContract({
    ...ballotContract,
    functionName: 'voters',
    args: [address!],
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

  const eventLogsCount = eventLogs?.length;
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
      eventLogs: eventLogs,
      eventLogsCount,
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
