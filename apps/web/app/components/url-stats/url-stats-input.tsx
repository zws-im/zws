'use client';

import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type Props = {
	setShortUrl: (shortUrl: string) => void;
	isLoading: boolean;
	error: string | undefined;
};

const baseUrl = (process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://zws.im').replace(/\/?$/, '/');
const VALID_URL_EXPRESSION = new RegExp(`^${baseUrl}.+$`);

export function UrlStatsInput({ setShortUrl, isLoading, error }: Props) {
	const [shortUrl, setShortUrlLocal] = useState('');

	const valid = shortUrl === '' || VALID_URL_EXPRESSION.test(shortUrl);

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShortUrlLocal(event.target.value);
	};

	useEffect(() => {
		if (valid) {
			setShortUrl(shortUrl);
		}
	}, [shortUrl, valid, setShortUrl]);

	return (
		<div
			className={clsx('flex h-14 w-full rounded bg-white transition', {
				'border-4 border-red-500': !valid,
			})}
		>
			<input
				className={
					'placeholder-[rgba(10, 0, 37, 0.6)] h-full w-full rounded-l bg-transparent p-4 text-black outline-none'
				}
				placeholder={baseUrl}
				type='url'
				name='url'
				value={shortUrl}
				onChange={onChange}
				required={true}
				// biome-ignore lint/a11y/noAutofocus: Autofocus is essential here
				autoFocus={true}
			/>
			<div
				className={clsx('h-full min-w-max rounded-r p-4 transition-colors', {
					'bg-red-500 text-white': valid && error,
				})}
			>
				{valid && isLoading && <ArrowPathIcon className='text-zws-purple-500 h-6 w-6 animate-spin' />}
				{valid && error && (
					<p className='align-middle'>
						<ExclamationCircleIcon className='mr-2 inline h-6 w-6' />
						{error}
					</p>
				)}
			</div>
		</div>
	);
}
