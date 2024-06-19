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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const proposals: string[] = ['Yes', 'Maybe', 'No'];

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Give right to vote</CardTitle>
          <CardDescription>
            As an admin, you can give the right to vote to another address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex-row gap-6">
            <div className="grid gap-3">
              <Label htmlFor="give_rights_address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="give_rights_address"
                  type="text"
                  className="w-full"
                  placeholder="0x..."
                />
                <Button className="min-w-32">Give rights</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Delegate</CardTitle>
          <CardDescription>
            As a registered voter, you can delegate your right to vote to
            another address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex-row gap-6">
            <div className="grid gap-3">
              <Label htmlFor="delegate_address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="delegate_address"
                  type="text"
                  className="w-full"
                  placeholder="0x..."
                />
                <Button className="min-w-32">Delegate</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
    </>
  );
}
