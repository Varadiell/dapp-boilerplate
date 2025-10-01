import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';
import { VoterEventsTable } from '@/components/shared/voter-events-table';
import { VotersCountCard } from '@/components/shared/voters-count-card';

export default function Voters() {
  return (
    <>
      <h1>Voters</h1>
      <GiveRightToVoteCard />
      <DelegateCard />
      <VotersCountCard />
      <VoterEventsTable />
    </>
  );
}
