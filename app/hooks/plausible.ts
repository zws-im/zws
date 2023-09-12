import { usePlausible as baseUsePlausible } from 'next-plausible';

type PlausibleEvents = {
	'Shorten URL': never;
	'Check URL stats': never;
	'Clicked Vercel badge': never;
};

export const usePlausible = () => baseUsePlausible<PlausibleEvents>();
