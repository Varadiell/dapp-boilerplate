import { ProposalsList } from '@/components/shared/proposals-list';
import { VoteCard } from '@/components/shared/vote-card';
import { WinningProposal } from '@/components/shared/winning-proposal';
import { VoteEventsTable } from '@/components/shared/vote-events-table';

export default function Votes() {
  return (
    <>
      <h1>Votes</h1>
      <VoteCard />
      <WinningProposal />
      <ProposalsList />
      <VoteEventsTable />
    </>
  );
}
