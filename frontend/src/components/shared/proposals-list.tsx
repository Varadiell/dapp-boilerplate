'use client';

import { DataContext } from '@/contexts/data-provider';
import { useContext } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';

export function ProposalsList() {
  const {
    data: { proposals },
  } = useContext(DataContext);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposals</CardTitle>
        <CardDescription>List of proposals</CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-1">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="max-w-1 text-right">Vote count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!proposals
            ? [...new Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-2/3" />
                  </TableCell>
                  <TableCell className="flex place-content-end">
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                </TableRow>
              ))
            : proposals?.map((proposal, index) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{proposal.name}</TableCell>
                  <TableCell className="text-right">
                    {proposal.voteCount}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </Card>
  );
}