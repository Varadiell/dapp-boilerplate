import { AccountInfo } from '@/components/shared/account-info';
import { ChairPerson } from '@/components/shared/chair-person';
import { ProposalsList } from '@/components/shared/proposals-list';
import { VotersCountCard } from '@/components/shared/voters-count-card';
import { WinningProposal } from '@/components/shared/winning-proposal';

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <AccountInfo />
      <ChairPerson />
      <VotersCountCard />
      <WinningProposal />
      <ProposalsList />
    </>
  );
}
