'use client';

import { usePlausible } from '@/app/hooks/plausible';
import { delayMinimum } from '@/app/util/delay';
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/20/solid';
import va from '@vercel/analytics';
import clsx from 'clsx';
import { ChangeEvent, useEffect, useState } from 'react';
import * as motion from '../../motion';
import { shortenUrlAction } from './action';

export default function ShortenUrlForm() {
	const [longUrl, setLongUrl] = useState('');
	const [shortenedUrl, setShortenedUrl] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [finishedAt, setFinishedAt] = useState<number | undefined>(undefined);
	const justSucceeded = Boolean(shortenedUrl) && !loading && !error && Date.now() - (finishedAt ?? 0) < 1.5e3;
	const plausible = usePlausible();

	useEffect(() => {
		if (finishedAt) {
			const timer = setTimeout(() => {
				setFinishedAt(undefined);
			}, 1.5e3);

			return () => clearTimeout(timer);
		}
	}, [finishedAt]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		setFinishedAt(undefined);
		setShortenedUrl(undefined);
		setError(undefined);
		const result = await delayMinimum(shortenUrlAction(longUrl), 200);
		va.track('Shorten URL');
		plausible('Shorten URL');
		setLoading(false);
		setFinishedAt(Date.now());

		if (result.error) {
			setError(result.error);
		} else if (result.shortened) {
			if ('url' in result.shortened) {
				setShortenedUrl(result.shortened.url);
			} else if ('short' in result) {
				// Get base url of this page
				setShortenedUrl(new URL(result.shortened.short, window.location.href).toString());
			}
		}
	};

	const copy = async (): Promise<void> => {
		if (shortenedUrl) {
			try {
				await navigator.clipboard.writeText(shortenedUrl);
			} catch {}
		}
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setLongUrl(event.target.value);
		setError(undefined);
	};

	return (
		<>
			<form className='flex h-14 w-full rounded bg-white' onSubmit={handleSubmit}>
				<input
					className='placeholder-[rgba(10, 0, 37, 0.6)] h-full w-full rounded-l bg-transparent p-4 text-black outline-none'
					placeholder='https://github.com/zws-im/zws'
					type='url'
					name='url'
					value={longUrl}
					onChange={onChange}
					required={true}
					// biome-ignore lint/a11y/noAutofocus: Autofocus is essential here
					autoFocus={true}
				/>
				<motion.button
					className={clsx('flex h-full min-w-max items-center justify-center rounded-r p-4 transition-colors', {
						'font-bold text-zws-purple-500 hover:bg-purple-100 active:bg-purple-200 disabled:bg-purple-200': !(
							justSucceeded || error
						),
						'bg-green-400 text-zws-purple-900': justSucceeded,
						'bg-red-500 text-white': error,
					})}
					disabled={loading}
					type='submit'
					layout={true}
				>
					{loading && <ArrowPathIcon className='h-6 w-6 animate-spin opacity-50' />}
					{!(loading || justSucceeded || error) && 'Shorten'}
					{error}
					{justSucceeded && <CheckIcon className='h-6 w-6' />}
				</motion.button>
			</form>

			<div className='pt-4 text-center'>
				{shortenedUrl && !loading ? (
					<button
						type='button'
						className='text-zws-purple-100 underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-80 active:opacity-60'
						onClick={copy}
					>
						{shortenedUrl} (click to copy)
					</button>
				) : (
					// Used to prevent layout shift when hiding the button
					<div className='h-6' />
				)}
			</div>
		</>
	);
}
