'use client';

import { useContext } from 'react';
import { DataContext } from '@/contexts/data-provider';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VotersCountCard() {
  const {
    data: { votersCount },
  } = useContext(DataContext);

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
          Voters count
        </CardTitle>
        <CardDescription>
          The total number of registered voters in The Ballot Project.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-3">
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-5 w-5 mr-2" />
                Total voters
              </dt>
              <dd>
                {!votersCount ? (
                  <Skeleton className="h-6 w-16 rounded-full" />
                ) : (
                  <Badge className="h-6" variant="secondary">
                    {votersCount}
                  </Badge>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
