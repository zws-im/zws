import { FaqOption } from './types';

export const faq: FaqOption[] = [
	{
		id: '0',
		title: <p>How does this tool work?</p>,
		content: (
			<p>
				ZWS uses zero width characters instead of the typical alphanumeric ones that URL shorteners use. When rendered,
				these characters appear invisible, but they're still there, which means that ZWS is able to use them to encode
				information about your URL.
			</p>
		),
	},
	{
		id: '1',
		title: <p>Why can I see some characters at the end of the link?</p>,
		content: (
			<>
				<p>
					We try to only use characters which don't render as anything, but some devices might render them as boxes. If
					you see this, please{' '}
					<a
						className='text-zws-purple-400 underline'
						href='https://github.com/zws-im/zws/issues/new'
						target='_blank'
						rel='noreferrer'
					>
						open a bug report
					</a>{' '}
					so we can address it!
				</p>
			</>
		),
	},
	{
		id: '2',
		title: (
			<p>
				Why doesn't ZWS work on <span className='text-zws-purple-400'>[chat service]</span>?
			</p>
		),
		content: (
			<p>
				Because zero width characters aren't commonly used, some chat services or social media platforms will strip them
				out. Which, unfortunately, prevents you from being able to share zws.im URLs on those platforms.
			</p>
		),
	},
];
export const faqObject = Object.fromEntries(faq.map((option) => [option.id, option]));
export const firstFaqOption = faq[0];
