'use client';

import { DataType, useData } from '@/hooks/useData';
import * as React from 'react';
import { createContext } from 'react';

export const DataContext = createContext<DataType>({
  data: {
    chairPerson: undefined,
    proposals: [],
    winnerName: undefined,
    winningProposal: undefined,
  },
  isConnected: false,
  refetchWinnerName: () => undefined,
  refetchWinningProposal: () => undefined,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const data = useData();

  return (
    <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>
  );
}
