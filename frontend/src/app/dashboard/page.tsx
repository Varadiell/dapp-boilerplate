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
import { fromHex } from 'viem';

export default function Dashboard() {
  const { data } = useData();

  return (
    <>
      <h1>Dashboard</h1>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-4xl">Chair person</CardTitle>
          <CardDescription>Address: {data.chairPerson}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-4xl flex">
            Winning proposal{' '}
            {data.winningProposal !== undefined && (
              <>#{Number(data.winningProposal)}</>
            )}
          </CardTitle>
          <CardDescription className="flex">
            Proposal:{' '}
            {data.winnerName &&
              fromHex(
                data.winnerName.replace(/0+$/, '') as `0x${string}`,
                'string',
              ).trim()}
          </CardDescription>
        </CardHeader>
      </Card>
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoteCard />
    </>
  );
}
