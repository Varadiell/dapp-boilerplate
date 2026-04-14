'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ballotContract } from '@/contracts/ballot.contract';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBallotVoter } from '@/hooks/ballot/use-ballot-voter';
import { useContract } from '@/hooks/useContract';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getAddress, isAddress } from 'viem';
import { useDataStore } from '@/stores/use-data-store';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

export function DelegateCard() {
  const { t } = useTranslation('common');
  const [delegateAddress, setDelegateAddress] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { account: voterTuple, isPending: voterLoading } =
    useBallotVoter(address);
  const { refetchAccount } = useDataStore(
    useShallow((s) => ({ refetchAccount: s.refetchAccount })),
  );
  const { isPending: isSubmitting, writeContract } = useContract(() => {
    setDelegateAddress('');
    refetchAccount();
  });

  if (!address) {
    return null;
  }

  if (voterLoading) {
    return (
      <Card data-testid="e2e-delegate-card">
        <CardHeader className="bg-muted/50">
          <CardTitle>{t('delegate.title')}</CardTitle>
          <CardDescription>{t('delegate.description')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div
            className="h-24 animate-pulse rounded-md bg-muted"
            data-testid="e2e-delegate-loading"
          />
        </CardContent>
      </Card>
    );
  }

  const weight = voterTuple ? Number(voterTuple[0]) : 0;
  if (weight === 0) {
    return null;
  }

  const hasVoted = voterTuple ? Boolean(voterTuple[1]) : false;

  function submitDelegate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = delegateAddress.trim();
    if (!isAddress(trimmed)) {
      toast.error(t('delegate.invalidAddress'));
      return;
    }
    writeContract({
      ...ballotContract,
      functionName: 'delegate',
      args: [getAddress(trimmed)],
    });
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle>{t('delegate.title')}</CardTitle>
        <CardDescription>{t('delegate.description')}</CardDescription>
        <p className="text-sm text-muted-foreground pt-1">
          {t('delegate.yourWeight')}:{' '}
          <span className="font-medium">{weight}</span>
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {hasVoted ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {t('delegate.cannotDelegate')}
            </p>
          </div>
        ) : (
          <form className="flex-row gap-6" onSubmit={submitDelegate}>
            <div className="grid gap-3">
              <Label htmlFor="delegate_address">{t('delegate.address')}</Label>
              <div className="flex gap-2">
                <Input
                  data-testid="e2e-delegate-address"
                  className="w-full"
                  disabled={isSubmitting || !isConnected}
                  id="delegate_address"
                  maxLength={42}
                  minLength={42}
                  onChange={(event) =>
                    setDelegateAddress(event.currentTarget.value)
                  }
                  placeholder={t('delegate.placeholder')}
                  required={true}
                  type="text"
                  value={delegateAddress}
                />
                <Button
                  data-testid="e2e-delegate-submit"
                  className="min-w-32"
                  disabled={isSubmitting || !isConnected || !delegateAddress}
                  type="submit"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <>{t('delegate.submit')}</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
