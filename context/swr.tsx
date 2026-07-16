'use client';

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { swrFetcher } from '@/lib/apiClient';

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        dedupingInterval: 60000,
        focusThrottleInterval: 300000,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
