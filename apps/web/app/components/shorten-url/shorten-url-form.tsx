'use client';

import { ArrowPathIcon, CheckIcon } from '@heroicons/react/20/solid';
import va from '@vercel/analytics';
import clsx from 'clsx';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { usePlausible } from '@/app/hooks/plausible';
import { trpc } from '@/app/trpc';
import * as motion from '../../motion';

export function ShortenUrlForm() {
	const [longUrl, setLongUrl] = useState('');
	const [finishedAt, setFinishedAt] = useState<number | undefined>(undefined);
	const plausible = usePlausible();

	const mutation = trpc.urls.shortenUrl.useMutation({
		onMutate: () => {
			setFinishedAt(undefined);
		},
		onSuccess: () => {
			setFinishedAt(Date.now());
		},
	});

	const justSucceeded = mutation.isSuccess && Date.now() - (finishedAt ?? 0) < 1.5e3;

	useEffect(() => {
		if (finishedAt) {
			const timer = setTimeout(() => {
				setFinishedAt(undefined);
			}, 1.5e3);

			return () => clearTimeout(timer);
		}
	}, [finishedAt]);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		va.track('Shorten URL');
		plausible('Shorten URL');

		mutation.mutate({ url: longUrl });
	};

	const copy = async (): Promise<void> => {
		if (mutation.data) {
			try {
				await navigator.clipboard.writeText(mutation.data);
			} catch {
				// Ignore errors
			}
		}
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setLongUrl(event.target.value);
	};

	return (
		<>
			<form className='flex h-14 w-full rounded-sm bg-white' onSubmit={handleSubmit}>
				<input
					className='placeholder-[rgba(10, 0, 37, 0.6)] h-full w-full rounded-l bg-transparent p-4 text-black outline-hidden'
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
						'text-zws-purple-500 font-bold hover:bg-purple-100 active:bg-purple-200 disabled:bg-purple-200': !(
							justSucceeded || mutation.isError
						),
						'text-zws-purple-900 bg-green-400': justSucceeded,
						'bg-red-500 text-white': mutation.isError,
					})}
					disabled={mutation.isPending}
					type='submit'
					layout={true}
				>
					{mutation.isPending && <ArrowPathIcon className='h-6 w-6 animate-spin opacity-50' />}
					{!(mutation.isPending || justSucceeded || mutation.isError) && 'کوتاه کن'}
					{mutation.isError && mutation.error.message}
					{justSucceeded && <CheckIcon className='h-6 w-6' />}
				</motion.button>
			</form>

			<div className='pt-4 text-center'>
				{mutation.data && !mutation.isPending ? (
					<button
						type='button'
						className='text-zws-purple-100 underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-80 active:opacity-60'
						onClick={copy}
					>
						{mutation.data} (برای کپی کلیک کنید)
					</button>
				) : (
					// Used to prevent layout shift when hiding the button
					<div className='h-6' />
				)}
			</div>
		</>
	);
}
