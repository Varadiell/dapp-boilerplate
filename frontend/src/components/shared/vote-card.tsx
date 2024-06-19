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

const proposals: string[] = ['Yes', 'Maybe', 'No']; // TODO: fetch

export function VoteCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote</CardTitle>
        <CardDescription>
          As a registered voter, you can vote for a proposal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex-row gap-6">
          <div className="grid gap-3">
            <Label htmlFor="vote_proposal">Proposal</Label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-full" id="vote_proposal">
                  <SelectValue placeholder="Select a proposal..." />
                </SelectTrigger>
                <SelectContent>
                  {proposals.map((proposal, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {proposal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="min-w-32">Vote</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
