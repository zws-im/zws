'use client';

import { trpc } from '@/app/trpc';
import type { PropsWithChildren } from 'react';

const Component = ({ children }: PropsWithChildren) => children;

export const TrpcProvider = trpc.withTRPC(Component) as typeof Component;
