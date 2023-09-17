import Link from 'next/link';
import Logo from './logo/logo';

type NavbarItem = {
	content: string;
	href: string;
};

const items: NavbarItem[] = [
	{
		content: 'Stats',
		href: '/stats',
	},
	{
		content: 'Questions',
		href: '/#faq',
	},
	{
		content: 'API Docs',
		href: '/api-docs',
	},
	{
		content: 'GitHub',
		href: 'https://github.com/zws-im/zws',
	},
];

export default function Navbar() {
	return (
		<nav className='w-100 sticky top-0 bg-zws-purple-900/50 px-4 py-8 backdrop-blur'>
			<div className='container mx-auto flex justify-between'>
				<Link className='transition-opacity hover:opacity-80 active:opacity-60 md:flex md:space-x-4' href='/'>
					<div className='w-16 max-md:w-12'>
						<Logo />
					</div>
					<p className='text-lg font-bold max-md:hidden'>Zero Width Shortener</p>
				</Link>

				<ul className='flex justify-end space-x-6 lg:space-x-12'>
					{items.map((item) => {
						return (
							<li key={item.content}>
								<Link
									href={item.href}
									className='font-bold text-zws-purple-50 transition hover:text-opacity-80 active:text-opacity-60'
								>
									{item.content}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}
