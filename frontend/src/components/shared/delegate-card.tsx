'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  abi as ballotAbi,
  address as ballotAddress,
} from '@/contracts/ballot.abi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContract } from '@/hooks/useContract';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

export function DelegateCard() {
  const [delegateAddress, setDelegateAddress] = useState<string>('');
  const { isConnected, isPending, writeContract } = useContract(() => {
    setDelegateAddress('');
  });

  function submitDelegate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeContract({
      address: ballotAddress,
      abi: ballotAbi,
      functionName: 'delegate',
      args: [delegateAddress],
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delegate</CardTitle>
        <CardDescription>
          As a registered voter, you can delegate your right to vote to another
          address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex-row gap-6" onSubmit={submitDelegate}>
          <div className="grid gap-3">
            <Label htmlFor="delegate_address">Address</Label>
            <div className="flex gap-2">
              <Input
                className="w-full"
                disabled={isPending || !isConnected}
                id="delegate_address"
                maxLength={42}
                minLength={42}
                onChange={(event) =>
                  setDelegateAddress(event.currentTarget.value)
                }
                placeholder="0x..."
                required={true}
                type="text"
                value={delegateAddress}
              />
              <Button
                className="min-w-32"
                disabled={isPending || !isConnected}
                type="submit"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>Delegate</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
