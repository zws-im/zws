'use client';

import { useEffect } from 'react';

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return 'it is over';
}
