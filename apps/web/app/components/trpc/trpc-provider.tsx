'use client';

import type { PropsWithChildren } from 'react';
import { trpc } from '@/app/trpc';

// biome-ignore lint/style/useComponentExportOnlyModules: This is fine
const Component = ({ children }: PropsWithChildren) => children;

export const TrpcProvider = trpc.withTRPC(Component) as typeof Component;
