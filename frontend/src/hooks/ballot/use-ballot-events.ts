'use client';

import { ballotContract } from '@/contracts/ballot.contract';
import type { EventLog } from '@/types/ballot-data';
import type { Log } from 'viem';
import { getContractEvents } from 'viem/actions';
import { useCallback, useEffect, useState } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';

const { address, abi, fromBlock } = ballotContract;

const POLL_MS = 10_000;

function logKey(log: Pick<Log, 'transactionHash' | 'logIndex'>): string {
  return `${log.transactionHash}-${log.logIndex}`;
}

/** `onLogs` reçoit des lots par intervalle de poll, pas l’historique complet — on fusionne. */
function mergeEventLogs(prev: EventLog[], incoming: Log[]): EventLog[] {
  if (incoming.length === 0) return prev;
  const map = new Map<string, EventLog>();
  for (const log of prev) {
    map.set(logKey(log), log);
  }
  for (const log of incoming) {
    map.set(logKey(log), log as EventLog);
  }
  return Array.from(map.values()).sort(
    (a, b) => Number(a.blockNumber) - Number(b.blockNumber),
  );
}

export function useBallotEvents() {
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const publicClient = usePublicClient();

  const onLogs = useCallback((logs: Log[]) => {
    setEventLogs((prev) => mergeEventLogs(prev ?? [], logs));
    setIsEventsLoading(false);
  }, []);

  const onError = useCallback(() => {
    setIsEventsLoading(false);
  }, []);

  // `address` / `fromBlock` are static (module); this effect only tracks `publicClient`.
  useEffect(() => {
    if (!publicClient) return;

    let cancelled = false;

    void (async () => {
      try {
        const initial = await getContractEvents(publicClient, {
          address,
          abi,
          fromBlock,
          toBlock: 'latest',
        });
        if (cancelled) return;
        setEventLogs((prev) => mergeEventLogs(prev ?? [], initial));
      } catch {
        /* RPC / wrong chain — le watch peut quand même alimenter. */
      } finally {
        if (!cancelled) setIsEventsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publicClient]);

  useWatchContractEvent({
    address,
    abi,
    fromBlock,
    onLogs,
    onError,
    poll: true,
    pollingInterval: POLL_MS,
  });

  return { eventLogs, isEventsLoading };
}
