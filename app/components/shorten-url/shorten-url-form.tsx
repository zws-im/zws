'use client';

import { delayMinimum } from '@/app/util/delay';
import { useState } from 'react';
import { shortenUrlAction } from './action';
import clsx from 'clsx';

export default function ShortenUrlForm() {
	const [longUrl, setLongUrl] = useState('');
	const [shortenedUrl, setShortenedUrl] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		setShortenedUrl(undefined);
		const shortened = await delayMinimum(shortenUrlAction(longUrl), 100);
		setLoading(false);

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

	// TODO: Show a little tooltip popup that the URL was copied to the clipboard

	return (
		<div>
			<form className='w-full h-14 bg-white rounded flex items-center ju.stify-between' onSubmit={handleSubmit}>
				<input
					className='w-full p-4 rounded-l outline-none h-full text-black placeholder-[rgba(10, 0, 37, 0.6)]'
					placeholder='https://github.com/zws-im/zws'
					type='url'
					name='url'
					value={longUrl}
					onChange={(event) => setLongUrl(event.target.value)}
					required
				/>
				<button
					className='h-full p-4 rounded-r transition-colors text-[#4413CB] font-bold hover:bg-purple-100 active:bg-purple-200 disabled:bg-purple-200 disabled:text-opacity-50'
					disabled={loading}
					type='submit'
				>
					Shorten
				</button>
			</form>

			<div
				className={clsx('pt-4 text-[#DCD5F0]', {
					visible: shortenedUrl && !loading,
					invisible: !shortenedUrl || loading,
				})}
			>
				<button type='button' onClick={copy}>
					<p className='underline decoration-dotted underline-offset-2 hover:opacity-80 active:opacity-60 transition-all'>
						{shortenedUrl} (click to copy)
					</p>
				</button>
			</div>
		</div>
	);
}
