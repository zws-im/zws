'use client';

import { delayMinimum } from '@/app/util/delay';
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { shortenUrlAction } from './action';
import va from '@vercel/analytics';

import clsx from 'clsx';

export default function ShortenUrlForm() {
	const [longUrl, setLongUrl] = useState('');
	const [shortenedUrl, setShortenedUrl] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [finishedAt, setFinishedAt] = useState<number | undefined>(undefined);
	const justFinished = Date.now() - (finishedAt ?? 0) < 1.5e3;

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
		const shortened = await delayMinimum(shortenUrlAction(longUrl), 100);
		va.track('Shorten URL');
		setLoading(false);
		setFinishedAt(Date.now());

		if ('url' in shortened) {
			setShortenedUrl(shortened.url);
		} else {
			// Get base url of this page
			setShortenedUrl(new URL(shortened.short, window.location.href).toString());
		}
	};

	const copy = async (): Promise<void> => {
		if (shortenedUrl) {
			try {
				await navigator.clipboard.writeText(shortenedUrl);
			} catch {}
		}
	};

	return (
		<>
			<form className='w-full h-14 bg-white rounded flex' onSubmit={handleSubmit}>
				<input
					className='w-full p-4 rounded-l outline-none h-full text-black placeholder-[rgba(10, 0, 37, 0.6)] bg-transparent'
					placeholder='https://github.com/zws-im/zws'
					type='url'
					name='url'
					value={longUrl}
					onChange={(event) => setLongUrl(event.target.value)}
					required
					// rome-ignore lint/a11y/noAutofocus: Autofocus is essential here
					autoFocus
				/>
				<button
					className={clsx('w-28 h-full p-4 rounded-r transition-colors font-bold flex justify-center items-center', {
						'hover:bg-purple-100 active:bg-purple-200 disabled:bg-purple-200 text-zws-purple-500': !justFinished,
						'bg-green-400 text-stone-900': justFinished,
					})}
					disabled={loading}
					type='submit'
				>
					{loading && <ArrowPathIcon className='w-6 h-6 animate-spin opacity-50' />}
					{!loading && !justFinished && <>Shorten</>}
					{justFinished && <CheckIcon className='w-6 h-6' />}
				</button>
			</form>

			<div className='pt-4 text-center'>
				{shortenedUrl && !loading ? (
					<button
						type='button'
						className='text-zws-purple-100 underline decoration-dotted underline-offset-2 hover:opacity-80 active:opacity-60 transition-opacity'
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
