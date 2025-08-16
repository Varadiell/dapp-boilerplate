import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';
import { VoterEventsTable } from '@/components/shared/voter-events-table';

export default function Voters() {
  return (
    <>
      <h1>Voters</h1>
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoterEventsTable />
    </>
  );
}
