import { DelegateCard } from '@/components/shared/delegate-card';
import { ProposalsList } from '@/components/shared/proposals-list';
import { VoteCard } from '@/components/shared/vote-card';

export default function Votes() {
  return (
    <>
      <h1>Votes</h1>
      <VoteCard />
      <DelegateCard />
      <ProposalsList />
      <div>TODO: use event logs to display the votes</div>
    </>
  );
}
