import { AccountInfo } from '@/components/shared/account-info';
import { ChairPerson } from '@/components/shared/chair-person';
import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';
import { ProposalsList } from '@/components/shared/proposals-list';
import { VoteCard } from '@/components/shared/vote-card';
import { WinningProposal } from '@/components/shared/winning-proposal';

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <AccountInfo />
      <ChairPerson />
      <WinningProposal />
      <ProposalsList />
      <GiveRightToVoteCard />
      <DelegateCard />
      <VoteCard />
    </>
  );
}
