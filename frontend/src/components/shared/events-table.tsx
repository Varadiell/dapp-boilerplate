'use client';

import { useContext } from 'react';
import { DataContext, EventType } from '@/contexts/data-provider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface EventsTableProps {
  title?: string;
  description?: string;
  eventTypes?: EventType[];
  maxEvents?: number;
}

export function EventsTable({
  title = 'Recent Events',
  description = 'The last 5 events from the ballot contract.',
  eventTypes = ['GiveRight', 'Delegate', 'Vote'],
  maxEvents = 5,
}: EventsTableProps) {
  const {
    data: { eventLogs },
    isEventsLoading,
  } = useContext(DataContext);

  // Filter events by type and get the last N events.
  const filteredEvents =
    eventLogs?.filter((event) => eventTypes.includes(event.eventName)) || [];

  const lastEvents = filteredEvents.slice(-maxEvents).reverse();

  // Show skeletons only when events are still loading.
  if (isEventsLoading) {
    return (
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {Array.from({ length: maxEvents }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show "No events found" when eventLogs is an empty array or has no matching events.
  if (lastEvents.length === 0) {
    return (
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  function getEventBadge(eventName: string) {
    switch (eventName) {
      case 'GiveRight':
        return <Badge className="bg-green-600">Registration</Badge>;
      case 'Delegate':
        return <Badge className="bg-blue-600">Delegation</Badge>;
      case 'Vote':
        return <Badge className="bg-purple-600">Vote</Badge>;
      default:
        return <Badge variant="secondary">{eventName}</Badge>;
    }
  }

  function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatEventDetails(event: any) {
    switch (event.eventName) {
      case 'GiveRight':
        return `Voter ${formatAddress(String(event.args['voter']))} was registered`;
      case 'Delegate':
        return `${formatAddress(String(event.args['from']))} delegated to ${formatAddress(String(event.args['to']))}`;
      case 'Vote':
        return `Voter ${formatAddress(String(event.args['voter']))} voted for proposal ${Number(event.args['proposal'])}`;
      default:
        return 'Unknown event';
    }
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lastEvents.map((event, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant="default">{event.eventName}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatEventDetails(event)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {Number(event.blockNumber)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {event.transactionHash
                    ? formatAddress(event.transactionHash)
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
