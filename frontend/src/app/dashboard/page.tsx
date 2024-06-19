import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';
import { VoteCard } from '@/components/shared/vote-card';

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoteCard />
    </>
  );
}
