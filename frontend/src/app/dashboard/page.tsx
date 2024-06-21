'use client';

import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';
import { ProposalsList } from '@/components/shared/proposals-list';
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
  const {
    data: { chairPerson, winnerName, winningProposal },
  } = useContext(DataContext);

  return (
    <>
      <h1>Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
            Chair person
          </CardTitle>
          <CardDescription>Address: {chairPerson}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
            Winning proposal{' '}
            {winningProposal !== undefined && <>#{winningProposal}</>}
          </CardTitle>
          <CardDescription>Proposal: {winnerName}</CardDescription>
        </CardHeader>
      </Card>
      <ProposalsList />
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoteCard />
    </>
  );
}
