'use client';

import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';
import { VoteCard } from '@/components/shared/vote-card';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataContext } from '@/contexts/data-provider';
import { useContext } from 'react';

export default function Dashboard() {
  const { data } = useContext(DataContext);

  return (
    <>
      <h1>Dashboard</h1>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
            Chair person
          </CardTitle>
          <CardDescription>Address: {data.chairPerson}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
            Winning proposal{' '}
            {data.winningProposal !== undefined && <>#{data.winningProposal}</>}
          </CardTitle>
          <CardDescription>Proposal: {data.winnerName}</CardDescription>
        </CardHeader>
      </Card>
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoteCard />
    </>
  );
}
