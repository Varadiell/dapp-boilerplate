'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  abi as ballotAbi,
  address as ballotAddress,
} from '@/contracts/ballot.abi';
import { useContract } from '@/hooks/useContract';
import { LoaderCircle } from 'lucide-react';

export function GiveRightToVoteCard() {
  const { isPending, writeContract } = useContract();

  function submitGiveRights(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const give_rights_address = formData.get('give_rights_address');
    writeContract({
      address: ballotAddress,
      abi: ballotAbi,
      functionName: 'giveRightToVote',
      args: [give_rights_address],
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Give right to vote</CardTitle>
        <CardDescription>
          As an admin, you can give the right to vote to another address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex-row gap-6" onSubmit={submitGiveRights}>
          <div className="grid gap-3">
            <Label htmlFor="give_rights_address">Address</Label>
            <div className="flex gap-2">
              <Input
                className="w-full"
                disabled={isPending}
                id="give_rights_address"
                maxLength={42}
                minLength={42}
                name="give_rights_address"
                placeholder="0x..."
                type="text"
              />
              <Button className="min-w-32" disabled={isPending} type="submit">
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>Give rights</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
