import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '@/typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

const YES_B32 = ethers.encodeBytes32String('Yes');
const MAYBE_B32 = ethers.encodeBytes32String('Maybe');
const NO_B32 = ethers.encodeBytes32String('No');

type Proposal = {
  name: string;
  voteCount: bigint;
};

type Voter = {
  delegate: string;
  vote: bigint;
  voted: boolean;
  weight: bigint;
};

function testVoter(voter: Voter, voterToCompare: Voter) {
  expect(voter.delegate).to.equal(
    ethers.encodeBytes32String(voterToCompare.delegate).slice(0, 42),
  );
  expect(voter.vote).to.equal(voterToCompare.vote);
  expect(voter.voted).to.equal(voterToCompare.voted);
  expect(voter.weight).to.equal(voterToCompare.weight);
}

function testProposal(proposal: Proposal, proposalToCompare: Proposal) {
  expect(proposal.name).to.equal(proposalToCompare.name);
  expect(proposal.voteCount).to.equal(proposalToCompare.voteCount);
}

describe('Voting tests', () => {
  let ballotContract: Ballot;
  let owner: HardhatEthersSigner,
    addr1: HardhatEthersSigner,
    addr2: HardhatEthersSigner;

  async function deployContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const ballotContract = await ethers.deployContract('Ballot', [
      [YES_B32, MAYBE_B32, NO_B32],
    ]);
    return { ballotContract, owner, addr1, addr2 };
  }

  beforeEach(async () => {
    const fixture = await loadFixture(deployContractFixture);
    ballotContract = fixture.ballotContract;
    owner = fixture.owner;
    addr1 = fixture.addr1;
    addr2 = fixture.addr2;
  });

  describe('constructor', () => {
    it('should deploy the contract with the correct default values, chair person address, chair person weight and proposals', async () => {
      expect(await ballotContract.chairperson()).to.equal(owner);
      testVoter(await ballotContract.voters(owner), {
        delegate: '',
        vote: 0n,
        voted: false,
        weight: 1n,
      });
      testProposal(await ballotContract.proposals(0), {
        name: YES_B32,
        voteCount: 0n,
      });
      testProposal(await ballotContract.proposals(1), {
        name: MAYBE_B32,
        voteCount: 0n,
      });
      testProposal(await ballotContract.proposals(2), {
        name: NO_B32,
        voteCount: 0n,
      });
      await expect(ballotContract.proposals(3)).to.be.revertedWithoutReason();
    });
  });

  describe('giveRightToVote', () => {
    it('should give the right to vote to the given address when the msg.sender is the chairperson, the voter did not vote and the voter weight is 0', async () => {
      await ballotContract.giveRightToVote(addr1);
      testVoter(await ballotContract.voters(addr1), {
        delegate: '',
        vote: 0n,
        voted: false,
        weight: 1n,
      });
    });

    it('should revert without reason when the voter weight is not 0', async () => {
      await ballotContract.giveRightToVote(addr1);
      await expect(
        ballotContract.connect(owner).giveRightToVote(addr1),
      ).to.be.revertedWithoutReason();
    });

    it('should revert with a message when the voter already voted', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.connect(addr1).vote(1);
      await expect(ballotContract.giveRightToVote(addr1)).to.be.revertedWith(
        'The voter already voted.',
      );
    });

    it('should revert with a message when the msg.sender is not the chairman', async () => {
      await expect(
        ballotContract.connect(addr1).giveRightToVote(addr2),
      ).to.be.revertedWith('Only chairperson can give right to vote.');
    });
  });
});
