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

export function GiveRightToVoteCard() {
  return (
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
  );
}
