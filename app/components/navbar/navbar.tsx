import Link from 'next/link';
import NavbarLogo from './navbar-logo';

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
		content: 'Docs',
		href: '/docs',
	},
	{
		content: 'GitHub',
		href: 'https://github.com/zws-im/zws',
	},
];

export default function Navbar() {
	return (
		<nav className='py-8 w-full flex justify-between sticky top-0 bg-[#140A2E]/50 backdrop-blur'>
			<NavbarLogo />

			<ul className='flex justify-end space-x-6 lg:space-x-12'>
				{items.map((item, index) => {
					return (
						<li key={item.content}>
							<Link
								href={item.href}
								className='font-bold transition text-[#EDE7FF] hover:text-opacity-80 active:text-opacity-60'
							>
								{item.content}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
