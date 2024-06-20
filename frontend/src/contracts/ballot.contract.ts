export const ballotContract = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: [
    {
      inputs: [
        {
          internalType: 'bytes32[]',
          name: 'proposalNames',
          type: 'bytes32[]',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
      ],
      name: 'Delegate',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'voter',
          type: 'address',
        },
      ],
      name: 'GiveRight',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'voter',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'proposal',
          type: 'uint256',
        },
      ],
      name: 'Vote',
      type: 'event',
    },
    {
      inputs: [],
      name: 'chairperson',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
      ],
      name: 'delegate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'voter',
          type: 'address',
        },
      ],
      name: 'giveRightToVote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'proposals',
      outputs: [
        {
          internalType: 'bytes32',
          name: 'name',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'voteCount',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'proposal',
          type: 'uint256',
        },
      ],
      name: 'vote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'voters',
      outputs: [
        {
          internalType: 'uint256',
          name: 'weight',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'voted',
          type: 'bool',
        },
        {
          internalType: 'address',
          name: 'delegate',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'vote',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'winnerName',
      outputs: [
        {
          internalType: 'bytes32',
          name: 'winnerName_',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'winningProposal',
      outputs: [
        {
          internalType: 'uint256',
          name: 'winningProposal_',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;
