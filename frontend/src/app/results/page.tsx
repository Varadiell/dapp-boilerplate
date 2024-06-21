import { ProposalsList } from '@/components/shared/proposals-list';
import { WinningProposal } from '@/components/shared/winning-proposal';

export default function Results() {
  return (
    <>
      <h1>Results</h1>
      <WinningProposal />
      <ProposalsList />
    </>
  );
}
