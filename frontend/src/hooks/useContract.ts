'use client';

import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast as sonner } from 'sonner';

export function useContract() {
  const {
    data: writeContractHash,
    status: writeContractStatus,
    writeContract,
  } = useWriteContract();
  const { status: transactionStatus } = useWaitForTransactionReceipt({
    hash: writeContractHash,
  });

  useEffect(() => {
    if (writeContractStatus === 'error') {
      sonner.error('Error.', {
        description: 'Transaction failed.',
        position: 'bottom-right',
      });
    }
    if (transactionStatus === 'pending' && writeContractStatus === 'success') {
      sonner.info('Pending...', {
        description: 'Transaction is being processed...',
        position: 'bottom-right',
      });
    }
    if (transactionStatus === 'success') {
      sonner.success('Success!', {
        description: 'Transaction has succeeded!',
        position: 'bottom-right',
      });
    }
  }, [transactionStatus, writeContractStatus]);

  return {
    writeContract,
  };
}
