'use client';

import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';
import { VoteCard } from '@/components/shared/vote-card';
import { useData } from '@/hooks/useData';

export default function Dashboard() {
  const { data, refetchChairPerson } = useData();
  console.log(data);
  return (
    <>
      <h1>Dashboard</h1>
      123 {data.chairPerson}
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoteCard />
    </>
  );
}
