'use client';

import { createTRPCContext, type TRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouterType } from '@zws.im/api/src/trpc/app.router';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouterType>();
export type TRPC = TRPCOptionsProxy<AppRouterType>;
