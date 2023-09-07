'use client';

import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type Props = {
	setShortUrl: (shortUrl: string) => void;
	isLoading: boolean;
	error: string | undefined;
};

const baseUrl = (process.env.NEXT_PUBLIC_SHORTENED_BASE_URL ?? 'https://zws.im').replace(/\/?$/, '/');
const VALID_URL_EXPRESSION = new RegExp(`^${baseUrl}.+$`);

export default function UrlStatsInput({ setShortUrl, isLoading, error }: Props) {
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
			className={clsx('w-full h-14 rounded flex bg-white transition', {
				'border-4 border-red-500': !valid,
			})}
		>
			<input
				className={'w-full p-4 rounded-l outline-none h-full text-black placeholder-[rgba(10, 0, 37, 0.6)]'}
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
				className={clsx('min-w-max h-full p-4 rounded-r transition-colors', {
					'bg-red-500 text-white': valid && error,
				})}
			>
				{valid && isLoading && <ArrowPathIcon className='w-6 h-6 animate-spin text-zws-purple-500' />}
				{valid && error && (
					<p className='align-middle'>
						<ExclamationCircleIcon className='w-6 h-6 inline mr-2' />
						{error}
					</p>
				)}
			</div>
		</div>
	);
}
