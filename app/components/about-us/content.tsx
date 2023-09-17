export const aboutUsContent = (
	<>
		<p>
			Hi, I'm{' '}
			<a className='text-zws-purple-400 underline' href='https://jonahsnider.com' target='_blank' rel='noreferrer'>
				Jonah
			</a>
			, the creator of ZWS. I hacked together the first version of ZWS back in 2019, mostly just to see if the concept
			would actually work. It turns out it did work, and since then we've shortened a few hundred thousand URLs, and
			handled redirects millions of times.
		</p>

		<p>
			Over time, ZWS has gone through a lot of design iterations, on both the frontend and backend. If you're curious
			about how ZWS works internally, feel free to look at{' '}
			<a
				className='text-zws-purple-400 underline'
				href='https://github.com/zws-im/zws'
				target='_blank'
				rel='noreferrer'
			>
				the source code on GitHub
			</a>
			.
		</p>
	</>
);
