import Link from 'next/link';
import Logo from '../logo';
import * as motion from '../../motion';

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
		content: 'GitHub',
		href: 'https://github.com/zws-im/zws',
	},
];

export default function Navbar() {
	return (
		<nav className='px-4 py-8 w-100 sticky top-0 bg-zws-purple-900/50 backdrop-blur'>
			<div className='container mx-auto flex justify-between'>
				<Link className='transition-opacity hover:opacity-80 active:opacity-60' href='/'>
					<motion.div
						className='md:flex md:space-x-4'
						initial={{
							opacity: 0,
							x: -5,
						}}
						animate={{
							opacity: 1,
							x: 0,
						}}
						transition={{ delay: 1 }}
					>
						<div className='w-16 max-md:w-12'>
							<Logo />
						</div>
						<p className='font-bold text-lg max-md:hidden'>Zero Width Shortener</p>
					</motion.div>
				</Link>

				<motion.ul
					className='flex justify-end space-x-6 lg:space-x-12'
					initial={{
						opacity: 0,
						x: 5,
					}}
					animate={{
						opacity: 1,
						x: 0,
					}}
					transition={{ delay: 1 }}
				>
					{items.map((item) => {
						return (
							<li key={item.content}>
								<Link
									href={item.href}
									className='font-bold transition text-zws-purple-50 hover:text-opacity-80 active:text-opacity-60'
								>
									{item.content}
								</Link>
							</li>
						);
					})}
				</motion.ul>
			</div>
		</nav>
	);
}
