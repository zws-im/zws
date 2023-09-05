'use client';

import { delayMinimum } from '@/app/util/delay';
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/20/solid';
import va from '@vercel/analytics';
import { ChangeEvent, useEffect, useState } from 'react';
import { shortenUrlAction } from './action';

import { usePlausible } from '@/app/hooks/plausible';
import clsx from 'clsx';

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
		const result = await delayMinimum(shortenUrlAction(longUrl), 100);
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
			<form className='w-full h-14 bg-white rounded flex' onSubmit={handleSubmit}>
				<input
					className='w-full p-4 rounded-l outline-none h-full text-black placeholder-[rgba(10, 0, 37, 0.6)] bg-transparent'
					placeholder='https://github.com/zws-im/zws'
					type='url'
					name='url'
					value={longUrl}
					onChange={onChange}
					required={true}
					// rome-ignore lint/a11y/noAutofocus: Autofocus is essential here
					autoFocus={true}
				/>
				<button
					className={clsx('min-w-max h-full p-4 rounded-r transition-colors flex justify-center items-center', {
						'hover:bg-purple-100 active:bg-purple-200 disabled:bg-purple-200 text-zws-purple-500 font-bold': !(
							justSucceeded || error
						),
						'bg-green-400 text-stone-900': justSucceeded,
						'bg-red-500 text-white': error,
					})}
					disabled={loading}
					type='submit'
				>
					{loading && <ArrowPathIcon className='w-6 h-6 animate-spin opacity-50' />}
					{!(loading || justSucceeded || error) && 'Shorten'}
					{error}
					{justSucceeded && <CheckIcon className='w-6 h-6' />}
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
