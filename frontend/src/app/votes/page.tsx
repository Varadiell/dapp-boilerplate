import { ProposalsList } from '@/components/shared/proposals-list';
import { VoteCard } from '@/components/shared/vote-card';

export default function Votes() {
  return (
    <>
      <h1>Votes</h1>
      <VoteCard />
      <ProposalsList />
      <div>TODO: use event logs to display the votes</div>
    </>
  );
}
