// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {Ballot} from "@/contracts/Ballot.sol";

bytes32 constant YES_B32 = bytes32("Yes");
bytes32 constant MAYBE_B32 = bytes32("Maybe");
bytes32 constant NO_B32 = bytes32("No");

contract BallotTestHelper is Test {
    event GiveRight(address indexed voter);
    event Delegate(address indexed from, address indexed to);
    event Vote(address indexed voter, uint proposal);

    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    address owner = makeAddr("user0");
    address addr1 = makeAddr("user1");
    address addr2 = makeAddr("user2");
    address addr3 = makeAddr("user3");

    Ballot public ballotContract;

    function testProposal(
        Ballot.Proposal memory _proposal,
        Ballot.Proposal memory _proposalToCompare
    ) internal pure {
        assertEq(_proposal.name, _proposalToCompare.name);
        assertEq(_proposal.voteCount, _proposalToCompare.voteCount);
    }

    function testVoter(
        Ballot.Voter memory _voter,
        Ballot.Voter memory _voterToCompare
    ) internal pure {
        assertEq(_voter.delegate, _voterToCompare.delegate);
        assertEq(_voter.vote, _voterToCompare.vote);
        assertEq(_voter.voted, _voterToCompare.voted);
        assertEq(_voter.weight, _voterToCompare.weight);
    }
}

contract Constructor_test is BallotTestHelper {
    function test_Initialization() public {
        bytes32[] memory propositions = new bytes32[](3);
        propositions[0] = YES_B32;
        propositions[1] = MAYBE_B32;
        propositions[2] = NO_B32;
        vm.prank(owner);
        ballotContract = new Ballot(propositions);
        assertEq(ballotContract.chairperson(), owner);
        (uint weight, bool voted, address delegate, uint vote) = ballotContract
            .voters(owner);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(1, false, address(0), 0)
        );
        (bytes32 name, uint voteCount) = ballotContract.proposals(0);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(YES_B32, 0)
        );
        (name, voteCount) = ballotContract.proposals(1);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(MAYBE_B32, 0)
        );
        (name, voteCount) = ballotContract.proposals(2);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(NO_B32, 0)
        );
    }
}
