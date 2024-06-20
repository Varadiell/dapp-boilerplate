'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ballotContract } from '@/contracts/ballot.contract';
import { useContract } from '@/hooks/useContract';
import { useData } from '@/hooks/useData';
import { bytesToString } from '@/utils/bytesToString';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export function VoteCard() {
  const {
    data: { proposals },
  } = useData();
  const [proposalId, setProposalId] = useState<string | undefined>(undefined);
  const { isConnected, isPending, writeContract } = useContract(() => {
    setProposalId('');
  });

  function submitVote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeContract({
      ...ballotContract,
      functionName: 'vote',
      args: [BigInt(Number(proposalId))],
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote</CardTitle>
        <CardDescription>
          As a registered voter, you can vote for a proposal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex-row gap-6" onSubmit={submitVote}>
          <div className="grid gap-3">
            <Label htmlFor="vote_proposal">Proposal</Label>
            <div className="flex gap-2">
              <Select
                required={true}
                value={proposalId}
                onValueChange={(value) => setProposalId(value)}
              >
                <SelectTrigger
                  className="w-full"
                  id="vote_proposal"
                  disabled={isPending || !isConnected}
                >
                  <SelectValue placeholder="Select a proposal..." />
                </SelectTrigger>
                <SelectContent>
                  {proposals &&
                    proposals.map((proposal, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {bytesToString((proposal as any).result[0])}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                className="min-w-32"
                disabled={isPending || !isConnected}
                type="submit"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>Vote</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
