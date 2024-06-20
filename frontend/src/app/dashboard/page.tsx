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
import { useData } from '@/hooks/useData';
import { bytesToString } from '@/utils/bytesToString';

export default function Dashboard() {
  const { data } = useData();

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
            {data.winningProposal !== undefined && (
              <>#{Number(data.winningProposal)}</>
            )}
          </CardTitle>
          <CardDescription>
            Proposal: {data.winnerName && bytesToString(data.winnerName)}
          </CardDescription>
        </CardHeader>
      </Card>
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoteCard />
    </>
  );
}
