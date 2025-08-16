'use client';

import { useData } from '@/hooks/useData';
import * as React from 'react';
import { createContext } from 'react';
import { Log } from 'viem';

export type EventType = 'GiveRight' | 'Delegate' | 'Vote';

export type EventLog = Log & {
  args: Record<string, unknown>;
  eventName: EventType;
};

export interface DataType {
  data: {
    account:
      | { weight: number; voted: boolean; delegate: string; vote: number }
      | undefined;
    chairPerson: string | undefined;
    eventLogs: EventLog[] | undefined;
    eventLogsCount: number | undefined;
    proposals: { name: string; voteCount: number }[] | undefined;
    proposalsCount: number | undefined;
    votesCount: number | undefined;
    votersCount: number | undefined;
    walletAddress: `0x${string}` | undefined;
    winnerName: string | undefined;
    winningProposal: number | undefined;
  };
  isConnected: boolean;
  isProposalsLoading: boolean;
  isEventsLoading: boolean;
  refetchAccount: () => void;
  refetchProposals: () => void;
  refetchVotersCount: () => void;
  refetchWinnerName: () => void;
  refetchWinningProposal: () => void;
}

export const DataContext = createContext<DataType>({
  data: {
    account: undefined,
    chairPerson: undefined,
    eventLogs: undefined,
    eventLogsCount: undefined,
    proposals: undefined,
    proposalsCount: undefined,
    votesCount: undefined,
    votersCount: undefined,
    walletAddress: undefined,
    winnerName: undefined,
    winningProposal: undefined,
  },
  isConnected: false,
  isProposalsLoading: false,
  isEventsLoading: false,
  refetchAccount: () => undefined,
  refetchProposals: () => undefined,
  refetchVotersCount: () => undefined,
  refetchWinnerName: () => undefined,
  refetchWinningProposal: () => undefined,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const data = useData();
  console.log(data);
  return (
    <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>
  );
}
