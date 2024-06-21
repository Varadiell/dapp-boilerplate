'use client';

import { useData } from '@/hooks/useData';
import * as React from 'react';
import { createContext } from 'react';

export interface DataType {
  data: {
    account:
      | { weight: number; voted: boolean; delegate: string; vote: number }
      | undefined;
    chairPerson: string | undefined;
    proposals: { name: string; voteCount: number }[] | undefined;
    proposalsCount: number | undefined;
    votesCount: number | undefined;
    winnerName: string | undefined;
    winningProposal: number | undefined;
  };
  isConnected: boolean;
  refetchAccount: () => void;
  refetchProposals: () => void;
  refetchWinnerName: () => void;
  refetchWinningProposal: () => void;
}

export const DataContext = createContext<DataType>({
  data: {
    account: undefined,
    chairPerson: undefined,
    proposals: [],
    proposalsCount: undefined,
    votesCount: undefined,
    winnerName: undefined,
    winningProposal: undefined,
  },
  isConnected: false,
  refetchAccount: () => undefined,
  refetchProposals: () => undefined,
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
