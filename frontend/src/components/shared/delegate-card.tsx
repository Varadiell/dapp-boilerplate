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

export function DelegateCard() {
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
        <div className="flex-row gap-6">
          <div className="grid gap-3">
            <Label htmlFor="delegate_address">Address</Label>
            <div className="flex gap-2">
              <Input
                className="w-full"
                id="delegate_address"
                maxLength={42}
                minLength={42}
                name="give_rights_address"
                placeholder="0x..."
                type="text"
              />
              <Button className="min-w-32">Delegate</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
